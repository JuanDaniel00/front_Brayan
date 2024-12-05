<template>
  <Header title="Bitacoras"></Header>
  <div id="container-buttons">
    <div class="searchButtons">
      <div class="allInputButtonsSearch">
        <p>Seleccione una opción:</p>
        <radioButtonInstructor v-model="radioButtonList" label="Instructor" val="instructor"
          @update:model-value="handleRadioChange" />
        <radioButtonApprentice v-model="radioButtonList" label="Aprendiz" val="apprentice"
          @update:model-value="handleRadioChange" />
      </div>
      <q-form ref="formRef" @submit.prevent="searchButton">
        <div class="InputButtonsSearch">
          <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
            optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select"
            :rules="[validateRequieredSearch]" lazy-rules />
          <buttonSearch :onclickButton="searchButton" :loading="loadingSearch" />
        </div>
      </q-form>
    </div>
  </div>

  <tableSelect :rows="rows" :columns="columns" :options="OptionsStatus" :onClickSeeObservation="openClickSeeObservation"
    :onClickCreateObservation="openClickCreateObservation" :onclickSelectOptions="onclickSelectOptions"
    :loading="loading" />

  <dialogSeeObservation v-model="isChatOpen" :messages="chatMessages" title="OBSERVACIONES" labelClose="Cerrar">
  </dialogSeeObservation>

  <dialogCreateObservation v-model="isDialogVisibleCreateObservation" title="Añadir Observación" labelClose="Cerrar"
    labelSend="Enviar" :onclickClose="closeDialog" :onclickSend="handleSend" v-model:textValue="newObservation"
    :informationBinnacles="observationBinnacles" :informationBinnaclesDate="observationBinnaclesDate"
    labelTextArea="Escriba una Observacón para esta bitacoras" :loading="loadingCreateOdservation">
  </dialogCreateObservation>
</template>

<script setup>
import { ref, onBeforeMount, handleError } from "vue";
import Header from "../components/header/header.vue";
import tableSelect from "../components/tables/tableSelect.vue";
import dialogSeeObservation from "../components/modal/dialogClose.vue";
import dialogCreateObservation from "../components/modal/dialogSaveClose.vue";
import radioButtonInstructor from "../components/radioButtons/radioButton.vue";
import radioButtonApprentice from "../components/radioButtons/radioButton.vue";
import inputSelect from "../components/input/inputSelect.vue";
import buttonSearch from "../components/buttons/buttonSearch.vue";
import { notifyErrorRequest, notifySuccessRequest, notifyWarningRequest } from "../composables/useNotify.js";
import { getData, postData, putData } from "../services/ApiClient";
import { useRoute } from "vue-router";
import { formatDate } from "../utils/changeDateFormat.js";


let searchValue = ref("");
let radioButtonList = ref("");
let optionSearch = ref([]);
let filterOptionsSearch = ref([]);

//Variables de observaciones
let observationBinnacles = ref("");
let observationBinnaclesDate = ref([]);
const isDialogVisibleCreateObservation = ref(false);

let isChatOpen = ref(false);

// observación
let newObservation = ref("");



const id = ref("");

// spiner
let loading = ref(false);
let loadingSearch = ref(false);
let loadingCreateOdservation = ref(false);
const route = useRoute();


// validacions de input e busqueda
const formRef = ref(null);
const validateRequieredSearch = (v) => {
  if (radioButtonList.value === '') {
    return 'Debes seleccionar una opción (Seguimiento, Aprendiz) antes de buscar.'
  }
  if (!v) {
    return 'El campo de búsqueda es obligatorio';
  }
  return true;
}


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
    field: (row) =>
      row.register.idApprentice[0].firstName +
        " " +
        row.register.idApprentice[0].lastName
        ? row.register.idApprentice[0].firstName +
        " " +
        row.register.idApprentice[0].lastName
        : "No asignado",
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
    name: "nameInstructor",
    label: "NOMBRE INSTRUCTOR",
    align: "center",
    field: (row) => (row.instructor ? row.instructor.name : "No asignado"),
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
    label: "OBSERVACIONES",
    align: "center",
    field: "observation",
    sortable: true,
  },
  {
    name: "detail",
    label: "DETALLES",
    align: "center",
    field: "observation",
    sortable: true,
  },
]);

onBeforeMount(async () => {
  await loadDataBinnacles();
});

async function loadDataBinnacles() {
  loading.value = true;
  const idRegister = route.query.id;
  console.log("listfollow", idRegister);
  try {
    if (idRegister) {
      const response = await getData(
        `/binnacles/listBinnaclesByRegister/${idRegister}`
      );
      console.log("Listar por Bitacoras", response);
      rows.value = response.binnacles;
    } else {
      const response = await getData("/binnacles/listallbinnacles");
      console.log(response);
      rows.value = response;
    }
  } catch (error) {
    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = "no hay bitacoras para mostrar";
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors[0].msg
    ) {
      messageError =
        error.response.data.errors[0].msg || "Error al cargar las bitacoras";
    } else {
      messageError = "Error al cargar las bitacoras";
    }
    notifyErrorRequest(messageError);
  } finally {
    loading.value = false;
  }
}

async function openClickSeeObservation(row) {
  isChatOpen.value = true;
  console.log("row.observation", row.observation);


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
      ...row.observation.map((obs) => ({
        name: "ADMIN",
        text: [obs.observation],
        stamp: formatDate(obs.observationDate),
        sent: true,
        bgColor: "green-7",
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
  loadingCreateOdservation.value = true;
  try {
    const response = await putData(`/binnacles/addobservation/${id.value}`, {
      observation: newObservation.value,
    });
    notifySuccessRequest("La observación se ha añadido correctamente");
    isDialogVisibleCreateObservation.value = false;
    await loadDataBinnacles();
    cleanObservaton();
  } catch (error) {
    if (newObservation.value === "") {
      validationHandleSend();
    } else {
      const messageError =
        error.response.data.errors[0].msg ||
        error.response.data.message ||
        "Hubo un error al intentar añadir la asignación. Por favor, inténtalo nuevamente.";
      notifyErrorRequest(messageError);
      cleanObservaton();
    }
    await loadDataBinnacles();
  } finally {
    loadingCreateOdservation.value = false;
  }
}

function validationHandleSend() {
  if (newObservation.value === "") {
    notifyWarningRequest(
      "El campo de observaciones no puede estar vacío. Por favor, ingresa una observación para continuar."
    );
    return;
  }
}
function cleanObservaton() {
  newObservation.value = "";
}
function closeDialog() {
  cleanObservaton();
}

const OptionsStatus = [
  { label: "Pendiente", value: "3" },
  { label: "Verificado", value: "4" },
];

async function onclickSelectOptions(row, value) {
  try {
    const response = await putData(
      `/binnacles/updatestatus/${row._id}/${value}`,
      {
        status: row.value,
      }
    );
    const index = rows.value.findIndex((r) => r._id === row._id);
    if (index !== -1) {
      rows.value[index].status = value; // Actualiza solo el estado de la fila modificada
    }
    console.log("Estado actualizado:", response.data);
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
  }
}

async function searchInstructor() {
  try {
    const response = await getData(
      `/binnacles/listbinnaclesbyinstructor/${searchValue.value}`
    );
    console.log(response);
    rows.value = response;
  } catch (error) {
    if (searchValue.value === "") {
      validationSearch();
    } else {
      const messageError = error.response.data.error || "Error al buscar ficha";
      notifyErrorRequest(messageError);
    }
    loadDataBinnacles();
  }
}

async function searchApprentice() {
  try {
    const response = await getData(
      `/binnacles/listBinnaclesByRegister/${searchValue.value}`
    );
    console.log(response);
    rows.value = response.binnacles;
  } catch (error) {
    if (searchValue.value === "") {
      validationSearch();
    } else {
      const messageError =
        error.response.data.errors ||
        error.response.data.error[0].msg ||
        error.response.data.message ||
        "Error al buscar aprendiz";
      console.log(messageError);
      notifyErrorRequest(messageError);
    }
    loadDataBinnacles();
  }
}

const handleRadioChange = async () => {
  if (radioButtonList.value === "instructor") {
    const response = await getData("/binnacles/listallbinnacles");
    const uniqueInstructors = new Set();
    console.log(response);
    optionSearch.value = response.map((option) => {
    const instructorId =  option.instructor.idinstructor
    if(!uniqueInstructors.has(instructorId)){
      uniqueInstructors.add(instructorId)
      return {
        _id:  option.instructor.idinstructor,
        label: `${option.instructor.name}`,
      }
    }
    }).filter(Boolean);
    filterOptionsSearch.value = optionSearch.value;
  } else if (radioButtonList.value === "apprentice") {
    const response = await getData("/binnacles/listallbinnacles");
    const uniqueApprentices = new Set();
    optionSearch.value = response
      .map((option) => {
        const apprenticeId = option.register._id;
        if (!uniqueApprentices.has(apprenticeId)) {
          uniqueApprentices.add(apprenticeId);
          return {
            _id: apprenticeId,
            label: `${option.register.idApprentice[0].firstName} ${option.register.idApprentice[0].lastName} - ${option.register.idApprentice[0].numDocument}`,
            numDocument: option.numDocument,
          };
        }
      })
      .filter((option) => option !== undefined);
    filterOptionsSearch.value = optionSearch.value;
  }
  clearSearch();
};

// limpiar campos de busqueda
function clearSearch() {
  searchValue.value = "";
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
  handleRadioChange();
}

fetchDataSearch();
async function filterFunctionSearch(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filterOptionsSearch.value = optionSearch.value.filter((option) =>
      option.label.toLowerCase().includes(needle)
    );
  });
}

async function searchButton() {
  const isvalid = await formRef.value.validate();
  if (!isvalid) {
    return;
  }
  if (!validationSearch()) {
    loadingSearch.value = false
    return
  }
  loadingSearch.value = true;
  try {
    if (radioButtonList.value === "instructor") {
      await searchInstructor();
    } else if (radioButtonList.value === "apprentice") {
      await searchApprentice();
    }
    clearSearch();
  } finally {
    loadingSearch.value = false;
  }

}
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


.allInputButtonsSearch p {
  font-weight: bold;
  color: green;
  font-size: 11px;
  margin: 0px;
}

.searchButtons {
  display: flex;
  gap: 20px;
}


.InputButtonsSearch {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}
</style>
