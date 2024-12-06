<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>REPFORA</h1>
      </div>
      <img src="https://senasofiaplus.xyz/wp-content/uploads/2023/10/logo-del-sena-01.png" alt="Logo SENA"
        class="logo" />
      <h2 class="login-title">LOGIN</h2>
      <hr />
      <div class="container-form">
        <q-form ref="formRef" @submit="handleSubmit">
          <div class="form-group">
            <q-select square filled id="rol" v-model="formData.rol" label="ROL" @update:model-value="handleRoleChange"
              :rules="[validateRequiredRol, validateRol]" lazy-rules :options="roles"></q-select>
          </div>

          <div v-if="isRol">
            <div class="form-group">
              <q-input type="text" v-model="formData.email" label="Email" filled
                :rules="[validateRequiredEmail, validateEmail]" lazy-rules />
              <br>

              <q-input v-if="formData.rol === 'CONSULTOR'" type="text" v-model="formData.document" label="Documento"
                filled :rules="[validateRequiredDocument, validateDocument]" lazy-rules />

              <q-input v-if="formData.rol !== 'CONSULTOR'" :type="isPwd ? 'password' : 'text'" id="password"
                v-model="formData.password" label="Password" filled :rules="[validateRequiredPassword, validatePassword]" lazy-rules  >
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
            </div>
            <q-btn type="submit" class="login-button" label="INICIAR SESIÓN" color="primary" :loading="loading"
              unelevated />
          </div>
        </q-form>
      </div>
      <p>
        <a href="#" @click="forgotPassword" class="forgot-password">Olvidé mi contraseña</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { postData } from '../services/ApiClient.js';
import { notifySuccessRequest, notifyErrorRequest, notifyWarningRequest } from '../composables/useNotify.js';
import { useAuthStore } from "../stores/useAuth.js";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const isPwd = ref(true);
const isRol = ref(false);
const formRef = ref(null);
const formData = ref({
  rol: '',
  email: '',
  password: '',
  document: ''
});

const validateRequiredEmail = (v) => !!v || 'Este campo Email es obligatorio';
const validateRequiredDocument = (v) => !!v || 'Este campo Documento es obligatorio';
const validateRequiredPassword = (v) => !!v || 'Este campo Contraseña es obligatorio';
const validateRequiredRol = (v) => !!v || 'Este campo Rol es obligatorio';
const validateEmail = (v) => /.+@.+\..+/.test(v) || 'Correo electrónico no válido';
const validateDocument = (v) => v.length === 10 || 'Documento no válido';
const validatePassword = (v) => v.length >= 6 || 'Contraseña debe tener al menos 6 caracteres';
const validateRol = (v) => {
  const validRoles = ['CONSULTOR', 'ADMIN', 'INSTRUCTOR'];
  return validRoles.includes(v?.value || v) || 'Rol no válido';
};

function resetForm() {
  formData.value.email = '',
    formData.value.password = '',
    formData.value.document = ''
}

const roles = [
  { label: 'CONSULTOR', value: 'CONSULTOR' },
  { label: 'ADMINISTRADOR', value: 'ADMIN' },
  { label: 'INSTRUCTOR', value: 'INSTRUCTOR' }
];

const handleRoleChange = (value) => {
  formData.value.rol = value.value
  isRol.value = true;
  resetForm();
};

const handleSubmit = async () => {
  const isValid = await formRef.value.validate();

  if (!isValid) {
    notifyWarningRequest('Por favor, complete todos los campos correctamente');
    return;
  }

  let loginUrl;
  if (formData.value.rol === 'CONSULTOR') {
    loginUrl = '/apprendice/loginApprentice';
  } else if (formData.value.rol === 'ADMIN') {
    loginUrl = '/Repfora/loginAdmin';
  } else if (formData.value.rol === 'INSTRUCTOR') {
    loginUrl = '/Repfora/loginInstructors';
  } else {
    notifyErrorRequest('Rol no válido');
    return;
  }
  loading.value = true;
  try {
    const requestData = {
      role: formData.value.rol,
      email: formData.value.email,
      password: formData.value.password,
      ...(formData.value.rol === 'CONSULTOR' && { numDocument: formData.value.document })
    };
    const response = await postData(loginUrl, requestData);
    authStore.setToken(response.token);
    authStore.setRol(formData.value.rol);
    authStore.setEmail(formData.value.email); 
    localStorage.setItem("apprenticeDocument", formData.value.document);
    localStorage.setItem("userEmail", response.email);

    notifySuccessRequest('Inicio de sesión exitoso');

    if (formData.value.rol === 'CONSULTOR') {
      router.push('/consultant');
    } else {
      router.push({
        path: '/layouts',
        query: { rol: formData.value.rol },
      });
    }

    resetForm()
  } catch (error) {
    let messageError;
    if (error.response?.data?.errors?.length > 0) {
      messageError = error.response.data.errors[0].msg;
    } else if (error.response?.data?.data?.msg) {
      messageError = 'Usuario/contraseña incorrectos. Intenta nuevamente.';
    } else {
      messageError = 'Error, Por favor inténtelo más tarde.';
    }
    notifyErrorRequest(messageError);
  } finally {
    loading.value = false;
  }
};

const forgotPassword = () => {
  notifyWarningRequest('Funcionalidad de recuperación de contraseña aún no implementada.');
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  margin: 0;
}

.login-box {
  width: 650px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-header {
  background-color: #2F7D32;
  padding: 10px;
  border-radius: 8px 8px 0 0;
}

.login-header h1 {
  color: white;
  font-size: 40px;
  font-weight: bold;
  margin: 0;
}

.logo {
  width: 100px;
  margin: 20px 0;
}

.login-title {
  font-size: 25px;
  margin-bottom: 20px;
  font-weight: bold;
}

.container-form {
  padding: 20px !important;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold !important;
}

.login-button {
  width: 30%;
  padding: 10px;
  margin-top: 25px;
  background-color: #2F7D32;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #246024;
  font-weight: 600;
}

.forgot-password {
  color: #2F7D32;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
  font-weight: bold !important;
}
</style>