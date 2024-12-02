<template>
  <q-btn id="button" color="green-8" @click="openModalButton" class="q-mb-md">
    <q-icon name="add_circle" />
    <span style="font-weight: bold !important; margin-left: 5px;">{{ nameButton }}</span>
  </q-btn>

  <q-dialog v-model="computedModelValue" transition-show="rotate" transition-hide="rotate" persistent>
    <q-card>
      <q-card-section class="title">
        <div class="titleStyle text-h6 text-center" >{{ title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <slot></slot>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="labelSend" icon="save_as" @click="onclickSend" color="white"  :loading="loading"
          style="background-color: #2F7D32; font-weight: bold;" />
        <q-btn flat :label="labelClose" icon="cancel" @click="onclickClose" color="red-8" v-close-popup style="font-weight: bold;" />
        
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<script setup>
import { ref,computed} from 'vue';

// let apprentice = ref({})

const props = defineProps({
  modelValue:{
    type: Boolean,
    required: true
  },
  nameButton: {
    type: String,
    required: true,
    default: 'Boton'
  },
  title: {
    type: String,
    required: true,
    default: 'Título'
  },
  labelClose: {
    type: String,
    required: true,
    default: 'Cerrar'
  },
  labelSend: {
    type: String,
    required: true,
    default: 'Enviar'
  },
  onclickClose: {
    type: Function,
    required: true
  },
  onclickSend: {
    type: Function,
    required: true
  },
  openModalButton: {
    type: Function,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);
const computedModelValue = computed({
  get() {
    return props.modelValue
  },
  set(value){
    emit('update:modelValue', value)
  }
})

</script>

<style scoped>
.title {
  background-color: #2f7d32;
  color: white;
  width: 100%  !important;
}
.titleStyle{
  font-weight: 900  !important;
   font-size: 28px  !important;
}

.q-card {
  width: 950px !important;
}

#button{
  /* margin-left: 2.4%; */
  margin-top: 1%;
  margin-bottom: 0px;
}

.q-card__section {
    padding: 10px 15px 5px 15px !important;
    text-align: center !important;
    width: 100% !important;
}

</style>