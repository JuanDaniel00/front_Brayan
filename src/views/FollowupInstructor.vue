<template>
    <Header title="Seguimiento"></Header>
  
    <div id="container-buttons">
      <div class="searchButtons">
        <div class="allInputButtonsSearch">
          <radioButtonInstructor v-model="radioButtonList" label="Instructor" val="instructor"
            @update:model-value="handleRadioChange" />
          <radioButtonApprentice v-model="radioButtonList" label="Aprendiz" val="apprentice"
            @update:model-value="handleRadioChange" />
        </div>
        <div class="InputButtonsSearch">
          <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
            optionValue="_id" :useInput="!Search" :filter="filterFunctionSearch" class="custom-select" />
          <buttonSearch :onclickButton="searchButtons":loading=loadingSearch />
        </div>
      </div>
    </div>
  
    <tableSelect :rows="rows" :columns="columns" :onClickSeeObservation="openClickSeeObservation"
      :onClickCreateObservation="openClickCreateObservation" :loading="loading" />
  
    <dialogSeeObservation v-model="isDialogVisibleObservation" title="OBSERVACIONES" labelClose="Cerrar"
      labelSend="Guardad" :onclickClose="closeDialog" :onclickSend="saveChanges"
      :informationBinnacles="observationFollowup">
  
    </dialogSeeObservation>
  
    <dialogCreateObservation v-model="isDialogVisibleCreateObservation" title="AÑADIR ODSERVACIONES" labelClose="close"
      labelSend="guardar" :onclickClose="closeDialog" :onclickSend="handleSend"
      labelTextArea="Escriba esta observación para este Seguimiento" v-model:textValue="newObservation" :loading="loadingCreateOdservation">
    </dialogCreateObservation>
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
  
  
  // observación
  let observationFollowup = ref('');
  let newObservation = ref('')
  
  let route = useRoute();
  onBeforeMount(() => {
    loadDataFollowup();
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
    },{
      name: "detail",
      label: "DETALLES",
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
    const idInstructor = route.query.id
    console.log('idInstructor:', idInstructor);
    try {
      if (idInstructor) {
        const response = await getData(`/followup/listFollowupByRegister/${idInstructor}`);
        console.log(response);
        rows.value = response.followup
      } else {
        const response = await getData('/followup/listallfollowup');
        console.log(response)
        rows.value = response
      }
    } catch (error) {
      let messageError;
      if (error.response && error.response.data && error.response.data.message) {
        messageError = error.response.data.message;
      } else if(error.response && error.response.data && error.response.data.error){
        messageError = 'No hay seguimientos para mostrar';
      }else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
       messageError = error.response.data.errors[0].msg;
      } else {
        messageError = 'Error al cargar los seguimientos';
      }
      notifyErrorRequest(messageError);
    } finally {
      loading.value = false;
    }
  
  }
  
  
  async function openClickSeeObservation(row) {
    isDialogVisibleObservation.value = true;
    if (!row.observation || row.observation.length === 0) {
      observationFollowup.value = [' No hay observaciones para esta bitacora'];
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
    }finally{
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
  
  async function searchInstructor() {
    try {
      const response = await getData(`/followup/listfollowupbyinstructor/${searchValue.value}`)
      console.log('Instlist',response);
      rows.value = response
    } catch (error) {
      if (searchValue.value === '') {
        validationSearch()
      } else {
        let messageError;
        if(error.response && error.response.data && error.response.data.message){
          messageError = error.response.data.message;
        }else if( error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg){
          messageError = error.response.data.errors[0].msg;
        }else{
          messageError = 'No se encontró ningún aprendiz por el instructor seleccionado.';
        }
        notifyErrorRequest(messageError);
      }
    }
  }
  
  async function searchApprentice() {
    try {
      const response = await getData(`/followup/listFollowupByRegister/${searchValue.value}`)
      console.log('aprendiz',response);
      rows.value = response.followup
  
    } catch (error) {
      if (searchValue.value === '') {
        validationSearch()
      } else {
        let messageError;
        if(error.response.data && error.response.data.message){
          messageError = error.response.data.message;
        }else if( error.response && error.response.data.errors && error.response.data.errors[0].msg){
          messageError = error.response.data.errors[0].msg;
        }else{
          messageError = 'No se encontró ningún aprendiz con la información seleccionada.';
        }
        notifyErrorRequest(messageError);
      }
    }
  }
  
  const handleRadioChange = async () => {
    if (radioButtonList.value === 'instructor') {
      const response = await getData('/Repfora/instructors');
      console.log('apprentice',response)
      optionSearch.value = response.map(option => ({
        _id: option._id,
        label: `${option.name} - ${option.numdocument}`,
      }));
      filterOptionsSearch.value = optionSearch.value;
    } else if (radioButtonList.value === 'apprentice') {
      const response = await getData('/followup/listallfollowup');
      const uniqueApprentices = new Set();
      optionSearch.value = response.map(option => {
        const apprenticeId = option.register._id;
        if (!uniqueApprentices.has(apprenticeId)) {
          uniqueApprentices.add(apprenticeId);
          return {
            _id: option.register._id,
            label: `${option.register.idApprentice[0].firstName} ${option.register.idApprentice[0].lastName} - ${option.register.idApprentice[0].numDocument}`,
            numDocument: option.numDocument
          };
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
    if (searchValue.value === '') {
      notifyWarningRequest('El campo de búsqueda no puede estar vacío. Por favor, ingrese un dato para continuar.');
      return;
    }
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
    loadingSearch.value = true; 
    try{
    validationSearch()
    if (radioButtonList.value === 'instructor') {
      await searchInstructor()
    } else if (radioButtonList.value === 'apprentice') {
      await searchApprentice()
    }
    clearSearch();
  }finally{
    loadingSearch.value = false
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