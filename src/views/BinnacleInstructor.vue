<template>
    <Header title="Bitácoras"></Header>
    <div id="container-buttons">
        <div class="searchButtons">
            <div class="allInputButtonsSearch">
                <radioButtonApprentice v-model="radioButtonList" label="Aprendiz" val="apprentice"
                    @update:model-value="handleRadioChange" />
            </div>
            <div class="InputButtonsSearch">
                <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
                    optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select" />
                <buttonSearch :onclickButton="searchButton" :loading="loadingSearch" />
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

onBeforeMount(async () => {
    await loadDataBinnacles();
})

const id = ref('')

// spiner
let loading = ref(false);
let loadingSearch = ref(false);
let loadingCreateOdservation = ref(false)
const route = useRoute();


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
        field: "status",
        sortable: true,
    }, {
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
async function loadDataBinnacles() {
    loading.value = true;

    const email = authStore.email;
    console.log(authStore.email);
    if (!email) {
        notifyErrorRequest('No se pudo obtener el correo del usuario. Por favor, verifica tu sesión.');
        loading.value = false;
        return;
    }

    try {
        const response = await getData(`/binnacles/listbinnaclesbyinstructoremail/${email}`);
        console.log('Bitácoras listadas:', response);
        rows.value = response; // Asignar los datos de las bitácoras
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
    } finally {
        loading.value = false;
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
      ...row.observation.map((obs) => ({
        name: row.instructor ? row.instructor.name : "Instructor desconocido",
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
    id.value = row._id
}

async function handleSend() {
    loadingCreateOdservation.value = true;
    try {
        const response = await putData(`/binnacles/addobservation/${id.value}`, { observation: newObservation.value });
        notifySuccessRequest('La observación se ha añadido correctamente');
        isDialogVisibleCreateObservation.value = false;
        await loadDataBinnacles();
        cleanObservaton()
    } catch (error) {
        if (newObservation.value === '') {
            validationHandleSend()
        } else {
            const messageError = error.response.data.errors[0].msg || error.response.data.message || 'Hubo un error al intentar añadir la asignación. Por favor, inténtalo nuevamente.'
            notifyErrorRequest(messageError);
            cleanObservaton()
        }
        await loadDataBinnacles()
    } finally {
        loadingCreateOdservation.value = false
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


async function searchInstructor() {
    try {
        const response = await getData(`/binnacles/listbinnaclesbyinstructor/${searchValue.value}`)
        console.log(response);
        rows.value = response
    } catch (error) {
        if (searchValue.value === '') {
            validationSearch()
        } else {
            const messageError = error.response.data.error || 'Error al buscar ficha'
            notifyErrorRequest(messageError)
        }
        loadDataBinnacles()

    }
}

async function searchApprentice() {
    try {
        const response = await getData(`/binnacles/listBinnaclesByRegister/${searchValue.value}`)
        console.log(response);
        rows.value = response.binnacles
    } catch (error) {
        if (searchValue.value === '') {
            validationSearch()
        } else {
            const messageError = error.response.data.errors || error.response.data.error[0].msg || error.response.data.message || 'Error al buscar aprendiz'
            console.log(messageError);
            notifyErrorRequest(messageError)
        }
        loadDataBinnacles()
    }

}

const handleRadioChange = async () => {
    if (radioButtonList.value === 'instructor') {
        const response = await getData('/binnacles/listallbinnacles');
        console.log(response)
        optionSearch.value = response.map(option => ({
            _id: option.instructor.idinstructor,
            label: `${option.instructor.name}`,
        }));
        filterOptionsSearch.value = optionSearch.value;
    } else if (radioButtonList.value === 'apprentice') {
        const response = await getData('/binnacles/listallbinnacles');
        const uniqueApprentices = new Map();
response.forEach(option => {
    const apprentice = option.register.idApprentice[0];
    if (apprentice && !uniqueApprentices.has(apprentice._id)) {
        uniqueApprentices.set(apprentice._id, {
            _id: apprentice._id,
            label: `${apprentice.firstName} ${apprentice.lastName} - ${apprentice.numDocument}`,
            numDocument: apprentice.numDocument,
        });
    }
});
optionSearch.value = Array.from(uniqueApprentices.values());
filterOptionsSearch.value = optionSearch.value;

    }
    clearSearch();
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

async function fetchDataSearch() {
    handleRadioChange();
    // Asegúrate de que optionSearch tenga datos
    console.log('Datos iniciales de optionSearch:', optionSearch.value);
}

fetchDataSearch();

async function filterFunctionSearch(val, update) {
    console.log('Valor de búsqueda:', val);
    console.log('Datos de optionSearch antes de filtrar:', optionSearch.value);
    update(() => {
        const needle = val.toLowerCase();
        filterOptionsSearch.value = optionSearch.value.filter((option) =>
            option.label.toLowerCase().includes(needle)
        );
        console.log('Opciones filtradas:', filterOptionsSearch.value);
    });
}

async function searchButton() {
    // loadingSearch.value = true;
    validationSearch()

    if (radioButtonList.value === 'instructor') {
        await searchInstructor()
    } else if (radioButtonList.value === 'apprentice') {
        await searchApprentice()
    }
    clearSearch();
    // loadingSearch.value = false;
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