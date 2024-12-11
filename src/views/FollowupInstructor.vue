<template>
  <Header title="Seguimiento"></Header>

  <div id="container-buttons">
    <div class="searchButtons">
      <div class="InputButtonsSearch">
        <inputSelect v-model="searchValue" label="Buscar Aprendiz" :options="filterOptionsSearch" optionLabel="label"
          optionValue="_id" :filter="filterFunctionSearch" class="custom-select" />
        <buttonSearch :onclickButton="searchApprentice" :loading="loadingSearch" />
      </div>
    </div>

  </div>

  <tableSelect :rows="rows" :columns="columns" :onClickSeeObservation="openClickSeeObservation"
    :onClickCreateObservation="openClickCreateObservation" :loading="loading" />

  <dialogSeeObservation v-model="isDialogVisibleObservation" title="OBSERVACIONES" labelClose="Cerrar"
    labelSend="Guardar" :onclickClose="closeDialog" :onclickSend="saveChanges"
    :informationBinnacles="observationFollowup" />

  <dialogCreateObservation v-model="isDialogVisibleCreateObservation" title="AÑADIR OBSERVACIONES" labelClose="Cerrar"
    labelSend="Guardar" :onclickClose="closeDialog" :onclickSend="handleSend"
    labelTextArea="Escriba esta observación para este Seguimiento" v-model:textValue="newObservation"
    :loading="loadingCreateOdservation" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Header from '../components/header/header.vue';
import tableSelect from '../components/tables/tableSelect.vue';
import { getData, putData } from '../services/ApiClient';
import dialogSeeObservation from '../components/modal/dialogClose.vue'
import dialogCreateObservation from '../components/modal/dialogSaveClose.vue';
import { formatDate } from '../utils/changeDateFormat';
import inputSelect from '../components/input/inputSelect.vue';
import buttonSearch from '../components/buttons/buttonSearch.vue';
import { notifyErrorRequest, notifySuccessRequest, notifyWarningRequest } from '../composables/useNotify';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/useAuth.js';
import radioButtonInstructor from '../components/radioButtons/radioButton.vue';
import radioButtonApprentice from '../components/radioButtons/radioButton.vue';



let isDialogVisibleCreateObservation = ref(false)
let isDialogVisibleObservation = ref(false)

// filtro
let filterOptionsSearch = ref([])
let searchValue = ref('');
let optionSearch = ref([]);


// spiner
let loading = ref(false);
let loadingSearch = ref(false);
let loadingCreateOdservation = ref(false);


// observación
let observationFollowup = ref('');
let newObservation = ref('')
const authStore = useAuthStore();

let route = useRoute();
onBeforeMount(() => {
  loadDataFollowup();
  fetchApprenticeOptions();
});
const rows = ref([])
let id = ref('')

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
    label: "ETAPA PRODUCTIVA SEGUIMIENTO",
    align: "center",
    field: row => row.register.idApprentice && row.register.idApprentice[0].firstName + ' ' + row.register.idApprentice[0].lastName ? row.register.idApprentice[0].firstName + ' ' + row.register.idApprentice[0].lastName : 'No hay aprendiz',
    sortable: true,
  },
  {
    name: "number",
    label: "N° SEGUIMIENTO",
    align: "center",
    field: "number",
    sortable: true,
  },
  {
    name: "nameInstructor",
    label: "NOMBRE INSTRUCTOR",
    align: "center",
    field: row => row.instructor ? row.instructor.name : 'No asignado',
    sortable: true,
  },
  {
    name: "status",
    label: "ESTADO",
    align: "center",
    field: "status",
    sortable: true,
  },
  {
    name: "observation",
    label: "OBSERVACINES",
    align: "center",
    field: "observation",
    sortable: true,
  },
  {
    name: "observationDate",
    label: "Fecha",
    align: "center",
    field: row => formatDate(row.createdAt),
    sortable: true,
  },

])


async function loadDataFollowup() {
  loading.value = true;
  const email = authStore.email;
  console.log(authStore.email);
  const idRegister = route.query.id
  if (!email) {
    notifyErrorRequest('No se pudo obtener el correo del usuario. Por favor, verifica tu sesión.');
    loading.value = false;
    return;
  }

  try {
    if (idRegister) {
      const response = await getData(`/followup/listFollowupByRegister/${idRegister}`);
      console.log('seguimientos listados por asignación:', response);
      rows.value = response.followup
    } else {
      const response = await getData(`/followup/listfollowupbyinstructoremail/${email}`);
      console.log('seguimientos listados:', response);
      rows.value = response; // Asignar los datos de las bitácoras
    }
  } catch (error) {
    console.log(error.response);

    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = error.response.data.message;
    } else if (error.response && error.response.data && error.response.data.errors) {
      messageError = error.response.data.errors[0].msg || 'Error al cargar los seguimientos';
    } else {
      messageError = 'Error al cargar los seguimiento';
    }
    notifyErrorRequest(messageError);
  } finally {
    loading.value = false;
  }
}


async function openClickSeeObservation(row) {
  isDialogVisibleObservation.value = true;
  if (!row.observation || row.observation.length === 0) {
    observationFollowup.value = [' No hay observaciones para este seguimiento'];
  } else {
    observationFollowup.value = row.observation.map(obs => obs.observation);
  }

}
async function openClickCreateObservation(row) {
  isDialogVisibleCreateObservation.value = true;
  id.value = row._id;
}
async function handleSend() {
  console.log('idod', id.value);
  loadingCreateOdservation.value = true;
  try {
    const response = await putData(`/followup/addobservation/${id.value}`, { observation: newObservation.value });
    notifySuccessRequest('Observación guardada correctamente');
    isDialogVisibleCreateObservation.value = false;
    await loadDataFollowup();
    cleanObservaton();
  } catch (error) {
    if (newObservation.value === '') {
      validarHandleSend();
    } else {
      let messageError;
      if (error.response && error.response.data && error.response.data.message) {
        messageError = error.response.data.message;
      } else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
        messageError = error.response.data.errors[0].msg;
      } else {
        messageError = 'Error al guardar La obsevación';
      }
      notifyErrorRequest(messageError);
    }
  } finally {
    loadingCreateOdservation.value = false;
  }
}

function validarHandleSend() {
  if (newObservation.value === '') {
    notifyWarningRequest('El campo de observaciones no puede estar vacío. Por favor, ingresa una observación para continuar.');

  }
}

function cleanObservaton() {
  newObservation.value = '';
}
function closeDialog() {
  cleanObservaton();
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



// limpiar campos de busqueda
function clearSearch() {
  searchValue.value = '';
}

function validationSearch() {
  if (searchValue.value === '') {
    notifyWarningRequest('El campo de búsqueda no puede estar vacío. Por favor, ingrese un dato para continuar.');
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
#container-search {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
  margin-bottom: auto;
}

.custom-select {
  width: 400px;
  /* Ajusta el tamaño del select */
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