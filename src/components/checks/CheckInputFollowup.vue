<template>
    <q-checkbox v-model="checked" @update:model-value="onCheck" />
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const checked = ref(false);
  
  const emit = defineEmits(["checked-followup"]);
  
  function onCheck(value) {
    checked.value = value;
    emit("checked-followup", value); // Emite el estado del checkbox
  }
  </script>
  