<template>
  <Header title="Aprendices"></Header>
  <div id="buttons-container">
    <div class="buttons">
      <ModalDialog :title="modalTitle" v-model="isDialogVisibleModal" nameButton="Crear" labelClose="Cerrar"
        labelSend="Guardar" :onclickClose="handleClose" :onclickSend="handleSend" :openModalButton="openButtonCreate"
        :loading="loadingHandleSend">

        <q-form ref="formRef" @submit="handleSubmit" class="formApprentice">
          <q-select v-model="formData.fiche" :options="filterOptions" label="Ficha" emit-value map-options
            option-label="label" option-value="_id" :use-input="!fiche" @filter="filterFunctionFiches" clearable
            class="custom-select" :key="fiche" filled :rules="[validateRequiredFiche]" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="abc" />
            </template>
          </q-select>

          <q-input v-model="formData.firstName" label="Nombres Aprendiz" filled
            :rules="[validateRequiredFirstName, validateFirstname, validateFirstnameSpaceWhite]">
            <template v-slot:prepend>
              <q-icon name="abc" />
            </template>
          </q-input>

          <q-input v-model="formData.lastName" label="Apellidos Aprendiz" filled
            :rules="[validateRequiredLastName, validateLastName, validateLastNameSpaceWhite]">
            <template v-slot:prepend>
              <q-icon name="abc" />
            </template>
          </q-input>

          <q-select square filled v-model="formData.tpDocument" :options="optionsTpC" label="Tipo de Documento"
            :rules="[validateRequiredTpDocument]" lazy-rules />

          <q-input v-model="formData.numDocument" label="N° Documento" filled
            :rules="[validateRequiredNumDocument, validateNumericDocument]" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="pin" />
            </template>
          </q-input>

          <q-input v-model="formData.emailPersonal" label="Email Personal Aprendiz" filled
            :rules="[validateRequieredEmailPersonal, validateEmailPersonal, validateEmail]" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input v-model="formData.emailIntitutional" label="Email Institucional Aprendiz" filled
            :rules="[validateRequiredEmailInstitutional, validateEmail]" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input v-model="formData.phone" label="Telefono Aprendiz" filled
            :rules="[validateRequiredPhone, validateNumericPhone]" lazy-rules>
            <template v-slot:prepend>
              <q-icon name="pin" />
            </template>
          </q-input>

          <q-select v-model="formData.idmodality" :options="filterOptionsModality" label="Modalidad Etapa Productiva"
            emit-value map-options option-label="name" option-value="_id" :use-input="!fiche"
            @filter="filterFunctionModality" clearable class="custom-select" v-show="modality" filled
            :rules="[validateRequiredIdModality]" lazy-rules>
            <template v-slot:prepend>

              <q-icon name="abc" />
            </template>
          </q-select>
        </q-form>

      </ModalDialog>
      <buttonuploadFile nameButton="Subir"></buttonuploadFile>
    </div>

    <div class="allInputButtonsSearch">
      <div class="filterButtons">
        <p style="color: #2F7D32; font-weight: bold;">Seleccione una opción:</p>
        <div class="radio-buttons">
          <radioButtonFiche v-model="radiobuttonlist" label="Ficha" val="Fiche"
            @update:model-value="handleRadioChange" />
          <radioButtonAppretice v-model="radiobuttonlist" label="Aprendiz" val="Appretice"
            @update:model-value="handleRadioChange" />
          <radioButtonStatus v-model="radiobuttonlist" label="Estado" val="Status"
            @update:model-value="handleRadioChange" />
        </div>
      </div>
    </div>
    <q-form ref="formSearch" @submit.prevent="searchButton" class="InputButtonsSearch">
      <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
        optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select"
        :rules="[validateRequieredSearch]" lazy-rules />
      <buttonSearch :onclickButton="searchButton" :loading="loadingSearch" />
    </q-form>
  </div>
  <CustomTable :rows="rows" :columns="columns" :onClickEdit="openDialogEdit" class="class"
    :onclickStatus="changestatusIcon" :loading="loading">
  </CustomTable>


</template>

<script setup>
import CustomTable from "../components/tables/tableEditStatusOptions.vue";
import { ref, onBeforeMount, TransitionGroup, } from "vue";
import Header from "../components/header/header.vue";
import { getData, postData, putData } from '../services/ApiClient.js';
import ModalDialog from '../components/modal/modal.vue';
import { notifyErrorRequest, notifySuccessRequest, notifyWarningRequest } from '../composables/useNotify.js';
import radioButtonAppretice from "../components/radioButtons/radioButton.vue";
import radioButtonFiche from "../components/radioButtons/radioButton.vue";
import radioButtonStatus from "../components/radioButtons/radioButton.vue";
import inputSelect from "../components/input/inputSelect.vue";
import { useRoute } from 'vue-router';
import InputSelect from "../components/input/inputSelect.vue"
import buttonSearch from "../components/buttons/buttonSearch.vue";

const route = useRoute();

let loading = ref(false)
let loadingSearch = ref(false)
let loadingHandleSend = ref(false)

onBeforeMount(() => {
  loadData()
});

const formRef = ref(null)
const formSearch = ref(null)
const formData = ref({
  firstName: '',
  lastName: '',
  emailPersonal: '',
  emailIntitutional: '',
  phone: '',
  tpDocument: '',
  numDocument: '',
  fiche: '',
  idmodality: ''
})
let row_id = ref('')
let modality = ref(false)
let inputIdmodality = ref(false)

// opciones de tipo de documento
const optionsTpC = [
  'C.C', 'T.I', 'C.E', 'S.C.R', 'P.A'
]

// radio buttons
let radiobuttonlist = ref('');
let searchValue = ref('')
let filterOptionsSearch = ref([])
let optionSearch = ref([])

// Modal
let isDialogVisibleModal = ref(false)
let ismodalType = ref(true)
let modalTitle = ref(ismodalType.value ? 'Crear Aprendiz' : 'Editar Aprendiz')

// filtros fichas
const options = ref([]);
const filterOptions = ref([]);

// filtros modalidades
const optionsModality = ref([]);
const filterOptionsModality = ref([]);

// validaciones
const validateRequiredFirstName = (v) => !!v || 'los nombres son obligatorio';
const validateFirstname = (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(v) || 'Los nombres solo puede incluir letras.';
const validateFirstnameSpaceWhite = (v) => /^[^\s].*[^\s]$/.test(v) || 'Los nombres no puede empezar ni terminar con espacios.';
const validateRequiredLastName = (v) => !!v || 'Los apellidos son obligatorio';
const validateLastName = (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(v) || 'Los apellidos solo puede contener letras';
const validateLastNameSpaceWhite = (v) => /^[^\s].*[^\s]$/.test(v) || 'Los apellidos no puede empezar ni terminar con espacios';
const validateRequiredTpDocument = (v) => !!v || 'El  tipo de Documento es obligatorio';
// const validateRequiredNumDocument = (v) => !!v || 'El número de Documento es obligatorio';
const validateRequieredEmailPersonal = (v) => !!v || 'El email Personal es obligatorio';
const validateEmailPersonal = (v) => /.+@.+\..+/.test(v) || 'Correo electrónico no válido';
const validateRequiredEmailInstitutional = (v) => !!v || 'El email Institucional es obligatorio';
const validateEmail = (v) => /.+@.+\..+/.test(v) || 'Correo electrónico no válido';
const validateRequiredPhone = (v) => !!v || 'El teléfono es obligatorio';
const validateRequiredFiche = (v) => !!v || 'La ficha es obligatorio';
const validateRequiredIdModality = (v) => !!v || 'La modalidad Etapa Productiva es obligatorio';
const validateNumericDocument = (v) => {
  if (!v) {
    return 'El número de Documento es obligatorio'
  }
  if (/\s/.test(v)) {
    return 'El número de documento no puede tener espacios en blanco';
  }
  if (/[^0-9]/.test(v)) {
    return 'El número de documento solo puede contener números';
  }

  if (v.length < 8) {
    return 'El documento debe tener al menos 8 caracteres';
  } else if (v.length > 10) {
    return 'El documento no debe tener más de 10 caracteres';
  }
  return true;
};

const validateNumericPhone = (v) => {
  if (/\s/.test(v)) {
    return 'El Teléfono no puede tener espacios en blanco';
  }
  if (/[^0-9]/.test(v)) {
    return 'El Teléfono solo puede contener números';
  }
  if (v.length !== 10) {
    return 'El Teléfono debe tener 10 dígitos';
  }
}

// validar el input de busqueda
const validateRequieredSearch = (v) => {
  if (radiobuttonlist.value === '') {
    return 'Debes seleccionar una opción'
  }
  if (radiobuttonlist.value === 'Status' && (v === 0 || v === 1)) {
    return true;
  }
  if (!v) {
    return 'El campo de búsqueda es obligatorio';
  }
}

const loadData = async () => {
  loading.value = true
  const ficheId = route.query.ficheId
  console.log('idfiche', ficheId);
  try {
    if (ficheId) {
      const response = await getData(`/apprendice/listapprenticebyfiche/${ficheId}`);
      console.log(response)
      rows.value = response.apprentices;
      if (response.apprentices.length === 0) {
        notifyWarningRequest('No se encontraron aprendices en la ficha seleccionada. Mostrando todos los aprendices.');
        const allResponse = await getData('/apprendice/listallapprentice');
        rows.value = allResponse;
      }
    } else {
      const response = await getData('/apprendice/listallapprentice');
      console.log(response);
      rows.value = response;
    }

  } catch (error) {
    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = error.response.data.message || 'No se encontraron aprendices para la búsqueda realizada.';
    } else if (error.respo && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
      messageError = error.response.data.errors[0].msg
    } else {
      messageError = 'Ocurrió un error inesperado. Por favor, intente nuevamente.'
    }
    notifyErrorRequest(messageError);
  } finally {
    loading.value = false
  }
}

const rows = ref([]);
const columns = ref([
  {
    name: "Num",
    label: "N°",
    field: "Num",
    align: "center",
    sortable: true,
  },
  {
    name: "firstName",
    label: "NOMBRE APRENDIZ",
    field: row => row ? `${row.firstName} ${row.lastName}` : 'No hay datos',
    align: "center",
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
    name: "numDocument",
    align: "center",
    label: "N° DOCUMENTO",
    field: "numDocument",
    sortable: true,
  },
  {
    name: "personalEmail",
    align: "center",
    label: "EMAIL PERSONAL",
    field: "personalEmail",
    sortable: true,
  },
  {
    name: "institutionalEmail",
    align: "center",
    label: "EMAIL INSTITUCIONAL",
    field: "institutionalEmail",
    sortable: true,
  },
  {
    name: "phone",
    align: "center",
    label: "TEL",
    field: "phone",
    sortable: true,
  },
  {
    name: "fiche.name",
    align: "center",
    label: "PROGRAMA",
    field: row => row.fiche.name,
    sortable: true,
  },
  {
    name: "fiche.number",
    align: "center",
    label: "FICHA",
    field: row => row.fiche.number,
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
    name: "opcion",
    label: "OPCIONES",
    align: "center",
    field: "opcion",
    sortable: true,
  }
]);

function resetForm() {
  formData.value.firstName = '';
  formData.value.lastName = '';
  formData.value.emailPersonal = '';
  formData.value.emailIntitutional = '';
  formData.value.phone = '';
  formData.value.tpDocument = '';
  formData.value.numDocument = '';
  formData.value.fiche = '';
  formData.value.idmodality = '';
}

async function changestatusIcon(row) {
  if (row.status === 1) {
    await putData(`/apprendice/disableapprentice/${row._id}`);
  } else {
    await putData(`/apprendice/enableapprentice/${row._id}`);
  }
  row.status = row.status === 1 ? 0 : 1;
  notifySuccessRequest(row.status === 1 ? 'Aprendiz activado correctamente' : 'Aprendiz inactivado correctamente');
}

function openButtonCreate() {
  ismodalType.value = true;
  isDialogVisibleModal.value = true;
  modality.value = true
  inputIdmodality.value = true;
  modalTitle.value = ismodalType.value ? 'Crear Aprendiz' : 'Editar Aprendiz';
  resetForm();
}
// se agregan variables para guardar los valores originales
const originalValues = ref({
  firstName: '',
  lastName: '',
  personalEmail: '',
  institutionalEmail: '',
  phone: '',
  tpDocument: '',
  numDocument: '',
  fiche: ''
});

function openDialogEdit(row) {
  isDialogVisibleModal.value = true;
  ismodalType.value = false;
  modality.value = false
  formData.value.firstName = row.firstName;
  formData.value.lastName = row.lastName
  formData.value.emailPersonal = row.personalEmail
  formData.value.emailIntitutional = row.institutionalEmail
  formData.value.phone = row.phone
  formData.value.tpDocument = row.tpDocument
  formData.value.numDocument = row.numDocument
  formData.value.fiche = row.fiche.idFiche
  formData.value.idmodality = row.idModality
  row_id.value = row._id;

  // guarda valores originales
  originalValues.value = {
    firstName: row.firstName,
    lastName: row.lastName,
    personalEmail: row.personalEmail,
    institutionalEmail: row.institutionalEmail,
    phone: row.phone,
    tpDocument: row.tpDocument,
    numDocument: row.numDocument,
    fiche: row.fiche.idFiche
  };
}
function handleClose() {
  ismodalType.value = false
  resetForm();
}
function isFormEmpty() {
  return !formData.value.firstName &&
    !formData.value.lastName &&
    !formData.value.emailPersonal &&
    !formData.value.emailIntitutional &&
    !formData.value.phone &&
    !formData.value.tpDocument &&
    !formData.value.numDocument &&
    !formData.value.fiche;
}

const handleSend = async () => {

  if (isFormEmpty()) {
    notifyWarningRequest('Por favor, ingrese datos en el formulario.');
  }
  const isValid = await formRef.value.validate();
  if (!isValid) {
    return;
  }
  loadingHandleSend.value = true;
  try {
    const selectedFiche = filterOptions.value.find((opt) => opt._id === formData.value.fiche);
    let response;
    if (ismodalType.value) {
      response = await postData('/apprendice/addapprentice', {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        personalEmail: formData.value.emailPersonal,
        institutionalEmail: formData.value.emailIntitutional,
        phone: formData.value.phone,
        tpDocument: formData.value.tpDocument,
        numDocument: formData.value.numDocument,
        fiche: {
          idFiche: formData.value.fiche,
          name: selectedFiche.name,
          number: selectedFiche.number,
        },
        idModality: formData.value.idmodality
      });
    } else {
      response = await putData(`/apprendice/updateapprenticebyid/${row_id.value}`, {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        personalEmail: formData.value.emailPersonal,
        institutionalEmail: formData.value.emailIntitutional,
        phone: formData.value.phone,
        tpDocument: formData.value.tpDocument,
        numDocument: formData.value.numDocument,
        fiche: {
          idFiche: formData.value.fiche,
          name: selectedFiche.name,
          number: selectedFiche.number,
        },
        ...(formData.value.idmodality && { idModality: formData.value.idmodality })
      });

      const hasChanges =
        formData.value.firstName !== originalValues.value.firstName ||
        formData.value.lastName !== originalValues.value.lastName ||
        formData.value.emailPersonal !== originalValues.value.personalEmail ||
        formData.value.emailIntitutional !== originalValues.value.institutionalEmail ||
        formData.value.phone !== originalValues.value.phone ||
        formData.value.tpDocument !== originalValues.value.tpDocument ||
        formData.value.numDocument !== originalValues.value.numDocument ||
        formData.value.fiche !== originalValues.value.fiche

      if (!hasChanges) {
        notifyWarningRequest('No se han realizado cambios en la información del aprendiz.');
        resetForm();
        isDialogVisibleModal.value = false;
        await loadData()
        loadingHandleSend.value = false;
        return
      }

    }
    notifySuccessRequest(ismodalType.value ? 'El aprendiz se ha creado exitosamente.' : 'La información del aprendiz se ha actualizado correctamente.');
    isDialogVisibleModal.value = false;
    resetForm();
    await loadData();

  } catch (error) {
    console.log(error);

    let messageError;
    if (error.response && error.response.data && error.response.data.message) {
      messageError = error.response.data.message;
    } else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
      messageError = error.response.data.errors[0].msg;
    } else {
      messageError = 'Ocurrió un error inesperado al cargar los datos. Por favor, intente nuevamente más tarde.';
    }
    notifyErrorRequest(messageError);
  } finally {
    loadingHandleSend.value = false;
  }
};

//filtro de fichas
async function fetchDataFiche() {
  const response = await getData('/repfora/fiches');
  const uniqueFiches = new Set();
  options.value = response.map(option => {
    const ficheId = option.program._id;
    if (!uniqueFiches.has(ficheId)) {
      uniqueFiches.add(ficheId);
      return {
        _id: option._id,
        label: `${option.program.name} - ${option.program.code}`,
        name: option.program.name,
        number: option.program.code,
      };
    }
  }).filter(Boolean);
  filterOptions.value = options.value;
}

fetchDataFiche();

function filterFunctionFiches(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filterOptions.value = options.value.filter(option =>
      option.label.toLowerCase().includes(needle)
    );
  });
}


// filtro de modalidades
async function fetchDataModality() {
  const response = await getData('/modality/listallmodality');

  optionsModality.value = response
  filterOptionsModality.value = optionsModality.value;
}

fetchDataModality()

async function filterFunctionModality(val, update) {
  if (val === "") {
    update(() => {
      filterOptionsModality.value = filterOptionsModality.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase();
    filterOptionsModality.value = optionsModality.value.filter((option) =>
      option.name.toLowerCase().includes(needle)
    );
  });
}

async function listApprenticeForFiches() {
  try {
    const response = await getData(`/apprendice/listapprenticebyfiche/${searchValue.value}`);
    console.log(response);
    rows.value = response.apprentices;
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      notifyErrorRequest(`No se encontraron aprendices registrados en la ficha seleccionada.`);
    }
  }
}

async function listApprenticeForApprentice() {
  try {
    const response = await getData(`/apprendice/listapprenticebyid/${searchValue.value}`);
    console.log(response);
    rows.value = [response];
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      notifyErrorRequest('No se encontró ningún aprendiz que coincidan con el nombre o número de documento ingresado');
    }
  }
}

async function listApprenticeForStatus() {
  try {
    const response = await getData(`/apprendice/listapprenticebystatus/${searchValue.value}`);
    console.log(response);
    rows.value = response.apprentices;
  } catch (error) {
    if (searchValue.value === '') {
      validationSearch()
    } else {
      if (searchValue.value === 1) {
        notifyErrorRequest('No hay aprendices registrados en estado activo en este momento')
        // return
      } else {
        notifyErrorRequest('No hay aprendices registrados en estado inactivo en este momento.');
      }

    }
  }
}


const handleRadioChange = async () => {
  // validationSearch()
  if (radiobuttonlist.value === 'Fiche') {
    const response = await getData('/apprendice/listallapprentice');
    const uniqueFiches = new Set();
    optionSearch.value = response.map(option => {
      const ficheId = option.fiche.idFiche
      if (!uniqueFiches.has(ficheId)) {
        uniqueFiches.add(ficheId)
        return {
          _id: option.fiche.idFiche,
          label: `${option.fiche.name} - ${option.fiche.number}`,
        }
      }
    }).filter(Boolean)
    filterOptionsSearch.value = optionSearch.value;
  } else if (radiobuttonlist.value === 'Appretice') {
    const response = await getData('/apprendice/listallapprentice');
    optionSearch.value = response.map(option => ({
      _id: option._id,
      label: `${option.firstName} ${option.lastName} - ${option.numDocument}`,
      numDocument: option.numDocument
    }));
    filterOptionsSearch.value = optionSearch.value;
  } else if (radiobuttonlist.value === 'Status') {
    optionSearch.value = [
      { label: 'Activo', _id: 1 },
      { label: 'Inactivo', _id: 0 }
    ];
    console.log(optionSearch.value);
    filterOptionsSearch.value = optionSearch.value;
  }
  clearSearch();
}

// limpiar campos de busqueda
function clearSearch() {
  searchValue.value = '';
}

function validationSearch() {
  if (radiobuttonlist.value === '') {
    notifyWarningRequest('Debes seleccionar una opción (Ficha, Aprendiz o Estado) antes de buscar.');
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
  if (radiobuttonlist.value === 'Fiche') {
    await listApprenticeForFiches();
  } else if (radiobuttonlist.value === 'Appretice') {
    await listApprenticeForApprentice();
  } else if (radiobuttonlist.value === 'Status') {
    await listApprenticeForStatus();
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

.formApprentice {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 15px;
}

.filterButtons p {
  font-weight: bold;
  font-size: 11px;
  margin: 0px;
}

#buttons-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
}

.filterButtons {
  display: flex;
  flex-direction: column;
  width: 80%;
}

.buttons {
  width: 100%;
  gap: 20px;
}

.radio-buttons {
  display: flex;
  gap: 10px;
  margin-right: 4%;
}

.AllInputButtonsSearch {
  width: 100%;
  display: flex;
  gap: 20px;
}

.InputButtonsSearch {
  display: flex;
  gap: 10px;
  width: 40%;
  align-items: center;
  margin-right: 2%;
  margin-left: 2%;
}
</style>
