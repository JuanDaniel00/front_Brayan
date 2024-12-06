<template>
  <div class="check-inputs">
    <label class="checkbox-container">
      <input
        type="checkbox"
        :checked="checkTechnicalInstructor"
        @change="$emit('update-check', id, 'checkTechnicalInstructor', $event.target.checked)"
      />
      <span class="checkmark"></span>
      Técnico
    </label>
    <label class="checkbox-container">
      <input
        type="checkbox"
        :checked="checkProjectInstructor"
        @change="$emit('update-check', id, 'checkProjectInstructor', $event.target.checked)"
      />
      <span class="checkmark"></span>
      Proyecto
    </label>
  </div>
</template>

<script>
export default {
  props: {
    checkTechnicalInstructor: {
      type: Boolean,
      required: true,
    },
    checkProjectInstructor: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.check-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  color: #333;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border: 2px solid #ccc;
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4caf50;
  border-color: #4caf50;
}

.checkbox-container input:checked ~ .checkmark::after {
  display: block;
}

.checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>