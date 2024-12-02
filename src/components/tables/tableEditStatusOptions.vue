<template>
  <div class="q-pa-md">
    <q-table :rows="rows" :columns="columns" flat bordered class="q-table-custom" :filter="filter" :loading="loading">
      <template v-slot:header="props">
        <q-tr :props="props" class="custom-header-row">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="custom-header-cell">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-solt:body-cell-optionStatus="props">
        <q-td :props="props" class="q-pa-xs text-center">
          <q-select v-model="props.rows.status" options="optionStatus" class="" dense emit-value map-options>
          </q-select>
        </q-td>
      </template>


      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="q-pa-xs text-center">
          <span :style="{ color: props.row.status === 1 ? 'green' : 'red' }">
            {{ props.row.status === 1 ? 'Activo' : 'Inactivo' }}
          </span>

        </q-td>
      </template>

      <template v-slot:body-cell-opcion="props">
        <q-td :props="props" class="opcion-btn">
          <q-btn class="edit-btn" @click="onClickEdit(props.row)" color="primary" icon="edit_square" round size="md"
            aria-label="Edit Square" />
          <q-btn class="estado-btn btn-same-size" @click="onclickStatus(props.row)"
            :icon="props.row.status === 1 ? 'cancel' : 'check_circle'" :color="props.row.status === 1 ? 'red' : 'green'"
            round size="md" :aria-label="props.row.status === 1 ? 'Cancel' : 'Check Circle'"
            :loading="loadingStates[props.row._id]">
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
import { ref } from "vue";
let loadingStates = ref({});

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
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

</style>
