<template>
  <q-dialog v-model="computedModelValue" transition-show="rotate" transition-hide="rotate" persistent>
    <q-card>
      <q-card-section class="title">
        <div class="text-h6 text-center">{{ title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <slot>
          <div class="Observations">
            <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px" v-for="(observation, index) in informationBinnacles" :key="index" class="observation-item">
      <q-chat-message
        :name= "[observation.user]"
        avatar="https://cdn.quasar.dev/img/avatar1.jpg"
        :text="[observation.text]"
        :stamp=[observation.date]
        sent
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar2.jpg"
        :text="['doing fine, how r you?']"
      />
      <p class="observation-user"> usuario{{ observation.user }}</p>
              <p>{{ observation.text }}</p>
            <div class="observation-date" >
              <p>{{ observation.date }}</p>
            </div>
          </div>
    </div>
  </div>
            <!-- <div v-for="(observation, index) in informationBinnacles" :key="index" class="observation-item"> -->
            
          <!-- </div> -->
        </slot>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn class="close custom-btn" flat icon="cancel" color="grey-8" :label="labelClose" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
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
  informationBinnacles: {
    type: String,
    required: true,
    default: () => [{
      user: 'usuario1',
      text: 'No hay observaciones',
      date: 'fecha'
    }]
  },

});

const emit = defineEmits(['update:modelValue']);

const computedModelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
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

.observation-item {
  display: grid;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.observation-item p {
  margin: 0;
  padding: 0;
}
.observation-date {
  display: flex;
  justify-content: flex-end
}
.observation-user {
  display: flex;
  justify-content: flex-start;
  font-weight: bold;
  color: #2f7d32;
  /* font-size: 1.2em; */
  margin: 0;
  padding: 0;
}
</style>