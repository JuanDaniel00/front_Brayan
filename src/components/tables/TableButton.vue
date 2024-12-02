<template>
    <div class=" q-pa-md ">
        <q-table :rows="rows" :columns="columns" flat bordered class="q-table-custom" style="width: 100%"
            :loading="loading">

            <!-- Slot para la fila de encabezado -->
            <template v-slot:header="props">
                <q-tr :props="props" class="custom-header-row">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="custom-header-cell">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>

            

            <!-- Slot para la columna 'opciones' con botón de acciones tipo FAB -->
            <template v-slot:body-cell-opciones="props">
                <q-td :props="props">
                    <q-fab v-model="fabStates[props.row._id]" color="#2E7D32" icon="keyboard_arrow_left"
                        direction="left" class="fab-button">
                        <!-- Acción de editar -->
                        <q-fab-action class="fab-action-green" @click="onClickEdit(props.row)" icon="edit"
                            label="Editar" />

                        <!-- Acción de activar -->
                        <q-fab-action class="fab-action-light-green" @click="activate(props.row._id)"
                            v-if="props.row.status === 0" icon="check" label="Activar" />

                        <!-- Acción de desactivar -->
                        <q-fab-action class="fab-action-red" @click="deactivate(props.row._id)" v-else icon="close"
                            label="Desactivar" />

                        <!-- Acción de detalles -->
                        <q-fab-action class="fab-action-green" @click="showDetails(props.row)" icon="visibility"
                            label="Detalles" />

                        <!-- Acción de registro de horas -->
                        <q-fab-action class="fab-action-green" @click="logHours(props.row)" icon="access_time"
                            label="Registro de Horas" />
                    </q-fab>
                </q-td>
            </template>

            <!-- Slot para la columna 'estado' -->
            <template v-slot:body-cell-status="props">
                <q-td :props="props">
                    <p :style="{ color: props.row.status === 1 ? 'green' : 'red' }">
                        {{ props.row.status === 1 ? 'Activo' : 'Inactivo' }}
                    </p>
                </q-td>
            </template>

            <!-- Slot para la columna 'nombre de aprendiz' -->
            <template v-slot:body-cell-name="props">
                <q-td :props="props">
                    {{ props.row.apprenticeName }}
                    <q-icon v-if="props.row.idApprentice.length > 1" @click="showDetails(props.row)" name="group"
                        color="white"
                        style="background-color: green; border-radius: 50%; padding: 3px; margin-left: 4px; cursor: pointer;" />
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

// Estados individuales para cada FAB basado en su ID
const fabStates = reactive({});

const props = defineProps({
    rows: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: true
    },
    onClickEdit: {
        type: Function,
        required: true
    },
    activate: {
        type: Function,
        required: true
    },
    deactivate: {
        type: Function,
        required: true
    },
    showDetails: {
        type: Function,
        required: true
    },
    logHours: {
        type: Function,
        required: true
    }
});
</script>

<style scoped>
.q-table-custom {
    border: 1px solid #000000;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

.q-pa-md {
    width: 96%;
    margin-left: 2%;
}


.fab-button {
    display: flex;
    justify-content: center;
    background-color: #2E7D32 !important;
    color: #fff !important;
}

.fab-action-green {
    background-color: #2E7D32 !important;
    color: #fff !important;
}

.fab-action-light-green {
    background-color: #4CAF50 !important;
    color: #fff !important;
}

.fab-action-red {
    background-color: #F44336 !important;
    color: #fff !important;
}
</style>