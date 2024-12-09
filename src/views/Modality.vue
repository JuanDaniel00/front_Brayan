<template>
  <Header title="Modalidad EP"></Header>
  <div id="buttons-container">
    <modalDialog :title="modalTitle" v-model="isDialogVisibleModal" nameButton="Crear" labelClose="Cerrar"
      labelSend="Guardar" :onclickClose="handleClose" :onclickSend="handleSend" :openModalButton="openButtonCreate"
      :loading="loadingSend">

      <q-form ref="formRef" @submit="handleSubmit" class="formModality">
        <q-input v-model="formData.modality" label="Nombre de la modalidad" filled
          :rules="[validateRequiredModality, validateUniqueModality]">
          <template v-slot:prepend class="custom-select">
            <q-icon name="abc" />
          </template>
        </q-input>

        <q-input v-model="formData.hourInstFollowup" label="Horas Instructor de Seguimiento" filled
          :rules="[validateRequieredHourFollowup]">
          <template v-slot:prepend>
            <q-icon name="abc" />
          </template>
        </q-input>

        <q-input v-model="formData.hourInstTechnical" label="Horas Instructor Técnico" filled
          :rules="[validateRequiredHourTechinical]" :disable="isModalityInstructorUno" >
          <template v-slot:prepend>
            <q-icon name="abc" />
          </template>
        </q-input>

        <q-input v-model="formData.hourInstProyect" label="Horas instructor de Proyecto" filled
          :rules="[validateRequiredHuorProyect]" :disable="isModalityInstructorUno" >
          <template v-slot:prepend>
            <q-icon name="abc" />
          </template>
        </q-input>
      </q-form>
    </modalDialog>
    <q-form ref="formRef" @submit="searchModality" class="formModality">
      <div class="InputButtonsSearch">
        <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
          optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select"
          :rules="[(val) => !!val || 'El campo de búsqueda es obligatorio']" />
        <buttonSearch :onclickButton="searchModality" :loading="loadingSearch" />
      </div>
    </q-form>
  </div>

  <tableModalityEp :rows="rows" :columns="columns" :onclickEdit="openDialogEdit" :loading="loading" />
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
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
let ismodalType = ref(false)
let modalTitle = ref(ismodalType.value ? 'Crear Modalidad' : 'Editar Modalidad')

// select modality
const optionsModality = ref([]);
const filterOptionsModality = ref([]);

const formRef = ref(null)
const formData = ref({
  modality: '',
  hourInstFollowup: '',
  hourInstProyect: '',
  hourInstTechnical: ''
})
let id = ref('')

// buscar por modalidad
let filterOptionsSearch = ref([]);
let OptionsSearch = ref([])
let searchValue = ref('')

// spiners
let loading = ref(false)
let loadingSearch = ref(false)
let loadingSend = ref(false)

// Lista de modalidades existentes
let existingModalities = ref([])
const modalityInstructorUno = ['MONITORIAS', 'PASANTIA', 'VINCULO LABORAL', 'UNIDAD PRODUCTIVA FAMILIAR', 'CONTRATO DE APRENDIZAJE']
const isModalityInstructorUno = computed(() => {
  return modalityInstructorUno.includes(formData.value.modality);
});

const validateRequiredModality = (v) => {
  if (!v) {
    return 'La modalidad es obligatorio'
  }
}

const validateUniqueModality = (v) => {
  if (existingModalities.value.includes(v) && (ismodalType.value || v !== originalDataValues.value.modality)) {
    return 'Ya existe una modalidad con este nombre'
  }
}

const validateRequieredHourFollowup = (v) => {
  if (ismodalType.value === true && !v) {
    return 'La hora del instructor de seguimiento es obligatorio'
  }
  if (!modalityInstructorUno.includes(formData.value.modality) && !v || modalityInstructorUno.includes(formData.value.modality) && !v) {
    return 'La hora del instructor de seguimiento es requerida'
  }
  if (/\s/.test(v)) {
    return 'La hora de instructor de seguimiento no puede contener espacios en blanco'
  }
  if (/[^0-9]/.test(v)) {
    return 'La hora  de instructor de seguimiento solo puede contener numeros'
  }
}

const validateRequiredHourTechinical = (v) => {
  if (ismodalType.value === true && !v) {
    return 'La hora del instructor técnico es obligatorio'
  }
  if (!modalityInstructorUno.includes(formData.value.modality) && !v) {
    return 'La hora del instructor de técnico es requerida'
  }
  if (/\s/.test(v)) {
    return 'La hora de instructor técnico no puede contener espacios en blanco'
  }
  if (/[^0-9]/.test(v)) {
    return 'La hora  de instructor técnico solo puede contener numeros'
  }
}

const validateRequiredHuorProyect = (v) => {
  if (ismodalType.value === true && !v) {
    return 'La hora del instructor de proyecto es obligatorio'
  }
  if (!modalityInstructorUno.includes(formData.value.modality) && !v) {
    return 'La hora del instructor de proyecto es requerida'
  }
  if (/\s/.test(v)) {
    return 'La hora de instructor de proyecto no puede contener espacios en blanco'
  }
  if (/[^0-9]/.test(v)) {
    return 'La hora  de instructor de proyecto solo puede contener numeros'
  }
}

const rows = ref([]);
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
    existingModalities.value = response.map(modality => modality.name)
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
  formData.value.modality = row.name
  formData.value.hourInstFollowup = row.hourInstructorFollow
  formData.value.hourInstTechnical = row.hourInstructorTechnical
  formData.value.hourInstProyect = row.hourInstructorProject
  id.value = row._id
  originalDataValues.value = {
    modality: row.name,
    hourInstFollowup: row.hourInstructorFollow,
    hourInstTechnical: row.hourInstructorTechnical,
    hourInstProyect: row.hourInstructorProject
  }
}

function handleClose() {
  cleanForm()
}

async function handleSend() {
  const isValid = await formRef.value.validate();
  if (!isValid) {
    return
  }
  loadingSend.value = true
  try {
    const data = {
      name: formData.value.modality,
      hourInstructorFollow: formData.value.hourInstFollowup,
      hourInstructorTechnical: formData.value.hourInstTechnical,
      hourInstructorProject: formData.value.hourInstProyect
    }
    let response;
    if (ismodalType.value) {
      response = await postData('/modality/addModality', data)
      console.log(response);
    } else {
      response = await putData(`/modality/updatemodalitybyid/${id.value}`, data)
      console.log(response);
      const hasChanges =
        originalDataValues.value.modality !== formData.value.modality ||
        originalDataValues.value.hourInstFollowup !== formData.value.hourInstFollowup ||
        originalDataValues.value.hourInstTechnical !== formData.value.hourInstTechnical ||
        originalDataValues.value.hourInstProyect !== formData.value.hourInstProyect

      if (!hasChanges) {
        notifyWarningRequest('No se han realizado cambios')
        isDialogVisibleModal.value = false;
        cleanForm()
        return
      }
    }
    isDialogVisibleModal.value = false;
    notifySuccessRequest(ismodalType.value ? 'La modalidad se ha creado exitosamente.' : 'La información de modalidad se ha actualizado correctamente.')
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
  } finally {
    loadingSend.value = false
  }
}

function cleanForm() {
  formData.value.modality = ''
  formData.value.hourInstFollowup = ''
  formData.value.hourInstTechnical = ''
  formData.value.hourInstProyect = ''
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
  const isvalid = await formRef.value.validate()
  if (!isvalid) {
    return
  }
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