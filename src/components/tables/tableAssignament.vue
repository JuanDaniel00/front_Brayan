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

            <template v-slot:body-cell-binnacle="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    <q-btn @click="toggleBinnacle(props.row)" icon="search" color="primary" round size="md"></q-btn>
                </q-td>
            </template>


            <template v-slot:body-cell-follow="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    <q-btn @click="toggleFollow(props.row)" icon="search" color="primary" round size="md"></q-btn>
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
import { ref } from 'vue';

const props = defineProps({
    rows: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: true
    },
    toggleBinnacle: {
        type: Function,
        required: true
    },
    toggleFollow: {
        type: Function,
        required: true
    },
    loading: {
        type: Boolean,
        required: true,
    }
})
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
</style>
