<template>
    <div class="q-pa-md">
        <q-table :rows="rows" :columns="columns" row-key="name" :filter="filter" flat bordered class="q-table-custom"
            :loading="loading">
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

            <template v-slot:body-cell-seeApprentice="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    <q-btn @click="toggleSeeApprentice(props.row)" icon="visibility" color="primary" round size="md" 
                        aria-label="Visibility" :loading="loadingButtonSee[props.row._id]" >
                    </q-btn>
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
import { ref, watch } from "vue";
let loadingButtonSee = ref({})
const props = defineProps({
    rows: {
        type: Array,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
    toggleSeeApprentice: {
        type: Function,
        required: true,
    },
    filter: {
        type: String,
        default: '',
    },
    loading: {
        type: Boolean,
        required: true,
    },

});

const toggleSeeApprentice = async (row) =>{
    loadingButtonSee.value[row._id] = true;
    try {
        await props.toggleSeeApprentice(row);       
    } finally {
        loadingButtonSee.value[row._id] = false;
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

</style>
