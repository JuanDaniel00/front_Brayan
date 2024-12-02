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


            <template v-slot:body-cell-status="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    <span :style="{ color: props.row.status === 1 ? 'green' : 'red' }">
                        {{ props.row.status === 1 ? 'Activo' : 'Inactivo' }}
                    </span>
                </q-td>
            </template>

            <template v-slot:body-cell-options="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    <div class="opcion-btn">
                        <q-fab v-model="options[props.row._id]" class="small-fab" label-position="top" external-label
                            color="primary" icon="keyboard_arrow_right" direction="left" :hide-label="hideLabels">


                            <q-fab-action external-label label-position="top" 
                                class="estado-btn btn-same-size" @click="onclickStatus(props.row)"
                                :icon="props.row.status === 1 ? 'cancel' : 'check_circle'"
                                :color="props.row.status === 1 ? 'red' : 'green'" round size="md"
                                :aria-label="props.row.status === 1 ? 'Cancel' : 'Check Circle'"
                                :loading="loadingStates[props.row._id]">
                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                    <strong>Activar/Desactivar</strong>
                                </q-tooltip>
                            </q-fab-action>

                            <q-fab-action external-label label-position="top" color="primary"
                               class="edit-btn btn-same-size" @click="onClickEdit(props.row)" 
                                icon="edit_square" round size="md" aria-label="Edit Square">
                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                    <strong>Editar</strong>
                                </q-tooltip>
                            </q-fab-action>
                            

                            <q-fab-action external-label label-position="top" color="primary" @click="onClick"
                                icon="search">
                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                    <strong>Asignación</strong>
                                </q-tooltip>
                            </q-fab-action>

                            <q-fab-action external-label label-position="top" color="primary" @click="onClick"
                                icon="visibility">

                                <!-- <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                                    <strong>Detalles</strong>
                                </q-tooltip> -->
                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                    <strong>Dellates</strong>
                                </q-tooltip>
                            </q-fab-action>

                            <q-fab-action external-label label-position="top" color="primary" @click="onClick"
                                icon="visibility">
                                <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                    <strong>Registro de Horas</strong>
                                </q-tooltip>


                            </q-fab-action>

                        </q-fab>
                    </div>
                </q-td>
            </template>

            <template v-slot:body-cell-Num="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    {{ props.pageIndex + 1 }}
                </q-td>
            </template>


            <template v-slot:loading>
                <q-inner-loading :showing="loading" color="primary" />
            </template>

        </q-table>
    </div>
</template>

<script setup>
import { Loading } from "quasar";
import { ref } from "vue";
let loadingStates = ref({});
let options = ref({});

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
    onclickStatus: {
        type: Function,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    }

});


const onclickStatus = async (row) => {
    loadingStates.value[row._id] = true;
    try {
        await props.onclickStatus(row)
    } catch (error) {
        console.log(error)
    } finally {
        loadingStates.value[row._id] = false;

    }
};
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
.opcion-btn {
    display: flex;
    gap: 10px;
}

.example-fab-animate--hover {
    transition: transform 0.3s ease;
}

.example-fab-animate {
    transform: rotate(45deg);
}
</style>