<template>
  <q-layout view="hHh Lpr lff">
    <Header :toggle-drawer="toggleDrawer" />
    <q-page-container class="consultant-page">
      <div class="container">
        <div class="overlay" v-if="loading">
          <q-spinner color="green-7" size="50px" />
        </div>
        <div :class="{ 'row': loading }">
          <div class="row">
            <div class="card">
              <div class="card-header">
                <q-icon name="person" color="green-7" />
                <span>DATOS DEL APRENDIZ</span>
              </div>
              <div id="card-aprendiz">
                <q-img src="https://senasofiaplus.xyz/wp-content/uploads/2023/10/logo-del-sena-01.png"
                  class="sena-logo" />
                <div class="card-body1">
                  <div><strong>NOMBRE:</strong> {{ apprenticeFullName }}</div>
                  <div><strong>N° DOCUMENTO:</strong> {{ appreticeDocument }}</div>
                  <div><strong>FICHA:</strong> {{ ficheName }}</div>
                  <div><strong>CÓDIGO FICHA:</strong> {{ ficheCode }}</div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <q-icon name="assignment" color="green-7" />
                <span>INFORMACIÓN ETAPA PRODUCTIVA</span>
              </div>
              <div class="card-body1">
                <div><strong>MODALIDAD:</strong>{{ modality }}</div>
                <div><strong>FECHA INICIO:</strong>{{ startDate }}</div>
                <div><strong>FECHA FIN:</strong>{{ endDate }}</div>
                <div><strong>INSTRUCTOR DE SEGUIMIENTO:</strong>{{ followupInstructorName }}</div>
                <div><strong>EMAIL DEL INSTRUCTOR DE SEGUIMIENTO:</strong>{{ followupInstructorEmail }}</div>
                <div><strong>ESTADO ETAPA PRODUCTIVA:</strong>{{ productiveStageStatus }}</div>
              </div>
            </div>


            <div class="row">
              <div class="card">
                <div class="card-header">
                  <q-icon name="folder" color="green-7" />
                  <span>BITÁCORAS Y SEGUIMIENTOS</span>
                </div>
                <div id="card-aprendiz">
                  <div class="card-body1">
                    <div><strong>N° BITÁCORAS:</strong>{{ binnaclesNumber }}</div>
                    <div><strong>N° SEGUIMIENTOS:</strong>{{ followupNumber }}</div>
                  </div>
                  <div class="card-body1">
                    <div><strong>VER BITÁCORAS:</strong> <q-icon name="folder_open" color="green-7" /></div>
                    <div><strong>VER SEGUIMIENTOS:</strong> <q-icon name="folder_open" color="green-7" /></div>
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <q-icon name="assignment_turned_in" color="green-7" />
                  <span>CERTIFICACIÓN</span>
                </div>
                <div class="card-body1">
                  <div><strong>ESTADO:</strong>{{ apprenticeStatus }}</div>
                  <div><strong>VER CERTIFICACIÓN:</strong> <q-icon name="folder_open" color="green-7" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-btn label="Historial" color="green-7" icon="history" @click="openHistoryApprentice" class="history-btn"
        :rules="[(val) => val.length === 0 || 'El aprendiz no tiene historial.']" :loading="loadingHistory" />
      <!-- </div> -->
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Header from "../layouts/LayoutHeader.vue";
import { getData } from "../services/ApiClient";
import { formatDate } from '../utils/changeDateFormat.js';
import { router } from "../router/routers.js";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/useAuth.js";
import { QSpinner } from 'quasar';
import { notifyErrorRequest } from "../composables/useNotify.js";
const drawer = ref(false);
const route = useRoute();
const numDocument = ref(route.query.numDocument || localStorage.getItem("apprenticeDocument"));

const currentApprenticeId = ref("");

//Card 1
const apprenticeFullName = ref("");
const appreticeDocument = ref("");
const ficheName = ref("");
const ficheCode = ref("");

//Card 2
const modality = ref("");
const startDate = ref("");
const endDate = ref("");
const followupInstructorName = ref("");
const followupInstructorEmail = ref("");
const productiveStageStatus = ref("");

//Card 3
const binnaclesNumber = ref("");
const followupNumber = ref("");
const apprenticeStatus = ref("");

// rol 
const authStore = useAuthStore();
const userRole = authStore.rol;
console.log(userRole);

// spiners
let loading = ref(false);
let loadingHistory = ref(false)

//funciones
onBeforeMount(async () => {
  loading.value = true;
  await getCurrentApprentice();
  loading.value = false;
});

const getCurrentApprentice = async () => {
  try {
    const apprentices = await getData("/apprendice/listallapprentice");

    const apprentice = apprentices.find((apprentice) =>
      apprentice.numDocument === numDocument.value);

    if (apprentice) {
      currentApprenticeId.value = apprentice._id;
      localStorage.setItem("apprenticeDocument", apprentice.numDocument); // Guardar en localStorage
      await getApprenticeInfo();
      await getBinnaclesAndFollowup();
    } else {
      console.error("No se encontró el aprendiz con el número de documento proporcionado.");
    }
  } catch (error) {
    console.log(error);
  }
};

const getApprenticeInfo = async () => {
  loading.value = true;
  try {
    if (route.query.numDocument) {
      console.log('Estamos buscando por historial');
      const apprentices = await getData("/apprendice/listallapprentice");
      const apprentice = apprentices.find((apprentice) =>
        apprentice.numDocument === route.query.numDocument);
      if (apprentice) {
        currentApprenticeId.value = apprentice._id;
        const apprenticeData = await getData(`/apprendice/listapprenticebyid/${currentApprenticeId.value}`);
        const registers = await getData(`/register/listregisterbyapprentice/${currentApprenticeId.value}`);

        console.log('registers', registers);
        console.log('apprentice', apprenticeData);

        //card 1
        apprenticeFullName.value = apprenticeData.firstName + ' ' + apprenticeData.lastName;
        appreticeDocument.value = apprenticeData.numDocument;
        ficheName.value = apprenticeData.fiche.name;
        ficheCode.value = apprenticeData.fiche.number;

        //card 2
        modality.value = " " + registers.data[0].idModality.name;
        startDate.value = " " + formatDate(registers.data[0].startDate);
        endDate.value = " " + formatDate(registers.data[0].endDate);
        followupInstructorName.value = " " + registers.data[0].assignment[0].followUpInstructor.at(-1)?.name;
        followupInstructorEmail.value = " " + registers.data[0].assignment[0].followUpInstructor.at(-1)?.email;

        switch (apprenticeData.status) {
          case 0:
            productiveStageStatus.value = " " + "Inactivo";
            break;
          case 1:
            productiveStageStatus.value = " " + "Activo";
            break;
          case 2:
            productiveStageStatus.value = " " + "En Etapa Práctica";
            break;
          case 3:
            productiveStageStatus.value = " " + "Por Certificar";
            break;
          case 4:
            productiveStageStatus.value = " " + "Certificado";
            break;
          default:
            productiveStageStatus.value = " " + "Estado Desconocido";
        }

        //card 4
        switch (apprenticeData.status) {
          case 5:
            apprenticeStatus.value = " " + "Certificado";
            break;
          default:
            apprenticeStatus.value = " " + "Sin Certificar";
        }
      } else {
        console.error("No se encontró el aprendiz con el número de documento proporcionado.");
      }
    } else {
      console.log('Estamos buscando por id');
      const apprenticeData = await getData(`/apprendice/listapprenticebyid/${currentApprenticeId.value}`);
      const registers = await getData(`/register/listregisterbyapprentice/${currentApprenticeId.value}`);

      console.log('registers', registers);
      console.log('apprentice', apprenticeData);

      //card 1
      apprenticeFullName.value = apprenticeData.firstName + ' ' + apprenticeData.lastName;
      appreticeDocument.value = apprenticeData.numDocument;
      ficheName.value = apprenticeData.fiche.name;
      ficheCode.value = apprenticeData.fiche.number;

      //card 2
      modality.value = " " + registers.data[0].idModality.name;
      startDate.value = " " + formatDate(registers.data[0].startDate);
      endDate.value = " " + formatDate(registers.data[0].endDate);
      followupInstructorName.value = " " + registers.data[0].assignment[0].followUpInstructor.at(-1)?.name;
      followupInstructorEmail.value = " " + registers.data[0].assignment[0].followUpInstructor.at(-1)?.email;

      switch (apprenticeData.status) {
        case 0:
          productiveStageStatus.value = " " + "Inactivo";
          break;
        case 1:
          productiveStageStatus.value = " " + "Activo";
          break;
        case 2:
          productiveStageStatus.value = " " + "En Etapa Práctica";
          break;
        case 3:
          productiveStageStatus.value = " " + "Por Certificar";
          break;
        case 4:
          productiveStageStatus.value = " " + "Certificado";
          break;
        default:
          productiveStageStatus.value = " " + "Estado Desconocido";
      }

      //card 4
      switch (apprenticeData.status) {
        case 5:
          apprenticeStatus.value = " " + "Certificado";
          break;
        default:
          apprenticeStatus.value = " " + "Sin Certificar";
      }
    }
  } catch (error) {
    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = error.response.data.message;
    } else if (error.response && error.response.data && error.response.data.error) {
      messageError = error.response.data.error
    } else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
      messageError = error.response.data.errors[0].msg;
    } else {
      messageError = 'Error. Por favor, intente más tarde.';
    }
    notifyErrorRequest(messageError);
  } finally {
    loading.value = false;
  }
};

const getBinnaclesAndFollowup = async () => {
  const binnaclesAndFollowups = await getData(`/apprendice/listBinnaclesAndFollowup/${currentApprenticeId.value}`);
  //card 3
  binnaclesNumber.value = " " + binnaclesAndFollowups.counts.binnacles
  followupNumber.value = " " + binnaclesAndFollowups.counts.followups
};

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

async function openHistoryApprentice() {
  loadingHistory.value = true

  try {
    const response = await getData(`/apprendice/listHistoryApprentice/${numDocument.value}`);
    console.log('historial', response);

    if (response.data.apprentices.length > 0) {
      router.push({
        path: '/history',
        query: { numDocument: numDocument.value }
      })
    }
  } catch (error) {
    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = 'No se encontró historial para este aprendiz.';
    }
    notifyErrorRequest(messageError)
  } finally {
    loadingHistory.value = false
  }
}

</script>

<style scoped>
.consultant-page {
  height: 100%;
  background-color: #f5f5f5;
  min-height: 100vh;

}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  position: relative;
}

.consultant-page {
  justify-content: center;
  align-content: center;
}



.row {
  display: flex;
  gap: 16px;
  width: 80%;
  margin: 0 auto;
}

.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  /* Fondo semitransparente */
  z-index: 10;
  /* Asegura que el spinner esté por encima del contenido */
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 16px;
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  color: #2F7D32;
  margin-bottom: 8px;
}

#card-aprendiz {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-header q-icon {
  margin-right: 8px;
}

.sena-logo {
  max-width: 150px;
  height: auto;
}

.card-body div {
  font-size: 0.9em;
  color: #637d2f;
  margin-bottom: 4px;
}

.card-body1 {
  display: flex;
  flex-direction: column;
  background-color: white;
  gap: 8px;
  flex-grow: 1;
}

.card-body1 div strong {
  font-size: 0.9em;
  color: #2F7D32;
  margin-bottom: 4px;
}

.history-btn {
  margin-top: 24px;
  color: white;
  margin-left: 80.5%;
}

.q-icon {
  font-size: 30px;
}

span {
  font-weight: 700;
  font-size: 24px;
}
</style>