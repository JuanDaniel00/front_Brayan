<template>
    <headers title="Historial Programas Academicos Cursados" />
    <customTable :rows="rows" :columns="columns" :toggleHistoryApprentice="HistoryApprentice" :loading="loading" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import headers from '../components/header/header.vue';
import customTable from "../components/tables/tableOneOption.vue";
import { useRoute } from 'vue-router';
import { getData } from '../services/ApiClient';
import { router } from '../router/routers';

const route = useRoute();
let loading = ref(false)
const rows = ref([])
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
        label: 'NOMBRE APRENDIZ',
        field: rows => rows.firstName + ' ' + rows.lastName,
        align: 'center',
        sortable: true,
    },
    {
        name: 'nameProgram',
        label: 'PROGRAMA',
        field: row => row.fiche ? row.fiche.name : 'Indefinido',
        align: 'center',
        sortable: true,
    },
    {
        name: 'numberFiche',
        label: 'FICHA',
        field: row => row.fiche ? row.fiche.number : 'Indefinido',
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
    }
])

onBeforeMount(() => {
    loadDataHistoryApprentice();
});

async function loadDataHistoryApprentice() {
    loading.value = true;
    try {
      let numDocument = route.query.numDocument;
        console.log('NumDocument', numDocument);
        const response = await getData(`/apprendice/listHistoryApprentice/${numDocument}`);
        console.log('historyApprentice', response);
        rows.value = response.data.apprentices;
    } catch (error) {
        console.error('Error al cargar el historial académico:', error);
    }finally{
        loading.value = false
    }
}
function HistoryApprentice(row) {
    router.push({
        path: '/consultant',
        query: { numDocument: row.numDocument }
    })
}
</script>