<template>
  <Header title="Mis Asignaciones"></Header>
  <div id="buttons-container">
    
    <div class="allInputButtonsSearch">
      <div class="filterButtons">
        <p style="color: #2F7D32; font-weight: bold;">Seleccione una opción:</p>
        <div class="radio-buttons">
          <radioButtonApprentice v-model="radiobuttonlist" label="Aprendiz" val="apprentice"
            @update:model-value="handleRadioChange" />
          <radioButtonTpInstructor v-model="radiobuttonlist" label="Tipo Instructor" val="tpInstructor"
            @update:model-value="handleRadioChange" />
        </div>
      </div>
      <q-form ref="formSearch" @submit.prevent="searchButton" class="InputButtonsSearch">
        <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
          optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select"
          :rules="[validateRequieredSearch]" lazy-rules />
        <buttonSearch :onclickButton="searchButton" :loading="loadingSearch" />
      </q-form>
    </div>
  </div>
  <tableAssignament :rows="rows" :columns="columns" :toggleBinnacle="onclickSearchBinnacles"
    :toggleFollow="onclickSearchFollow" :loading="loading"></tableAssignament>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Header from '../components/header/header.vue';
import tableAssignament from "../components/tables/tableAssignament.vue";
import { getData } from "../services/ApiClient";
import { useAuthStore } from "../stores/useAuth";
import { router } from "../router/routers";
import { notifyErrorRequest } from "../composables/useNotify";
import radioButtonApprentice from "../components/radioButtons/radioButton.vue";
import radioButtonTpInstructor from "../components/radioButtons/radioButton.vue";
import buttonSearch from "../components/buttons/buttonSearch.vue";
import inputSelect from "../components/input/inputSelect.vue";

const authStore = useAuthStore();
const email = ref(authStore.email);
let currenInstructorId = ref(null)


// spiners
let loading = ref(false);
let loadingSearch = ref(false);

const formSearch = ref(null);
let searchValue = ref('');
let filterOptionsSearch = ref([]);
let optionSearch = ref([]);
let radiobuttonlist = ref('');


// validar el input de busqueda
const validateRequieredSearch = (v) => {
  if (radiobuttonlist.value === '') {
    return 'Debes seleccionar una opción (Aprendiz o Tipo Instructor) antes de buscar'
  }
  if (radiobuttonlist.value === 'Status' && (v === 0 || v === 1)) {
    return true;
  }
  if (!v) {
    return 'El campo de búsqueda es obligatorio';
  }
}


// table
const rows = ref([]);
const columns = ref([
  {
    name: "Num",
    label: "N°",
    field: "Num",
  },
  {
    name: "name",
    required: true,
    label: "NOMBRE APRENDIZ",
    align: "center",
    field: row => row.idApprentice[0].firstName + ' ' + row.idApprentice[0].lastName,
    sortable: true,
  },
  {
    name: "tpDocument",
    align: "center",
    label: "TIPO DOCUMENTO",
    field: "tpDocument",
    sortable: true,
  },
  {
    name: "document",
    label: "N° DOCUMENTO",
    align: "center",
    field: "document",
    sortable: true,
  },
  {
    name: "modality",
    label: "MODALIDAD",
    align: "center",
    field: row => row.idModality.name,
    sortable: true,
  },
  {
    name: "binnacle",
    label: "BITACORAS",
    align: "center",
    field: "binnacle"
  },
  {
    name: "follow",
    label: "SEGUIMIENTOS",
    align: "center",
    field: "follow",
    sortable: true,
  },
]);

onBeforeMount(async () => {
  await getCurrenInstructor();
});

const getCurrenInstructor = async () => {
  try {
    if (!email.value) {
      console.error('No se encontró el email en el localStorage');
      return;
    }

    const instructors = await getData('/register/listallassignment');
    console.log('instructors', instructors); // Asegúrate de que esto se imprime
    if (!instructors || !instructors.data) {
      console.error('No se recibieron datos del instructor');
      return;
    }

    const instructor = instructors.data.find(instructor =>
      instructor.assignment?.[0]?.followUpInstructor?.some(i => i.email === email.value) ||
      instructor.assignment?.[0]?.technicalInstructor?.some(i => i.email === email.value) ||
      instructor.assignment?.[0]?.projectInstructor?.some(i => i.email === email.value)
    );

    console.log('instructor', instructor);
    console.log('email', email.value);

    if (instructor) {
      localStorage.setItem('email', email.value);
      const followUpInstructor = instructor.assignment?.[0]?.followUpInstructor?.find(i => i.email === email.value);
      console.log('followUpInstructor', followUpInstructor);
      const technicalInstructor = instructor.assignment?.[0]?.technicalInstructor?.find(i => i.email === email.value);
      console.log('technicalInstructor', technicalInstructor);
      const projectInstructor = instructor.assignment?.[0]?.projectInstructor?.find(i => i.email === email.value);
      console.log('projectInstructor', projectInstructor);
      currenInstructorId.value = followUpInstructor?.idInstructor || technicalInstructor?.idInstructor || projectInstructor?.idInstructor;
      console.log('currenInstructorId', currenInstructorId.value);

      await loadDataMyAssignament();
    } else {
      console.error("No se encontró el instructor con el email proporcionado.");
    }

  } catch (error) {
    console.error("Error. por favor intente más tarde.", error);
  }
};

const loadDataMyAssignament = async () => {
  loading.value = true;
  try {
    const response = await getData(`/register/listRegisterByInstructorInAssignment/${currenInstructorId.value}`);
    console.log('response', response);

    rows.value = response.data;
  } catch (error) {
    console.error("Error al cargar las asignaciones:", error);
  } finally {
    loading.value = false;
  }
};

async function onclickSearchBinnacles(row) {
  loading.value = true;
  try {
    const response = await getData(`/binnacles/listBinnaclesByRegister/${row._id}`);
    if (response) {
      router.push({
        path: '/layouts/binnaclespInstructor',
        query: { id: row._id }
      });
    }
  } catch (error) {
    notifyErrorRequest('No se encontro Bitácora registrada para el aprendiz.');
  } finally {
    loading.value = false
  }
}

async function onclickSearchFollow(row) {
  loading.value = true
  try {
    const response = await getData(`/followup/listFollowupByRegister/${row._id}`);
    if (response) {
      router.push({
        path: '/layouts/followupInstructor',
        query: { id: row._id }
      });
    }
  } catch (error) {
    notifyErrorRequest('No se encontro seguimiento registrado para el aprendiz.');
  } finally {
    loading.value = false
  }
}


async function searchApprentice() {
  try {
    const response = await getData(`/register/listregisterbyapprentice/${searchValue.value}`);
    console.log(response);
    rows.value = response.data
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      notifyErrorRequest('No hay aprendices registrados en este momento.');
    }
  }
}

async function searchTpModalite() {
  try {
    const response = await getData(`/register/listregisterbymodality/${searchValue.value}`);
    console.log(response);
    rows.value = response.data
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      if (!searchValue.value) {
        notifyErrorRequest('No hay aprendices registrados en modalidad en este momento.');
      }

    }
  }
}


const handleRadioChange = async () => {
  // validationSearch()
  if (radiobuttonlist.value === 'apprentice') {
    const response = await getData('/register/listallassignment');
    const uniqueFiches = new Set();
    optionSearch.value = response.data.map(option => {
      if (option.idApprentice && option.idApprentice.length > 0) {
      const apprendice = option.idApprentice[0]._id;
      if (!uniqueFiches.has(apprendice)) {
        uniqueFiches.add(apprendice)
        return {
          _id: option.idApprentice[0]._id,
          label: option.idApprentice[0].firstName + ' ' + option.idApprentice[0].lastName,
        };
      }
    }
    }).filter(Boolean)
    filterOptionsSearch.value = optionSearch.value;
  } else if (radiobuttonlist.value === 'tpInstructor') {
    const response = await getData('/register/listallassignment');
    const uniqueTpInstructor = new Set();
    optionSearch.value = response.data.map(option => {
      const tpInstructor = option.idModality._id;
      if (!uniqueTpInstructor.has(tpInstructor)) {
        uniqueTpInstructor.add(tpInstructor)
        return {
          _id: option.idModality._id,
          label: option.idModality.name 
        };
    }
    }).filter(Boolean)
  }
  clearSearch();
}

// limpiar campos de busqueda
function clearSearch() {
  searchValue.value = '';
}

function validationSearch() {
  if (radiobuttonlist.value === '') {
    notifyWarningRequest('Debes seleccionar una opción (Aprendiz o Tipo Instructor) antes de buscar.');
    loadingSearch.value = false;
    return false;
  }
  if (searchValue.value === '') {
    notifyWarningRequest('El campo de búsqueda no puede estar vacío. Por favor, ingrese un dato para continuar.');
    loadingSearch.value = false;
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

async function searchButton() {
  const isvalid = await formSearch.value.validate();
  if (!isvalid) {
    return
  }
  if (!validationSearch()) {
    return;
  }
  loadingSearch.value = true
  if (radiobuttonlist.value === 'apprentice') {
    await searchApprentice();
  } else if (radiobuttonlist.value === 'tpInstructor') {
    await searchTpModalite();
  }
  clearSearch();
  loadingSearch.value = false
}


</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}


.filterButtons p {
  font-weight: bold;
  font-size: 11px;
  margin: 0px;
}

#buttons-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px;
}

.allInputButtonsSearch {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
}

.InputButtonsSearch {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>