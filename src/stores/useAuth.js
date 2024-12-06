import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref("");
    const user = ref(null);
    const rol = ref(""); // Declara el rol como estado
    const email = ref(""); 
    const document = ref("");


    // Verificar si el email está definido antes de continuar
  if (!email) {
    console.error("El email no está definidooooo");

  }

    // Función para establecer el token
    function setToken(newToken) {
      if (newToken) {
        token.value = newToken;
        console.log("Está llegando el token: ", token.value);
      } else {
        console.log("No está llegando el token: ", newToken);
      }
    }

    function getToken() {
      return token.value;
    }

    // Función para establecer el rol
    function setRol(newRol) {
      if (newRol) {
        rol.value = newRol;
        console.log("Está llegando el rol: ", rol.value);
      } else {
        console.log("No está llegando el rol: ", newRol);
      }
    }

    function getRol() {
      return rol.value;
    }

    function removeRol() {
      rol.value = "";
      token.value = "";
      email.value = "";
      localStorage.removeItem("auth");
    }

    function setEmail(newEmail) {
      if (newEmail) {
        email.value = newEmail || "";
        console.log("Email asignado:", email.value); // Verifica que se haya asignado correctamente
      } else {
        console.log("No se recibió email:", newEmail);
      }
    }
    
    function getEmail() {
      return email.value;
    }

    return {
      token,
      user,
      rol,
      email,
      setToken,
      getToken,
      setRol,
      getRol,
      removeRol,
      setEmail,
      getEmail,
    };
  },
  {
    persist: true,
  }
);
