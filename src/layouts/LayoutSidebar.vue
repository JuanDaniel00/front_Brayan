<template>
  <q-drawer v-model="drawer" show-if-above :width="300" :breakpoint="400">
    <q-img
      class="absolute-top"
      src=""
      style="height: 150px; background-color: #ddd"
    >
      <div class="absolute-bottom bg-transparent user-info">
        <q-avatar size="65px" class="q-mb-sm">
          <img
            src="https://senasofiaplus.xyz/wp-content/uploads/2023/10/logo-del-sena-01.png"
          />
        </q-avatar>
        <div
          class="text-weight-bold text-center"
          style="
            text-transform: uppercase;
            color: black;
            font-weight: 900;
            font-size: 15px;
          "
        >
          <b>{{ roleText }}</b>
        </div>
        <div class="text-center" style="color: black">
          <b>{{ userEmail }}</b>
        </div>
      </div>
    </q-img>

    <!-- Lista de navegación -->
    <q-scroll-area
      style="
        height: calc(100% - 150px);
        margin-top: 150px;
        border-right: 1px solid #ddd;
      "
    >
      <q-list padding>
        <q-item clickable to="/layouts/home" class="menu-item">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'INSTRUCTOR'"
          clickable
          to="/layouts/apprentices"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section>Aprendices</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'INSTRUCTOR'"
          clickable
          to="/layouts/fiche"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>Fichas</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'INSTRUCTOR'"
          clickable
          to="/layouts/register"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="book" />
          </q-item-section>
          <q-item-section>Registros</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'INSTRUCTOR'"
          clickable
          to="/layouts/assignament"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="how_to_reg" />
          </q-item-section>
          <q-item-section>Asignaciones</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'ADMIN'"
          clickable
          to="/layouts/myAssignament"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="how_to_reg" />
          </q-item-section>
          <q-item-section>Mis Asignaciones</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'INSTRUCTOR'"
          clickable
          to="/layouts/binnacles"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="fact_check" />
          </q-item-section>
          <q-item-section>Bitacoras</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'INSTRUCTOR'"
          clickable
          to="/layouts/followup"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="contact_page" />
          </q-item-section>
          <q-item-section>Seguimientos</q-item-section>
        </q-item>

        <!-- SEGUIMIENTO Y BITACORAS DE ROL INSTRUCTOR -->

        <q-item
          v-if="userRole !== 'ADMIN'"
          clickable
          to="/layouts/binnaclespInstructor"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="fact_check" />
          </q-item-section>
          <q-item-section>Bitacoras</q-item-section>
        </q-item>

        <q-item
          v-if="userRole !== 'ADMIN'"
          clickable
          to="/layouts/followupInstructor"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="contact_page" />
          </q-item-section>
          <q-item-section>Seguimientos</q-item-section>
        </q-item>

        <q-item clickable to="/layouts/modality" class="menu-item">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Modalidad EP</q-item-section>
        </q-item>

        <q-item clickable to="/layouts/certificaciones" class="menu-item">
          <q-item-section avatar>
            <q-icon name="done_all" />
          </q-item-section>
          <q-item-section>Certificaciones</q-item-section>
        </q-item>

        <q-item clickable to="/layouts/horas" class="menu-item">
          <q-item-section avatar>
            <q-icon name="more_time" />
          </q-item-section>
          <q-item-section v-if="userRole !== 'ADMIN'"
            >Informes de Horas Instructor
          </q-item-section>
          <q-item-section v-else
            >Informes Horas Instructores Ep
          </q-item-section>
        </q-item>

        
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/useAuth.js";

onBeforeMount(() => {
  userRoleText();
});

const authStore = useAuthStore();

// Estado del drawer
const drawer = ref(false);

const userRole = authStore.rol;
const userEmail = localStorage.getItem("userEmail");
let roleText = ref("");

const route = useRoute();

const userRoleText = () => {
  if (userRole === "ADMIN") {
    roleText = "USUARIO EP";
  } else if (userRole === "INSTRUCTOR") {
    roleText = "INSTRUCTOR";
  }
};
</script>

<style scoped>
/* Estilo del usuario */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Estilo del menú */
.menu-item {
  background-color: #2f7d32;
  color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 8px;
  padding: 10px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.menu-item .q-item-section {
  color: white;
  display: inline-block;
}

/* Estilo de hover */
.menu-item:hover {
  background-color: #228b22;
  transform: scale(1.05);
}

/* Estilo para foco (remover foco que genera desaparición del texto) */
.menu-item:focus {
  outline: none;
  background-color: #2f7d32;
  color: aliceblue;
}

/* Ajustar los íconos para que no se desalineen con el texto */
.menu-item .q-item-section q-icon {
  margin-right: 10px;
}

.q-item.q-router-link--active,
.q-item--active {
  color: rgb(117, 202, 117); /* Esto desactiva el color */
}
</style>
