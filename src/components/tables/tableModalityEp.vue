<template>
    <div class="q-pa-md">
        <q-table :rows="rows" :columns="columns" row-key="name" flat bordered class="q-table-custom"
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

            <template v-slot:body-cell-options="props">
                <q-td :props="props" class="q-pa-xs text-center">
                    <q-btn @click="onclickEdit(props.row)" icon="edit_square" color="primary" round size="md">
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
const props = defineProps({
    rows: {
        type: Array,
        required: true,
    },
    columns: {
        type: Array,
        required: true,
    },

    onclickEdit: {
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
    }
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

.opcion-btn {
    display: flex;
    gap: 10px;
}

</style>
