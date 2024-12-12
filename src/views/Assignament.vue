<template>
  <Header title="Asignaciones"></Header>
  <div id="buttons-container">
    <div class="AllButtonsSearch">
      <div class="filterButtons">
        <p>Seleccione una opción:</p>
        <radioButtonApprentice v-model="radioButtonList" label="Aprendiz" val="apprentice"
          @update:model-value="handleRadioChange" />
        <radioButtonInsFollow v-model="radioButtonList" label="Inst. Seguimiento" val="instFollowup"
          @update:model-value="handleRadioChange" />
        <radioButtonInstTechnical v-model="radioButtonList" label="Inst. Tecnico" val="instTechnical"
          @update:model-value="handleRadioChange" />
        <radioButtonInstProject v-model="radioButtonList" label="Inst. Proyecto" val="instProject"
          @update:model-value="handleRadioChange" />
      </div>
      <q-form ref="formRef" @submit.prevent="searchDate">
        <div class="InputButtonsSearch">
          <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
            optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select"
            :rules="[validateRequieredSearch]" lazy-rules />
          <buttonSearch :onclickButton="searchDate" :loading="loadingSearch" />
        </div>
      </q-form>
    </div>
  </div>
  <TableOptions :rows="rows" :columns="columns" :onClickEdit="onclickButtonEdit" :onClickAdd="onclickButtonAdd"
    :onClickSearchBinnacle="onclickSearchBinnacles" :onClickSearchFollow="onclickSearchFollow" :loading="loading">
  </TableOptions>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Header from '../components/header/header.vue';
import TableOptions from "../components/tables/tableButtonsSearch.vue";
import radioButtonApprentice from "../components/radioButtons/radioButton.vue";
import radioButtonInsFollow from "../components/radioButtons/radioButton.vue";
import radioButtonInstTechnical from "../components/radioButtons/radioButton.vue";
import radioButtonInstProject from "../components/radioButtons/radioButton.vue";
import inputSelect from "../components/input/inputSelect.vue";
import buttonSearch from "../components/buttons/buttonSearch.vue";
import { getData } from "../services/ApiClient.js";
import { notifyErrorRequest, notifySuccessRequest, notifyWarningRequest } from '../composables/useNotify.js';
import { router } from '../router/routers.js';

onBeforeMount(async () => {
  await loadDataAssignament();
})

// radio buttons
let searchValue = ref('');
let radioButtonList = ref('');
let optionSearch = ref([]);
let filterOptionsSearch = ref([]);
// validaciosn de busqueda
const formRef = ref(null);

// spiner
let loading = ref(false);
let loadingSearch = ref(false);

// validacions de input e busqueda
const validateRequieredSearch = (v) => {
  if (radioButtonList.value === '') {
    return 'Debes seleccionar una opción'
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
    field: "numero",
    align: "center",
  },
  {
    name: "register",
    label: "NOMBRE APRENDIZ",
    field: row => row.idApprentice[0] && row.idApprentice.length > 0 ? row.idApprentice[0].firstName + " " +
      row.idApprentice[0].lastName : 'No asignado',
    align: "resgister",
  },
  {
    name: "program",
    required: true,
    label: "PROGRAMA",
    align: "center",
    field: row => row.idApprentice && row.idApprentice.length > 0 && row.idApprentice[0].fiche ?
      row.idApprentice[0].fiche.name : 'No asignado',
    sortable: true,
  },
  {
    name: "modality",
    align: "center",
    label: "MODALIDAD",
    field: row => row.idModality ? row.idModality.name : 'Modalidad no Asignada',
    sortable: true,
  },
  {
    name: "projectInstructor",
    label: "INS. SEGUIMIENTO",
    align: "center",
    field: row => {
      const requiredModalities = ['MONITORIAS', 'PASANTIA', 'VICULO LABORAL', 'UNIDAD PRODUCTIVA FAMILIAR', 'CONTRATO DE APRENDIZAJE'];
      if (requiredModalities.includes(row.idModality.name)) {
        return row.assignment && row.assignment.length > 0 && row.assignment[0].followUpInstructor[0]
          ? row.assignment[0].followUpInstructor[0].name
          : 'Requerido';
      } else {
        return row.assignment && row.assignment.length > 0 && row.assignment[0].followUpInstructor[0]
          ? row.assignment[0].followUpInstructor[0].name
          : 'Requerido';
      }
    },
  },
  {
    name: "instTechnical",
    label: "INS. TECNICO",
    align: "center",
    field: row => {
      const requiredModalities = ['MONITORIAS', 'PASANTIA', 'VICULO LABORAL', 'UNIDAD PRODUCTIVA FAMILIAR', 'CONTRATO DE APRENDIZAJE'];
      if (requiredModalities.includes(row.idModality.name)) {
        return row.assignment && row.assignment.length > 0 && row.assignment[0].technicalInstructor[0] ?
          row.assignment[0].technicalInstructor[0].name : 'No Requerido'
      } else {
        return row.assignment && row.assignment.length > 0 && row.assignment[0].technicalInstructor[0] ?
          row.assignment[0].technicalInstructor[0].name : 'Requerido';
      }
    },
  }, {
    name: "instProject",
    label: "INS. PROYECTO",
    align: "center",
    field: row => {
      const requiredModalities = ['MONITORIAS', 'PASANTIA', 'VICULO LABORAL', 'UNIDAD PRODUCTIVA FAMILIAR', 'CONTRATO DE APRENDIZAJE'];
      if (requiredModalities.includes(row.idModality.name)) {
        return row.assignment && row.assignment.length > 0 && row.assignment[0].projectInstructor[0]
          ? row.assignment[0].projectInstructor[0].name
          : 'No Requerido';
      } else {
        return row.assignment && row.assignment.length > 0 && row.assignment[0].projectInstructor[0]
          ? row.assignment[0].projectInstructor[0].name
          : 'Requerido';
      }
    },
    sortable: true,
  }, {
    name: "binnacles",
    label: "BITACORAS",
    align: "center",
    sortable: true
  }, {
    name: "followup",
    label: "SEGUIMIENTO",
    align: "center",
    sortable: true
  }
]);

async function loadDataAssignament() {
  loading.value = true;
  try {
    const response = await getData('/register/listallassignment');
    console.log(response)
    rows.value = response.data
      .reverse()
      .filter(row => row.status === 1)
      .flatMap(option =>
        option.idApprentice.map(apprentice => ({
          ...option,
          idApprentice: [apprentice]
        }))
      )
  } catch (error) {
    notifyErrorRequest('Error al cargar las asignaciones');
  } finally {
    loading.value = false;
  }
}

async function searchApprentice() {
  try {
    const response = await getData(`/register/listregisterbyapprentice/${searchValue.value}`);
    rows.value = response.data
    .reverse()
      .flatMap(option =>
        option.idApprentice
          .filter(apprentice => apprentice._id === searchValue.value)
          .map(apprentice => ({
            ...option,
            idApprentice: [apprentice]
          }))
      )
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      let messageError;
      if (error.response.data && error.response.data.message) {
        messageError = error.response.data.message
      } else if (error.response.data && error.response.data.errors[0].msg) {
        messageError = error.response.data.errors[0].msg
      }
      notifyErrorRequest(messageError);
    }
  }
}

async function searchinstFollowup() {
  try {
    const response = await getData(`/register/listassigmentbyfollowupinstructor/${searchValue.value}`);
    console.log('Td Follow', response)
    rows.value = response.data
    .filter(option => option.status = 1)
      .flatMap(option =>
        option.idApprentice
        .map(apprentice => ({
          ...option,
          idApprentice: [apprentice]
        }))
      );
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      notifyErrorRequest('Error al buscar el instructor de seguimiento');
    }
  }
}

async function searchInstTechnical() {
  try {
    const response = await getData(`/register/listassigmentbytechnicalinstructor/${searchValue.value}`);
    console.log('Td Technical', response)
    rows.value = response.data
    
    .filter(option => option.status === 1) // Filtrar por estado activo
      .flatMap(option =>
        option.idApprentice.map(apprentice => ({
          ...option,
          idApprentice: [apprentice]
        }))
      );
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      const messageError = error.response?.data?.error || 'Error al buscar el instructor técnico';
      notifyErrorRequest(messageError);
    }
  }
}

async function searchInstProject() {
  try {
    const response = await getData(`/register/listassigmentbyprojectinstructor/${searchValue.value}`);
    console.log('Td Project', response)
    rows.value = response.data
    .filter(option => option.status === 1) // Filtrar por estado activo
      .flatMap(option =>
        option.idApprentice.map(apprentice => ({
          ...option,
          idApprentice: [apprentice]
        }))
      );
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      const messageError = error.response?.data?.error || 'Error al buscar el instructor de proyecto';
      notifyErrorRequest(messageError);
    }
  }
}

const handleRadioChange = async () => {
  if (radioButtonList.value === 'apprentice') {
    const response = await getData('/register/listallassignment');
    console.log('res', response);
    
    optionSearch.value = response.data
      .filter(option => option.status === 1) // Filtrar por estado activo
      .flatMap(option => 
        option.idApprentice.map(apprentice => ({
          _id: apprentice._id,
          label: `${apprentice.firstName} ${apprentice.lastName} - ${apprentice.numDocument}`,
          numDocument: apprentice.numDocument
        }))
      ).filter(Boolean);
    filterOptionsSearch.value = optionSearch.value;
  } else if (radioButtonList.value === 'instFollowup') {
    const response = await getData('/register/listallregister');
    console.log('resgister Follow', response)
    const uniqueInsFollowup = new Set();
    optionSearch.value = response.data
    optionSearch.value = response.data
    .filter(option => option.status === 1)
    .map(option => {
      if (option.assignment && option.assignment[0] && option.assignment[0].followUpInstructor && option.assignment[0].followUpInstructor[0]) {
        const instFollowup = option.assignment[0].followUpInstructor[0].idInstructor;
        if (!uniqueInsFollowup.has(instFollowup)) {
          uniqueInsFollowup.add(instFollowup);
          return {
            _id: option.assignment[0].followUpInstructor[0].idInstructor,
            label: `${option.assignment[0].followUpInstructor[0].name} `,
          }
        }
      }
    }).filter(option => option !== undefined);
    filterOptionsSearch.value = optionSearch.value;
  } else if (radioButtonList.value === 'instTechnical') {
    const response = await getData('/register/listallregister');
    console.log('info Techenical', response)
    const uniqueInsTechnical = new Set();
    optionSearch.value = response.data
    .filter(option => option.status === 1)
    .map(option => {
      if (option.assignment && option.assignment[0] && option.assignment[0].technicalInstructor && option.assignment[0].technicalInstructor[0]) {
        const instTechnical = option.assignment[0].technicalInstructor[0].idInstructor;
        if (!uniqueInsTechnical.has(instTechnical)) {
          uniqueInsTechnical.add(instTechnical);
          return {
            _id: option.assignment[0].technicalInstructor[0].idInstructor,
            label: `${option.assignment[0].technicalInstructor[0].name} `
          }
        }
      }
    }).filter(option => option !== undefined);
    filterOptionsSearch.value = optionSearch.value;
  } else if (radioButtonList.value === 'instProject') {
    const response = await getData('/register/listallregister');
    console.log('info Proyect', response)
    const uniqueInstProject = new Set();
    optionSearch.value = response.data
    .filter(option => option.status === 1)
    .map(option => {
      if (option.assignment && option.assignment[0] && option.assignment[0].projectInstructor && option.assignment[0].projectInstructor[0]) {
        const instProject = option.assignment[0].projectInstructor[0].idInstructor;
        console.log('idInstructor', instProject)
        if (!uniqueInstProject.has(instProject)) {
          uniqueInstProject.add(instProject);
          return {
            _id: option.assignment[0].projectInstructor[0].idInstructor,
            label: `${option.assignment[0].projectInstructor[0].name} `,
          }
        }
      }
    }).filter(option => option !== undefined);
    filterOptionsSearch.value = optionSearch.value;
    clearSearch();
  }
}

// limpiar campos de busqueda
function clearSearch() {
  searchValue.value = '';
}

function validationSearch() {
  if (radioButtonList.value === '') {
    notifyWarningRequest('Debes seleccionar una opción (Aprendiz, Inst. Seguimiento, Inst. Tecnico, o Inst. Proyecto) antes de buscar.');
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
  if (val === '') {
    update(() => {
      filterOptionsSearch.value = filterOptionsSearch.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase();
    filterOptionsSearch.value = optionSearch.value.filter((option) =>
      option.label.toLowerCase().includes(needle)
    );
  });
}

async function searchDate() {
  const isvalid = await formRef.value.validate();
  if (!isvalid) {
    return;
  }
  loadingSearch.value = true
  if (!validationSearch()) {
    loadingSearch.value = false
    return
  }
  if (radioButtonList.value === 'apprentice') {
    await searchApprentice()
  } else if (radioButtonList.value === 'instFollowup') {
    await searchinstFollowup()
  } else if (radioButtonList.value === 'instTechnical') {
    await searchInstTechnical()
  } else if (radioButtonList.value === 'instProject') {
    await searchInstProject()
  }
  clearSearch();
  loadingSearch.value = false
}

async function onclickSearchBinnacles(row) {
  loading.value = true
  try {
    const response = await getData(`/binnacles/listBinnaclesByRegister/${row._id}`);
    if (response) {
      router.push({
        path: '/layouts/binnacles',
        query: { id: row._id }
      });
    }
  } catch (error) {
    notifyErrorRequest('No se encontro Bitácora registrada para el aprendiz.');
  }finally{
    loading.value = false;
  }
}
async function onclickSearchFollow(row) {
  loading.value = true;
  try {
    const response = await getData(`/followup/listFollowupByRegister/${row._id}`);
    if (response) {
      router.push({
        path: '/layouts/followup',
        query: { id: row._id }
      });
    }
  } catch (error) {
    notifyErrorRequest('No se encontro seguimiento registrado para el aprendiz.');
  }finally{
    loading.value = false;
  }
}
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

#buttons-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px;
}

.filterButtons p {
  font-weight: bold;
  color: green;
  font-size: 11px;
  margin: 0px;
}

.formAssinament {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.AllButtonsSearch {
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