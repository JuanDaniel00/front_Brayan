import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref("");
    const user = ref(null);
    const rol = ref(""); // Declara el rol como estado

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
      localStorage.removeItem("auth");
    }

    return {
      token,
      user,
      rol,
      setToken,
      getToken,
      setRol,
      getRol,
      removeRol,
    };
  },
  {
    persist: true,
  }
);
