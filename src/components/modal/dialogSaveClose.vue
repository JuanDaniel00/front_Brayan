<template>
  <q-dialog v-model="computedModelValue" transition-show="rotate" transition-hide="rotate" persistent>
    <q-card>
      <q-card-section class="title">
        <div class="text-h6 text-center">{{ title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <slot>
          <div class="q-pa-md" style="max-width: 500px">
            <q-input v-model="computedTextValue" filled type="textarea" :label="labelTextArea" />
          </div>
        </slot>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="labelSend" icon="save_as" @click="onclickSend" color="white"
          style="background-color: #2F7D32; font-weight: bold;"  :loading="loading" />
        <q-btn flat :label="labelClose" icon="cancel" @click="onclickClose" color="red-8" v-close-popup style="font-weight: bold;" />
        
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { Loading } from 'quasar';
import { computed } from 'vue';
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
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
  labelTextArea:{
    type: String,
    required: true,
    default: 'Escriba..........'
  },
  labelSend: {
    type: String,
    required: true,
    default: 'Enviar'
  },
  textValue: {
    type: String,
    required: true
  },
  onclickSend: {
    type: Function,
    required: true
  },
  onclickClose: {
    type: Function,
    required: true
  },
  loading:{
    type: Boolean,
    required: true
  }

});


const emit = defineEmits(['update:modelValue', 'update:textValue']);

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const computedTextValue = computed({
  get() {
    return props.textValue;
  },
  set(value) {
    emit('update:textValue', value);
  }
});
</script>

<style>
.title {
  background-color: #2f7d32;
  color: white;
}

.q-card {
  width: 400px;
}

.custom-btn {
  background-color: #2f7d32;
  font-weight: bold;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>