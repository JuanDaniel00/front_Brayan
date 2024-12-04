<template>
  <q-card class="my-card">
    <q-img :src="imageSrc" class="card-image"></q-img>
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
    </div>
    <q-card-section class="card-section">
      <q-btn id="Ver" color="primary" clickable :to="buttonLink" v-ripple class="buttons">
        {{ buttonText }}
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "USUARIOS",
  },
  buttonLink: {
    type: String,
    default: "/usuario",
  },
  buttonText: {
    type: String,
    default: "Ver",
  },
});
</script>

<style scoped>
/* Card Styles */
.my-card {
  display: flex;
  flex-direction: column;
  border: none;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 22px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 10px;
  width: 350px;
}

.my-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Header Styles */
.card-header {
  background-color: #f5f5f5;
  text-align: center;
  padding: 8px 0;
  font-weight: bold;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 5px 0;
}

/* Image Styles */
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 15px 15px 0 0;
}

/* Section Styles */
.card-section {
  background-color: #f5f5f5;
  text-align: center;
  padding: 10px 0;
  width: auto !important;
}

/* Button Styles */
.buttons {
  font-size: 14px;
    color: #ededed;
    width: 100%;
    border-radius: 15px;
    padding: 10px 0;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.buttons:hover {
  background-color: #3b9c35 !important;
}
</style>