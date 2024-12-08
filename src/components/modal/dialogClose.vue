<template>
  <q-dialog :model-value="modelValue" transition-show="rotate" persistent>
    <q-card>
      <q-card-section class="title">
        <div class="text-h6 text-center">{{ title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div style="width: 100%; max-width: 400px">
          <q-chat-message
            v-for="(message, index) in messages"
            :key="index"
            :name="message.name"
            :avatar="message.avatar"
            :text="message.text"
            :stamp="message.stamp"
            :sent="message.sent"
            :bg-color="message.bgColor"
            :text-color="message.textColor"
            :size="message.size"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat class="custom-btn" @click="closeDialog" :label="labelClose" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  messages: {
    type: Array,
    required: true,
    default: () => [],
  },
  title: {
    type: String,
    required: false,
    default: "Observaciones",
  },
  labelClose: {
    type: String,
    required: false,
    default: "Cerrar",
  },
});

const emit = defineEmits(["update:modelValue"]);

function closeDialog() {
  emit("update:modelValue", false);
}
</script>


<style>

ddf{
  color: rgb(34, 189, 101);
}
.title {
  background-color: #2f7d32;
  color: white;
}

.custom-btn {
  background-color: #ffffff !important;
  font-weight: bold !important;
  color: rgb(45, 42, 42) !important;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.q-card__actions {
  background-color: rgb(193, 189, 189);
}

.q-message-name {
  font-weight: bold;
}
</style>