<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>REPFORA</h1>
      </div>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWoms2HEy0ELPrZGRr001PN2sh5sq9dU_BWQ&s"
        alt="Logo SENA" class="logo" />
      <h2 class="login-title">LOGIN</h2>
      <hr />
      <div class="container-form">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <q-select square filled id="rol" v-model="rol" label="ROL" @update:model-value="handleRoleChange"
              :options="roles"></q-select>
          </div>

          <div v-if="isRol">
            <div class="form-group">
              <q-input type="text" v-model="email" label="Email" filled /> <br>

              <q-input type="text" v-if="rol === 'CONSULTOR'" v-model="document" label="Documento" filled />

              <q-input v-if="rol !== 'CONSULTOR'" :type="isPwd ? 'password' : 'text'" id="password" v-model="password"
                label="Password" filled>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
            </div>
            <q-btn type="submit" class="login-button" label="INICIAR SESIÓN" color="primary" :loading="loading"
              unelevated />
          </div>
        </form>
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

const rol = ref('');
const email = ref('');
const password = ref('');
const document = ref('');
const loading = ref(false); // Indicador de carga
const isPwd = ref(true);
const isConsultorRole = ref(false);
const isRol = ref(false);

const roles = ref([
  { label: 'CONSULTOR', value: 'CONSULTOR' },
  { label: 'ADMINISTRADOR', value: 'ADMIN' },
  { label: 'INSTRUCTOR', value: 'INSTRUCTOR' }
]);

const handleRoleChange = (value) => {
  rol.value = value.value;
  isConsultorRole.value = rol.value === 'CONSULTOR';
  isRol.value = true;
};

const handleSubmit = async () => {
  if (!rol.value || !email.value || (rol.value === 'CONSULTOR' && !document.value) || (rol.value !== 'CONSULTOR' && !password.value)) {
    notifyWarningRequest('Por favor, complete todos los campos');
    return;
  }

  let loginUrl;
  if (rol.value === 'CONSULTOR') {
    loginUrl = '/apprendice/loginApprentice';
  } else if (rol.value === 'ADMIN') {
    loginUrl = '/Repfora/loginAdmin';
  } else if (rol.value === 'INSTRUCTOR') {
    loginUrl = '/Repfora/loginInstructors';
  } else {
    notifyErrorRequest('Rol no válido');
    return;
  }

  loading.value = true; // Activar indicador de carga
  try {
    const response = await postData(loginUrl, {
      role: rol.value,
      email: email.value,
      numDocument: rol.value === 'CONSULTOR' ? document.value : undefined,
      password: rol.value !== 'CONSULTOR' ? password.value : undefined,
    });

    authStore.setToken(response.token);
    authStore.setRol(rol.value);
    router.push('/layouts/home');
        
    notifySuccessRequest('Inicio de sesión exitoso');


    if (rol.value === 'CONSULTOR') {
      router.push('/consultant');
    } else {
      router.push({
        path: '/layouts',
        query: { rol: rol.value },
      });
    }
  } catch (error) {
    console.error('Error en handleSubmit:', error);
    let messageError = 'Error desconocido. Por favor, inténtelo más tarde.';
    if (error.response?.data?.errors?.length > 0) {
      messageError = error.response.data.errors[0].msg;
    } else if (error.response?.data?.data?.msg) {
      messageError = 'Usuario/contraseña incorrectos. Intenta nuevamente.';
    }
    notifyErrorRequest(messageError);
  } finally {
    loading.value = false; // Desactivar indicador de carga
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

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  padding-right: 40px;
  position: relative;

}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: all;
  color: #666;
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