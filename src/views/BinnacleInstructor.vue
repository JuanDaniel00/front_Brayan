<template>
  <Header title="Bitácoras"></Header>
  <div id="container-buttons">
  <div class="searchButtons">
    <div class="InputButtonsSearch">
      <inputSelect v-model="searchValue" label="Buscar Aprendiz" :options="filterOptionsSearch" optionLabel="label"
        optionValue="_id" :filter="filterFunctionSearch" class="custom-select" />
      <buttonSearch :onclickButton="searchApprentice" :loading="loadingSearch" />
    </div>
  </div>

</div>

  <TableBinnacle
  :rows="rows"
  :columns="columns"
  :onClickSeeObservation="openClickSeeObservation"
  :onClickCreateObservation="openClickCreateObservation"
  :onclickSelectOptions="onclickSelectOptions"
  :loading="loading"
/>
      

<dialogSeeObservation
  v-model="isChatOpen"
  :messages="chatMessages"
  title="OBSERVACIONES"
  labelClose="Cerrar"
>
</dialogSeeObservation>

  <dialogCreateObservation v-model="isDialogVisibleCreateObservation" title="Añadir Observación" labelClose="Cerrar"
      labelSend="Enviar" :onclickClose="closeDialog" :onclickSend="handleSend" v-model:textValue="newObservation"
      :informationBinnacles="observationBinnacles" :informationBinnaclesDate="observationBinnaclesDate"
      labelTextArea="Escriba una Observacón para esta bitacoras" :loading="loadingCreateOdservation">
  </dialogCreateObservation>
</template>

<script setup>
import { ref, onBeforeMount, handleError } from 'vue';
import Header from '../components/header/header.vue';
import TableBinnacle from '../components/tables/TableBinnacle.vue'
import dialogSeeObservation from '../components/modal/dialogClose.vue'
import dialogCreateObservation from '../components/modal/dialogSaveClose.vue';
import radioButtonInstructor from '../components/radioButtons/radioButton.vue';
import radioButtonApprentice from '../components/radioButtons/radioButton.vue';
import inputSelect from '../components/input/inputSelect.vue';
import buttonSearch from '../components/buttons/buttonSearch.vue';
import { notifyErrorRequest, notifySuccessRequest, notifyWarningRequest } from '../composables/useNotify.js';
import { getData, postData, putData } from '../services/ApiClient';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/useAuth.js';
import { formatDate } from '../utils/changeDateFormat.js';
let searchValue = ref('');
let radioButtonList = ref('');
let optionSearch = ref([]);
let filterOptionsSearch = ref([]);

// 
let observationBinnacles = ref('');
let observationBinnaclesDate = ref([])
const isDialogVisibleCreateObservation = ref(false);

let isChatOpen = ref(false);
const chatMessages = [];

// observación
let newObservation = ref('');

const authStore = useAuthStore();
const idApprentice = ref('')
const instructorEmail = localStorage.getItem('userEmail');
const currentInstructor = ref()

const id = ref('')


// spiner
let loading = ref(false);
let loadingSearch = ref(false);
let loadingCreateOdservation = ref(false)
const route = useRoute();
const currentInstructorId = ref('')

const rows = ref([]);
const columns = ref([
  {
      name: "Num",
      label: "N°",
      align: "center",
      field: "Num",
      sortable: true,
  },
  {
      name: "name",
      label: "ETAPA PRODUCTIVA ASIGNADA",
      align: "center",
      field: row => row.register.idApprentice[0].firstName + ' ' + row.register.idApprentice[0].lastName ?
          row.register.idApprentice[0].firstName + ' ' + row.register.idApprentice[0].lastName : 'No asignado',
      sortable: true,
  },
  {
      name: "number",
      label: "N° BITACORA",
      align: "center",
      field: "number",
      sortable: true,
  },
  {
  name: "status",
  label: "ESTADO",
  align: "center",
  field: (row) => (row.status === '1' ? 'Programada' : row.status === '2' ? 'Ejecutada' : 'Desconocido'),
  sortable: true,
}, 
  {
      name: "observation",
      label: "OBSERVACIONES",
      align: "center",
      field: "observation",
      sortable: true,
  },
  {
  name: "validateHours",
  label: "VALIDAR HORAS",
  align: "center",
},
])

onBeforeMount(async () => {
  await loadDataBinnacles();
  // await getCurrentInstructor()
})

async function loadDataBinnacles() {
  loading.value = true;
  const email = authStore.email;
  const idApprentice = route.query.id
  console.log('idApprentice:', idApprentice);
  console.log(authStore.email);
  if (!email) {
      notifyErrorRequest('No se pudo obtener el correo del usuario. Por favor, verifica tu sesión.');
      loading.value = false;
      return;
  }
  try {
    if(idApprentice){
      const response = await getData(`/binnacles/listBinnaclesByRegister/${idApprentice}`)
      console.log('Bitácoras listadas por asignament:', response);
      rows.value = response.binnacles
    }else{
      const response = await getData(`/binnacles/listbinnaclesbyinstructoremail/${email}`);
      console.log('Bitácoras listadas:', response);
      rows.value = response; // Asignar los datos de las bitácoras
      console.log('Rows:', rows.value);
    }
  } catch (error) {
      let messageError;
      if (error.response && error.response.data && error.response.data.message) {
          messageError = error.response.data.message;
      } else if (error.response && error.response.data && error.response.data.errors) {
          messageError = error.response.data.errors[0].msg || 'Error al cargar las bitácoras';
      } else {
          messageError = 'Error al cargar las bitácoras';
      }
      notifyErrorRequest(messageError);
      console.log(error)
  } finally {
      loading.value = false;
  }
}

async function getCurrentInstructor() {
  try {
    console.log('instructorEmail: ', instructorEmail)
    const response = await getData(`/Repfora/instructors`)
    console.log('respoonse:  ', response);
    
    currentInstructor.value = response.find(instructor => instructor.email === instructorEmail)
    currentInstructorId.value = currentInstructor.value._id    
    console.log('currentInstructorId: ', currentInstructorId.value)
    
  } catch (error) {
    console.error(error);
    
  }
}

async function updateCheck(id, field, value) {
try {
  await putData(`/binnacles/updatecheck/${id}`, { [field]: value });
  notifySuccessRequest("Check actualizado correctamente.");
} catch (error) {
  notifyErrorRequest("Error al actualizar el check.");
}
}



async function openClickSeeObservation(row) {
  isChatOpen.value = true;

  // Si no hay observaciones, mostrar mensaje por defecto
  if (!row.observation || row.observation.length === 0) {
    chatMessages.splice(0, chatMessages.length); // Limpiar mensajes previos
    chatMessages.push({
      name: "Sistema",
      avatar: "https://senasofiaplus.xyz/wp-content/uploads/2023/10/logo-del-sena-01.png",
      text: ["No hay observaciones registradas para esta bitácora."],
      stamp: new Date().toLocaleString(),
      sent: false,
      bgColor: "grey-6",
    });
  } else {
    // Mapear las observaciones a mensajes
    chatMessages.splice(0, chatMessages.length); // Limpiar mensajes previos
    chatMessages.push(
      ...row.observation.map((obs) => {
        const isCurrentInstructor = obs.user === currentInstructorId.value;

        return {
          name: isCurrentInstructor ? row.instructor?.name || "Instructor desconocido" : "ADMIN",
          text: [obs.observation],
          stamp: formatDate(obs.observationDate),
          sent: isCurrentInstructor ? true : false, // Marca como enviado si no es el instructor actual
          bgColor: isCurrentInstructor ? "green-7" : "green-6", // Fondo verde claro para ADMIN
          textColor: "white",
        };
      })
    );
  }
}


async function openClickCreateObservation(row) {
  isDialogVisibleCreateObservation.value = true;
  id.value = row._id
}

async function handleSend() {
  if (!newObservation.value.trim()) {
    validationHandleSend(); // Mostrar advertencia si la observación está vacía
    return;
  }

  loadingCreateOdservation.value = true;
  try {
    const payload = {
      observation: newObservation.value,
      user: currentInstructorId.value,
    };
console.log('payload: ', payload)

    const response = await putData(`/binnacles/addobservation/${id.value}`, payload);
    notifySuccessRequest('La observación se ha añadido correctamente');
    
    // Cerrar el diálogo y recargar los datos
    isDialogVisibleCreateObservation.value = false;
    await loadDataBinnacles();
    cleanObservaton();
  } catch (error) {
    const messageError =
      error.response?.data?.errors?.[0]?.msg ||
      error.response?.data?.message ||
      'Hubo un error al intentar añadir la asignación. Por favor, inténtalo nuevamente.';
    notifyErrorRequest(messageError);
    cleanObservaton();
  } finally {
    loadingCreateOdservation.value = false;
  }
}



function validationHandleSend() {
  if (newObservation.value === '') {
      notifyWarningRequest('El campo de observaciones no puede estar vacío. Por favor, ingresa una observación para continuar.');
      return;
  }
}
function cleanObservaton() {
  newObservation.value = ''
}
function closeDialog() {
  cleanObservaton()
}



async function onclickSelectOptions(row, value) {
  try {
      const response = await putData(`/binnacles/updatestatus/${row._id}/${value}`, {
          status: row.value

      });
      const index = rows.value.findIndex(r => r._id === row._id);
      if (index !== -1) {
          rows.value[index].status = value; 
      }
      console.log("Estado actualizado:", response.data);
  } catch (error) {
      console.error("Error al actualizar el estado:", error);
  }
}



async function searchApprentice() {
try {
  // Llama al backend usando el valor seleccionado
  const response = await getData(`/followup/listFollowupByRegister/${searchValue.value}`);
  console.log('aprendiz', response);

  // Asigna los datos obtenidos a las filas de la tabla
  rows.value = response.followup;
} catch (error) {
  if (searchValue.value === '') {
    validationSearch();
  } else {
    let messageError;
    if (error.response?.data?.message) {
      messageError = error.response.data.message;
    } else if (error.response?.data?.errors?.[0]?.msg) {
      messageError = error.response.data.errors[0].msg;
    } else {
      messageError = 'No se encontró ningún aprendiz con la información seleccionada.';
    }
    notifyErrorRequest(messageError);
  }
}
}


// limpiar campos de busqueda
function clearSearch() {
  searchValue.value = '';
}

function validationSearch() {
  if (searchValue.value === '' || radioButtonList.value === '') {
      notifyErrorRequest('Debes seleccionar una opción (Ficha, Aprendiz o Estado) antes de buscar.')
  } else {
      notifyWarningRequest('El campo de búsqueda no puede estar vacío. Por favor, ingrese un dato para continuar.');
      return;
  }
}

// Función para cargar opciones de búsqueda de aprendices
async function fetchApprenticeOptions() {
try {
  // Llama a la ruta para obtener los aprendices
  const response = await getData('/apprendice/listallapprentice');

  // Formatea las opciones para el filtro
  optionSearch.value = response.map(option => ({
    _id: option._id, // Asegúrate de usar el ID correcto
    label: `${option.firstName} ${option.lastName} - ${option.numDocument}`
  }));

  filterOptionsSearch.value = optionSearch.value; // Asigna las opciones al filtro
} catch (error) {
  console.error('Error al cargar opciones de aprendiz:', error);
  notifyErrorRequest('Error al cargar las opciones de búsqueda de aprendices.');
}
}

// Filtro dinámico en el input
async function filterFunctionSearch(val, update) {
update(() => {
  const needle = val.toLowerCase();
  filterOptionsSearch.value = optionSearch.value.filter(option =>
    option.label.toLowerCase().includes(needle)
  );
});
}

fetchApprenticeOptions();
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

#container-buttons {
  display: flex;
  justify-content: flex-end;
  margin: 20px;

}

.searchButtons {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
}

.InputButtonsSearch {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}
</style>