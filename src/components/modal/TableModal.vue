<template>
    <q-dialog :model-value="dialog" persistent full-width  transition-show="slide-up" transition-hide="slide-down"
        @update:model-value="(val) => $emit('update:dialog', val)">
        <q-card>
            <q-bar>
                <q-space />
                <q-btn dense flat icon="close" @click="closeDialog" text-color="white">
                    <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
                </q-btn>
            </q-bar>
            <slot></slot>
            <q-card-section class="q-pt-none ">
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    dialog: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["update:dialog"]);

function closeDialog() {
    emit("update:dialog", false);
}
</script>

<style lang="scss" scoped>
.q-bar {
    background-color: $primary;
}
</style>