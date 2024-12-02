<template>
    <div v-if="visible" class="spinner-container">
        <q-spinner :size="size" :color="colorSpinner" :thickness="thickness" :duration="duration"
            :class="spinnerClass" />
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { Quasar } from 'quasar';

defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: '50px',
    },
    colorSpinner: {
        type: String,
        default: 'primary',
    },
    thickness: {
        type: Number,
        default: 5,
    },
    duration: {
        type: Number,
        default: 1500,
    },
    spinnerClass: {
        type: String,
        default: '',
    },
});
</script>

<style scoped>
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #ffffff;
}
</style>