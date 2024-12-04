<template>
    <div class="q-pa-md">
        <q-table :rows="rows" :columns="columns" flat bordered class="q-table-custom" :loading="loading">
            <template v-slot:header="props">
                <q-tr :props="props" class="custom-header-row">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="custom-header-cell">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>

            <template v-slot:body-cell-Num="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    {{ props.pageIndex + 1 }}
                </q-td>
            </template>

            <template v-slot:body-cell-status="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    <span :style="{ color: props.row.status === 1 ? 'green' : 'red' }">
                        {{ props.row.status === 1 ? 'Activo' : 'Inactivo' }}
                    </span>
                </q-td>
            </template>


            <template v-slot:body-cell-options="props">
                <q-td :props="props" class="q-pa-xs ">
                    <div>
                        <q-fab v-model="options[props.row._id]" label-position="rigth" color="primary"
                            icon="keyboard_arrow_left" direction="left">
                            <q-fab-action external-label label-position="top" color="primary"
                                class="edit-btn btn-same-size" @click="onClickSearchFollow(props.row)" icon="search"
                                round size="md" aria-label="Edit Square" :loading="loadingFollowup[props.row._id]">
                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                    <strong>Seguimiento</strong>
                                </q-tooltip>
                            </q-fab-action>

                            <q-fab-action external-label label-position="top" color="primary"
                                class="edit-btn btn-same-size" @click="onClickSearchBinnacle(props.row)" icon="search"
                                round size="md" aria-label="Edit Square" :loading="loadingBinnacles[props.row._id]">
                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                    <strong>Bitacora</strong>
                                </q-tooltip>
                            </q-fab-action>
                        </q-fab>
                    </div>
                </q-td>
            </template>

            <template v-slot:body-cell-followup="props">
                <q-td :props="props" class="q-pa-xs ">
                    <q-btn @click="onClickSearchFollow(props.row)" icon="search" color="primary" round size="md"
                        aria-label="Edit Square" :loading="loadingFollowup[props.row._id]">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                            <strong>Seguimiento</strong>
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </template>


            <template v-slot:body-cell-binnacles="props">
                <q-td :props="props" class="q-pa-xs ">
                    <q-btn @click="onClickSearchBinnacle(props.row)" icon="search" color="primary" round size="md"
                        aria-label="Edit Square" :loading="loadingBinnacles[props.row._id]">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                            <strong>Seguimiento</strong>
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </template>

            <template v-slot:loading>
                <q-inner-loading :showing="loading" color="primary" />
            </template>

        </q-table>
    </div>
</template>

<script setup>
import { ref } from "vue";
let options = ref({});
let loadingFollowup = ref({});
let loadingBinnacles = ref({});
const props = defineProps({
    rows: {
        type: Array,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
    onClickEdit: {
        type: Function,
        required: true,
    },
    onClickAdd: {
        type: Function,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
    onClickSearchBinnacle: {
        type: Function,
        requiere: true
    },
    onClickSearchFollow: {
        type: Function,
        requiere: true
    },

});

const onClickSearchFollow = async (row) => {
    loadingFollowup.value[row._id] = true
    try {
        await props.onClickSearchFollow(row)
    } catch (error) {

    } finally {
        loadingFollowup.value[row._id] = false
    }
}

const onClickSearchBinnacle = async (row) => {
    loadingBinnacles.value[row._id] = true
    try {
        await props.onClickSearchBinnacle(row)
    } finally {
        loadingBinnacles.value[row._id] = false
    }
}

</script>

<style scoped>
.q-table-custom {
    scrollbar-width: thin;
    scrollbar-color: #2F7D32 #f1f1f1;
}

.custom-header-row {
    background-color: #449247;
}

.custom-header-cell {
    color: white;
    font-weight: bold;
    text-align: center;
    padding: 12px;
    font-size: 16px;
    font-weight: 700;
}

.edit-btn {
    background-color: #1c4b33 !important;
}

.optionsEditAdd-btn {
    display: flex;
    gap: 10px;
}
</style>