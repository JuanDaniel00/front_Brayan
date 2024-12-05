<template>
    <div class="input-container">
        <q-input filled :id="id" :rules ="rules"
         :type="showPassword ? 'text' : type" v-model="internalValue" :placeholder="placeholder" :label="label"
            :class="['input-styled', { 'input-error': hasError }]">
            <template v-slot:prepend>
                <font-awesome-icon :icon="icon" />
            </template>
            <template v-slot:append>
                <q-icon v-if="type === 'password'" :name="showPassword ? 'visibility' : 'visibility_off'"
                    @click="togglePasswordVisibility" class="cursor-pointer" />
            </template>
        </q-input>
        <span v-if="hasError" class="input-error-message">
            {{ errorMessage}}
        </span>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const hasError = ref(false);
const showPassword = ref(false);
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    modelValue: {
        type: [String, Number],
        default: '',
    },
    placeholder: {
        type: String,
    },
    label: {
        type: String,
    },
    icon: {
        type: String,
    },
    type: {
        type: String,
        default: 'text',
    },
    errorMessage: {
        type: String,
        default: '',
    },
    rules: {
        type: Array,
        default: () => [],
    },
});

const internalValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.q-input {
    font-size: 14px;
    /* Reducir el tamaño de la fuente */
    padding: 6px 10px;
    /* Ajustar el padding interno */
    margin-bottom: 10px;
    /* Reducir el margen inferior */
}

.input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
}

.input-styled {
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: border-color 0.2s;
    padding: 0px;
    margin-bottom: 5px;
}

.input-styled:focus {
    color: primary;
}

.input-error {
    border-color: negative
}

.input-error-message {
    color: #f44336;
    font-size: 12px;
    margin-top: 4px;
}
</style>