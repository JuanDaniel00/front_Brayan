
<template>
  <Header title="Seguimiento"></Header>

  <div id="container-buttons">
    <div class="searchButtons">
      <div class="allInputButtonsSearch">
        <p>Seleccione una opción:</p>
        <radioButtonInstructor v-model="radioButtonList" label="Instructor" val="instructor"
          @update:model-value="handleRadioChange" />
        <radioButtonApprentice v-model="radioButtonList" label="Aprendiz" val="apprentice"
          @update:model-value="handleRadioChange" />
      </div>
      <q-form ref="formRef" @submit.prevent="searchButtons">
        <div class="InputButtonsSearch">
          <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
            optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select"
            :rules="[validateRequieredSearch]" lazy-rules/>
          <buttonSearch type="submit" :onclickButton="searchButtons" :loading=loadingSearch />
        </div>
      </q-form>
    </div>
  </div>

  <tableSelect :rows="rows" :columns="columns" :options="OptionsStatus" :onClickSeeObservation="openClickSeeObservation"
    :onClickCreateObservation="openClickCreateObservation" :onclickSelectOptions="onclickSelectOptions"  :onClickLinkDetail="onClickLinkDetail"
    :loading="loading" />

  <dialogSeeObservation v-model="isChatOpen" :messages="chatMessages" title="OBSERVACIONES" labelClose="Cerrar"
    labelSend="Guardad" :onclickClose="closeDialog" :onclickSend="saveChanges"
    :informationBinnacles="observationFollowup">
  </dialogSeeObservation>

  <q-form ref="formObservation" @submit.prevent="handleSend">
  <dialogCreateObservation v-model="isDialogVisibleCreateObservation" title="AÑADIR ODSERVACIONES" labelClose="close"
    labelSend="guardar" :onclickClose="closeDialog" :onclickSend="handleSend"
    labelTextArea="Escriba esta observación para este Seguimiento" v-model:textValue="newObservation"
    :loading="loadingCreateOdservation" :rules="[ (val) => !!val || 'El campo es obligatorio']">
  </dialogCreateObservation>
  </q-form>
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
import radioButtonInstructor from '../components/radioButtons/radioButton.vue';
import radioButtonApprentice from '../components/radioButtons/radioButton.vue';
import { Loading } from 'quasar';


let isDialogVisibleCreateObservation = ref(false)
let isDialogVisibleObservation = ref(false)

// filtro
let filterOptionsSearch = ref([])
let searchValue = ref('');
let optionSearch = ref([]);
let radioButtonList = ref('')

// spiner
let loading = ref(false);
let loadingSearch = ref(false);
let loadingCreateOdservation = ref(false);

const inputSearch = ref(null)

// observación
let observationFollowup = ref('');
let newObservation = ref('')
let isChatOpen = ref(false);

let instructorId = ref("");
let instructorName = ref("");
const chatMessages = [];

let route = useRoute();
onBeforeMount(() => {
  loadDataFollowup();
});
const rows = ref([])
let id = ref('')


// validaciones de input de vusqueda
const formRef = ref(null)
const formObservation = ref(null)
const validateRequieredSearch = (v) => {
  if (radioButtonList.value === '') {
    return 'Debes seleccionar una opción'
  }
  if (!v) {
    return 'El campo de búsqueda es obligatorio';
  }
  return true;
}

// Función para obtener el nombre del estado
const getStatusLabel = (status) => {
  const statusOption = OptionsStatus.find(option => option.value === String(status));
  return statusOption ? statusOption.label : status;
}

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
      field: (row) => {
    if (row.register && row.register.idApprentice && row.register.idApprentice.length > 0) {
      return row.register.idApprentice[0].firstName + " " + row.register.idApprentice[0].lastName;
    } else {
      return "No asignado";
    }
  },
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
    field: row => getStatusLabel(row.status),
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
  {
    name: "detail",
    label: "DETALLES",
    align: "center",
    field: 'document',
    sortable: true,
  },
  {
    name: "observationDate",
    label: "FECHA",
    align: "center",
    field: row => formatDate(row.createdAt),
    sortable: true,
  },

])

async function loadDataFollowup() {
  loading.value = true;
  const idInstructor = route.query.id
  console.log('idInstructor:', idInstructor);
  try {
    if (idInstructor) {
      const response = await getData(`/followup/listFollowupByRegister/${idInstructor}`);
      console.log(response);
      rows.value = response.followup
      .map(item => ({
        ...item,
        status: getStatusLabel(item.status)
      }))
      .flatMap(option =>
          option.register.idApprentice.map(apprentice => ({
            ...option,
            register: {
              ...option.register,
              idApprentice: [apprentice]
            }
          }))
        );
    } else {
      const response = await getData('/followup/listallfollowup');
      console.log(response)
      rows.value = response.map(item => ({
        ...item,
        status: getStatusLabel(item.status)
      }));
    }
  } catch (error) {
    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = error.response.data.message;
    } else if (error.response && error.response.data && error.response.data.error) {
      messageError = 'No hay seguimientos para mostrar';
    } else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
      messageError = error.response.data.errors[0].msg;
    } else {
      messageError = 'Error al cargar los seguimientos';
    }
    notifyErrorRequest(messageError);
  } finally {
    loading.value = false;
  }

}


// async function openClickSeeObservation(row) {
//   isDialogVisibleObservation.value = true;
//   if (!row.observation || row.observation.length === 0) {
//     observationFollowup.value = [' No hay observaciones para esta bitacora'];
//   } else {
//     observationFollowup.value = row.observation.map(obs => obs.observation);
//   }

// }

async function openClickSeeObservation(row) {
  isChatOpen.value = true;
  console.log("row", row);
  console.log("row.observation", row.observation);
  instructorId.value = row.instructor._id
  console.log("instructorId", instructorId.value)


  instructorName.value = row.instructor.name

  // Si no hay observaciones, mostrar mensaje por defecto
  if (!row.observation || row.observation.length === 0) {
    chatMessages.splice(0, chatMessages.length); // Limpiar mensajes previos
    chatMessages.push({
      name: "Sistema",
      avatar:
        "https://senasofiaplus.xyz/wp-content/uploads/2023/10/logo-del-sena-01.png",
      text: ["No hay observaciones registradas para esta bitácora."],
      stamp: new Date().toLocaleString(),
      sent: false,
      bgColor: "grey-6",
    });
  } else {
    // Mapear las observaciones a mensajes
    chatMessages.splice(0, chatMessages.length); // Limpiar mensajes previos
    chatMessages.push(
      ...row.observation.map((obs) => ({
        name: obs.user ? "Instructor(a) " + instructorName.value : "Tú",
        text: [obs.observation],
        stamp: formatDate(obs.observationDate),
        sent: !obs.user,
        bgColor: obs.user ? "green-6" : "green-8",
        textColor: "white",
      }))
    );
  }
}

async function openClickCreateObservation(row) {
  isDialogVisibleCreateObservation.value = true;
  id.value = row._id;
}
async function handleSend() {
  const isvalid = await formObservation.value.validate();
  if (!isvalid) {
    return;
  }
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

const OptionsStatus = [
  { label: "Programado", value: "1", disable: true },
  { label: "Ejecutado", value: "2", disable: true },
  { label: "Pendiente", value: "3" },
  { label: "Verificado", value: "4" },
];


async function onclickSelectOptions(row, value) {
  loading.value = true;
  try {
    const response = await putData(
      `/followup/updatestatus/${row._id}/${value}`,
      {
        status: row.value,
      }
    );
    const index = rows.value.findIndex((r) => r._id === row._id);
    if (index !== -1) {
      rows.value[index].status = getStatusLabel(value); // Actualiza solo el estado de la fila modificada
    }
    if (value === "3" ) {
      notifySuccessRequest("El estado ha sido actualizado a Pendiente");
      return;
    } else if (value === "4") {
      notifySuccessRequest("El estado ha sido actualizado a Verificado");
      return;
    }
    console.log("Estado actualizado:", response.data);
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
  }finally{
    loading.value = false;
  }
}

function cleanObservaton() {
  newObservation.value = '';
}
function closeDialog() {
  cleanObservaton();
}

async function searchInstructor() {
  try {
    const response = await getData(`/followup/listfollowupbyinstructor/${searchValue.value}`)
    console.log('Instlist', response);
    rows.value = response.map(item => ({
      ...item,
      status: getStatusLabel(item.status)
    }));
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      let messageError;
      if (error.response && error.response.data && error.response.data.message) {
        messageError = error.response.data.message;
      } else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
        messageError = error.response.data.errors[0].msg;
      } else {
        messageError = 'No se encontró ningún aprendiz por el instructor seleccionado.';
      }
      notifyErrorRequest(messageError);
    }
  }
}

async function searchApprentice() {
  try {
    const response = await getData(`/followup/listFollowupByRegister/${searchValue.value}`)
    console.log('aprendiz', response);
    rows.value = response.followup.map(item => ({
      ...item,
      status: getStatusLabel(item.status)

    }));
    

  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      let messageError;
      if (error.response.data && error.response.data.message) {
        messageError = error.response.data.message;
      } else if (error.response && error.response.data.errors && error.response.data.errors[0].msg) {
        messageError = error.response.data.errors[0].msg;
      } else {
        messageError = 'No se encontró ningún aprendiz con la información seleccionada.';
      }
      notifyErrorRequest(messageError);
    }
  }
}

const handleRadioChange = async () => {
  if (radioButtonList.value === 'instructor') {
    const response = await getData('/followup/listallfollowup');
    const uniqueInstructors = new Set();
    console.log('apprentice', response)
    optionSearch.value = response.map(option => {
      const instructorId = option.instructor.idinstructor;
      if (!uniqueInstructors.has(instructorId)) {
        uniqueInstructors.add(instructorId);
        return {
          _id: option.instructor.idinstructor,
          label: `${option.instructor.name}`,
        };
      }
    }).filter(Boolean);
    filterOptionsSearch.value = optionSearch.value;
  } else if (radioButtonList.value === 'apprentice') {
    const response = await getData('/followup/listallfollowup');
    const uniqueApprentices = new Set();
    optionSearch.value = response.map(option => {
      if (option.register && option.register.idApprentice && option.register.idApprentice.length > 0) {
      const apprenticeId = option.register._id;
      if (!uniqueApprentices.has(apprenticeId)) {
        uniqueApprentices.add(apprenticeId);
        return {
          _id: option.register._id,
          label: `${option.register.idApprentice[0].firstName} ${option.register.idApprentice[0].lastName} - ${option.register.idApprentice[0].numDocument}`,
          numDocument: option.numDocument
        };
      }
    }
    }).filter(option => option !== undefined);
    filterOptionsSearch.value = optionSearch.value;
  }
  clearSearch();
}

// limpiar campos de busqueda
function clearSearch() {
  searchValue.value = '';
}

function validationSearch() {
  if (radioButtonList.value === '') {
    notifyWarningRequest('Debes seleccionar una opción (Seguimiento, Aprendiz) antes de buscar.');
    return false;
  }
  if (searchValue.value === '') {
    notifyWarningRequest('El campo de búsqueda no puede estar vacío. Por favor, ingrese un dato para continuar.');
    return false;
  }
  return true;
}

async function fetchDataSearch() {
  handleRadioChange()
}

fetchDataSearch()
async function filterFunctionSearch(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filterOptionsSearch.value = optionSearch.value.filter((option) =>
      option.label.toLowerCase().includes(needle)
    );
  });
}

async function searchButtons() {
  const isvalid = await formRef.value.validate();
  if (!isvalid) {
    return;
  }
  if (!validationSearch()) {
    return
  }
  loadingSearch.value = true;
  try {
    if (radioButtonList.value === 'instructor') {
      await searchInstructor()
    } else if (radioButtonList.value === 'apprentice') {
      await searchApprentice()
    }
    clearSearch();
  } finally {
    loadingSearch.value = false
  }
}

async function onClickLinkDetail(row) {
  const url = row.document;
  if (isValidUrl(url)) {
    window.open(url, '_blank');
  } else {
    notifyErrorRequest('El enlace no existe o es inválido.');
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}


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

.allInputButtonsSearch p {
  font-weight: bold;
  color: green;
  font-size: 11px;
  margin: 0px;
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