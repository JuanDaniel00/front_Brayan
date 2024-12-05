<template>
    <Header title="Programas"></Header>

    <div class="search-container">
        <q-input borderless dense debounce="300" v-model="localFilter" @update:model-value="updateFilter"
            label="Buscar por Número O Nombre de ficha">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
        </q-input>
    </div>

    <ficheTable :rows="filteredRows" :columns="columns" v-model:filter="filter" :toggleSeeApprentice="seeApprentices"
        :loading="loading" />
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import Header from '../components/header/header.vue';
import ficheTable from '../components/tables/tableFiche.vue';
import { router } from '../router/routers';
import { getData } from '../services/ApiClient';
import { notifyErrorRequest } from '../composables/useNotify';



onBeforeMount(() => {
    loadDataFiches();
})
let loading = ref(false); 
let filter = ref('');

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

const filteredRows = computed(() => {
    if (!filter.value) {
        return rows.value;
    }
    const searchTerm = filter.value.toLowerCase();
    return rows.value.filter(row =>
        row.program.name.toLowerCase().includes(searchTerm) ||
        row.program.code.toLowerCase().includes(searchTerm)
    );
});
function updateFilter(value) {
    filter.value = value;
}


</script>

<style scoped>
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
</style>