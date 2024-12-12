<template>
    <q-btn round @click="onclickButton" color="primary" icon="search" :loading="loading" />
</template>

<script setup>
const props = defineProps({
    onclickButton: {
        type: Function,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>

</style>