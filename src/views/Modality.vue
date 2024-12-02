<template>
  <Header title="Modalidad EP"></Header>
  <div id="buttons-container">
    <modalDialog class="formModality" :title="modalTitle" v-model="isDialogVisibleModal" nameButton="Crear"
      labelClose="Cerrar" labelSend="Guardar" :onclickClose="handleClose" :onclickSend="handleSend"
      :openModalButton="openButtonCreate" :loading="loadingSend">

      <q-select v-model="modality" :options="filterOptionsModality" label="Nombre de la modalidad" emit-value
        map-options option-label="label" option-value="_id" :use-input="!modalitytp" @filter="filterFunctionModality"
        clearable class="custom-select" :rules="[
          (val) => !!val || 'La ficha Modalidad es obligatoria'
        ]" filled>
        <template v-slot:prepend class="custom-select">
          <q-icon name="abc" />
        </template>
      </q-select>

      <q-input v-model="hourInstFollowup" label="Horas Instructor de Seguimiento"
        :rules="[(val) => !!val || 'Este campo Horas Instructor de Seguimiento es obligatorio ']" filled>
        <template v-slot:prepend>
          <q-icon name="abc" />
        </template>
      </q-input>

      <q-input v-model="hourInstTechnical" label="Horas Instructor Técnico"
        :rules="[(val) => !!val || 'Este campo Horas Instructor Técnico es obligatorio ']" filled>
        <template v-slot:prepend>
          <q-icon name="abc" />
        </template>
      </q-input>

      <q-input v-model="hourInstProyect" label="Horas instructor de Proyecto"
        :rules="[(val) => !!val || 'Este campo Horas instructor de Proyecto es obligatorio ']" filled>
        <template v-slot:prepend>
          <q-icon name="abc" />
        </template>
      </q-input>
    </modalDialog>
    <div class="InputButtonsSearch">
      <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
        optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select" />
      <buttonSearch :onclickButton="searchModality" :loading="loadingSearch" />
    </div>
  </div>
  <tableModalityEp :rows="rows" :columns="columns" :onclickEdit="openDialogEdit" :loading="loading" />
</template>

<script setup>
import { ref, onBeforeMount, TransitionGroup } from 'vue';
import Header from '../components/header/header.vue';
import tableModalityEp from '../components/tables/tableModalityEp.vue';
import modalDialog from '../components/modal/modal.vue';
import inputSelect from '../components/input/inputSelect.vue';
import buttonSearch from '../components/buttons/buttonSearch.vue';
import { notifyErrorRequest, notifySuccessRequest, notifyWarningRequest } from '../composables/useNotify';
import { getData, postData, putData } from '../services/ApiClient';
onBeforeMount(() => {
  loadDataModality()
})

// modal
const isDialogVisibleModal = ref(false);
let ismodalType = ref(true)
let modalTitle = ref(ismodalType.value ? 'Crear Aprendiz' : 'Editar Aprendiz')

// select modality
const optionsModality = ref([]);
const filterOptionsModality = ref([]);

// form modality
let modality = ref('')
let hourInstFollowup = ref('')
let hourInstTechnical = ref('')
let hourInstProyect = ref('')
let id = ref('')

// buscar por modalidad
let filterOptionsSearch = ref([]);
let OptionsSearch = ref([])
let searchValue = ref('')

// spiners
let loading = ref(false)
let loadingSearch = ref(false)
let loadingSend = ref(false)

const rows = ref([
]);
const columns = ref([
  {
    name: 'Num',
    label: 'N°',
    align: 'center',
    field: 'Num',
    sortable: true,
  },
  {
    name: 'name',
    label: 'NOMBRE MODALIDAD',
    align: 'center',
    field: 'name',
    sortable: true,
  },
  {
    name: 'number',
    label: 'HORAS INS. SEGUIMIENTO',
    align: 'center',
    field: row => row.hourInstructorFollow ? row.hourInstructorFollow : 'N/A',
    sortable: true,
  },
  {
    name: 'number',
    label: 'HORAS INS. TÉCNICO',
    align: 'center',
    field: row => row.hourInstructorTechnical ? row.hourInstructorTechnical : 'N/A',
    sortable: true,
  },
  {
    name: 'number',
    label: 'HORAS INS. PROYECTO',
    align: 'center',
    field: row => row.hourInstructorProject ? row.hourInstructorProject : 'N/A',
    sortable: true,
  },
  {
    name: 'status',
    label: 'ESTADO',
    align: 'center',
    field: 'status',
    sortable: true,
  },
  {
    name: 'options',
    label: 'ACCIONES',
    align: 'center',
    field: 'actions',
  },
]);

async function loadDataModality() {
  loading.value = true
  try {
    const response = await getData('/modality/listallmodality')
    console.log(response);
    rows.value = response
  } catch (error) {
    notifyErrorRequest('Error al cargar los datos')
  } finally {
    loading.value = false
  }

}
function openButtonCreate() {
  isDialogVisibleModal.value = true;
  ismodalType.value = true
  modalTitle.value = 'Crear Modalidad'
}

const originalDataValues = ref({
  modality: '',
  hourInstFollowup: '',
  hourInstTechnical: '',
  hourInstProyect: ''
})
function openDialogEdit(row) {
  isDialogVisibleModal.value = true;
  ismodalType.value = false
  modalTitle.value = 'Editar Modalidad'
  modality.value = row.name
  hourInstFollowup.value = row.hourInstructorFollow
  hourInstTechnical.value = row.hourInstructorTechnical
  hourInstProyect.value = row.hourInstructorProject
  id.value = row._id
  originalDataValues.value = {
    modality: row.name,
    hourInstFollowup: row.hourInstructorFollow,
    hourInstTechnical: row.hourInstructorTechnical,
    hourInstProyect: row.hourInstructorProject
  }

}

function handleClose() {
  ismodalType.value = false
  cleanForm()
}

async function handleSend() {
  loadingSend.value = true
  try {
    if (!validationsForm()) {
      return
    }
    const data = {
      name: modality.value,
      hourInstructorFollow: hourInstFollowup.value,
      hourInstructorTechnical: hourInstTechnical.value,
      hourInstructorProject: hourInstProyect.value
    }
    let response;
    if (ismodalType.value) {
      response = await postData('/modality/addModality', data)
      console.log(response);
    } else {
      response = await putData(`/modality/updatemodalitybyid/${id.value}`, data)
      console.log(response);
      const hasChanges =
        originalDataValues.value.modality !== modality.value ||
        originalDataValues.value.hourInstFollowup !== hourInstFollowup.value ||
        originalDataValues.value.hourInstTechnical !== hourInstTechnical.value ||
        originalDataValues.value.hourInstProyect !== hourInstProyect.value

      if (!hasChanges) {
        notifyWarningRequest('No se han realizado cambios')
        isDialogVisibleModal.value = false;
        cleanForm()
        return
      }
    }
    isDialogVisibleModal.value = false;
    notifySuccessRequest('Datos enviados correctamente')
    cleanForm()
    await loadDataModality()
  } catch (error) {
    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = error.response.data.message
    } else if (error.response && error.response.data && error.response.data.error) {
      messageError = error.response.data.error
    } else if (error.response && error.response.data && error.response.data.errors &&
      error.response.data.errors[0].msg) {
      messageError = error.response.data.errors[0].msg
    } else {
      messageError = 'Error al enviar los datos'
    }
    console.log('error', messageError);
    notifyErrorRequest(messageError)
    return
  }finally{
    loadingSend.value = false
  }
}


function validationsForm() {
  if (!modality.value || hourInstFollowup.value === '' || hourInstFollowup.value === null ||
    hourInstTechnical.value === '' || hourInstTechnical.value === null ||
    hourInstProyect.value === '' || hourInstProyect.value === null) {
    notifyWarningRequest('Por favor, completa todos los campos para poder continuar.')
    return false
  }
  return true
}

function cleanForm() {
  modality.value = ''
  hourInstFollowup.value = ''
  hourInstTechnical.value = ''
  hourInstProyect.value = ''
}

async function fetchDataModality() {
  const response = await getData('/modality/listallmodality')
  optionsModality.value = response.map(options => ({
    _id: options.name,
    label: options.name,
  }))
  filterOptionsModality.value = optionsModality.value
}

fetchDataModality()

function filterFunctionModality(val, update) {
  if (val === '') {
    update(() => {
      filterOptionsModality.value = optionsModality.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();
    filterOptions.value = options.value.filter((option) =>
      option.label.toLowerCase().includes(needle)
    );
  });
}


async function fectchDateSearch() {
  const response = await getData('/modality/listallmodality')
  const uniqueModality = new Set()
  OptionsSearch.value = response.map(options => {
    if (!uniqueModality.has(options.name)) {
      uniqueModality.add(options.name)
      return {
        _id: options._id,
        label: options.name,
      }
    }
  }).filter(Boolean)
  filterOptionsModality.value = OptionsSearch.value
}

fectchDateSearch()

function filterFunctionSearch(val, update) {
  if (val === '') {
    update(() => {
      filterOptionsSearch.value = OptionsSearch.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase();
    filterOptionsSearch.value = OptionsSearch.value.filter((option) =>
      option.label.toLowerCase().includes(needle)
    );
  });
}

async function searchModality() {
  loadingSearch.value = true
  try {
    validationSearch()
    const response = await getData(`/modality/listmodalitybyid/${searchValue.value}`)
    console.log(response);
    rows.value = [response]
  } catch (error) {
    const message = error.response.data.errors[0].msg || error.response.data.message || 'Error al buscar la modalidad'
    notifyErrorRequest(message)
    await loadDataModality()
  } finally {
    loadingSearch.value = false
  }

}

function validationSearch() {
  if (searchValue.value === '') {
    notifyWarningRequest('El campo de busqueda no puede estar vacio')
  }
}




</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#buttons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
}

.InputButtonsSearch {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}
</style>