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
                    <q-select v-model="props.row.status"
                        @update:model-value="value => onclickSelectOptions(props.row, value)" :options="options"
                        class="status-select" label="Seleccione Estado" dense outlined emit-value map-options>
                    </q-select>
                </q-td>
            </template>

            <template v-slot:body-cell-observation="props">
                <q-td :props="props" class="q-pa-xs ">
                    <div class="observation-btn">
                        <q-btn @click="onClickSeeObservation(props.row)" color="primary" icon="search" round size="md"
                            aria-label="Buscar" />

                        <q-btn class="edit-btn" @click="onClickCreateObservation(props.row)" color="primary"
                            icon="add_circle" round size="md" aria-label="add_circle" />
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
import { ref } from "vue";

// const OptionsStatus = [
//   { label: 'Pendiente', value: '3' },
//   { label: 'Verificado', value: '4' }
// ];

const props = defineProps({
    rows: {
        type: Array,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },
    onClickCreateObservation: {
        type: Function,
        required: true,
    },
    onClickSeeObservation: {
        type: Function,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    onclickSelectOptions: {
        type: Function,
        required: true,
    },
    loading: {
    type: Boolean,
    required: true,
  },
    onClickLinkDetail: {
        type: Function,
        required: true,
    },
});

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

.q-pa-xs {
    /* display: flex; */
    gap: 10px;
}

.observation-btn {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
}
</style>