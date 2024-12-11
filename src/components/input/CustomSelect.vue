<template>
    <div class="selectContainer">
        <q-select filled clearable use-input input-debounce="100" behavior="menu"
            :rules="[val => !!val || errorMessage || 'Este campo es obligatorio']" v-model="internalValue"
            :label="label" :options="filteredOptions" :option-label="optionLabel" :option-value="optionValue"
            :class="['select-styled', { 'input-error': hasError }]" @filter="filterOptions">
            <template v-slot:prepend>
                <font-awesome-icon :icon="icon" />
            </template>


            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No hay resultados
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    label: {
        type: String,
    },
    icon: {
        type: String,
    },
    errorMessage: {
        type: String,
        default: '',
    },
    rules: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: [String, Number, Object],
        default: null,
    },
    options: {
        type: Array,
        required: true,
    },
    optionLabel: {
        type: String,
        default: 'label',
    },
    optionValue: {
        type: String,
        default: 'value',
    },
});

const internalValue = ref(props.modelValue);
const filteredOptions = ref(props.options);
const hasError = ref(false);

const emit = defineEmits(['update:modelValue']);

watch(internalValue, (newValue) => {
    emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
    internalValue.value = newValue;
});

const filterOptions = (val, update) => {
    if (!val) {
        update(() => {
            filteredOptions.value = props.options; // Si no hay valor, mostrar todas las opciones
        });
        return;
    }

    const needle = val.toLowerCase();

    update(() => {
        filteredOptions.value = props.options.filter(option =>
            option[props.optionLabel].toLowerCase().includes(needle) // Filtrar las opciones
        );
    });
};

const handleInputChange = (selectedValue) => {
    console.log("Selected Value (optionValue):", selectedValue); // Verificamos el valor seleccionado
    emit('update:modelValue', selectedValue); // Emitimos el valor al padre
};
</script>

<style scoped>
.select-styled {
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: border-color 0.2s;
    padding: 0px;
    margin-bottom: 20px;
}

.input-error {
    border-color: red;
}
</style>