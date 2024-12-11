<template>
    <Header title="Programas" />
    <div>
        <div id="AllInputButtonsSearch">
            <q-form ref="formSearch" @submit.prevent="searchButton" class="InputButtonsSearch">
                <inputSelect v-model="searchValue" label="Buscar" :options="filterOptionsSearch" optionLabel="label"
                    optionValue="_id" :useInput="!Search" :filter="filterFunctionFiche" class="custom-select" 
                    :rules="[(val) => !!val || 'El campo de búsqueda es obligatorio']" lazy-rules />
                <buttonSearch :onclickButton="searchButton" :loading="loadingSearch" />
            </q-form>
        </div>
    </div>

    <ficheTable :rows="rows" :columns="columns" :toggleSeeApprentice="seeApprentices" :loading="loading" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Header from '../components/header/header.vue';
import ficheTable from '../components/tables/tableOneOption.vue';
import { router } from '../router/routers';
import { getData } from '../services/ApiClient';
import { notifyErrorRequest } from '../composables/useNotify';
import inputSelect from '../components/input/inputSelect.vue';
import buttonSearch from '../components/buttons/buttonSearch.vue';



onBeforeMount(() => {
    loadDataFiches();
})
let loading = ref(false);
let formSearch = ref(null)
let loadingSearch = ref(false)
let searchValue = ref(null)
let filterOptionsSearch = ref([])
let optionFiche = ref([])

async function loadDataFiches() {
    loading.value = true; // Inicia el estado de carga
    try {
        const response = await getData('/repfora/fiches');
        rows.value = response;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    } finally {
        loading.value = false; // Finaliza el estado de carga
    }
}

const rows = ref([]);
const columns = ref([
    {
        name: 'Num',
        label: 'N°',
        field: 'Num',
        align: 'center',
        sortable: true,
    },
    {
        name: 'name',
        label: 'PROGRAMA',
        field: row => row.program.name,
        align: 'center',
        sortable: true,
    },
    {
        name: 'code',
        label: 'FICHA',
        field: row => row.program.code,
        align: 'center',
        sortable: true,
    },
    {
        name: 'status',
        label: 'ESTADO',
        field: 'status',
        align: 'center',
        sortable: true,
    },
    {
        name: 'seeApprentice',
        label: 'VER APRENDICES',
        field: 'actions',
        align: 'seeApprentice',
        sortable: true,
    }])


async function seeApprentices(row) {
    try {
        const response = await getData(`/apprendice/listapprenticebyfiche/${row._id}`);
        if (response) {
            router.push({
                path: '/layouts/apprentices',
                query: { ficheId: row._id }
            });
        }
    } catch (error) {
        notifyErrorRequest('No hay aprendices registrados en esta ficha.')
    }
}


const fetchDataFiche = async () => {
    const response = await getData('/repfora/fiches');
        rows.value = response;
        const uniqueFiches = new Set();
        optionFiche.value = response.map(fiche => {
            const idfiche = fiche.program._id;
            if (!uniqueFiches.has(idfiche)) {
                uniqueFiches.add(idfiche);
                return {
                    label: fiche.program.name + ' ' + fiche.program.code,
                    _id: fiche._id
                };
            }
        }).filter(Boolean);
        filterOptionsSearch.value = optionFiche.value;
}

fetchDataFiche()

const filterFunctionFiche = (val, update) => {
    update(() => {
        const needle = val.toLowerCase();
        const filtered = optionFiche.value.filter(v => v.label.toLowerCase().includes(needle));
        filterOptionsSearch.value = filtered;
    });
};


async function searchButton() {
    if(!(await formSearch.value.validate())) return;
    loadingSearch.value = true;
    try {
        const response = await getData(`/Repfora/fiches/${searchValue.value}`);
        console.log('respuesta', response);
        rows.value = [response] // Asigna la respuesta directamente a rows.value
    } catch (error) {
        let messageError;
        if (error.response && error.response.data && error.response.data.message) {
            messageError = error.response.data.message;
        } else if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].msg) {
            messageError = error.response.data.errors[0].msg;
        } else {
            messageError = 'Error. Por favor, intente más tarde.';
        }
        notifyErrorRequest(messageError);
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

.search-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 1%;
    margin-bottom: 1%;
    margin-right: 3%;
}

.q-input {
    width: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px;
}

.q-input input {
    padding: 10px;
}

.q-input input {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

.q-input .q-field__control--focused {
    border-color: #2f7d32;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.q-input .q-icon {
    color: #2f7d32;
}

#AllInputButtonsSearch {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 20px;
}

.InputButtonsSearch {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-items: center;
    margin-bottom: -20px;
}
</style>