<template>
  <div class="check-inputs">
    <label class="checkbox-container">
      <input type="checkbox" :checked="checkTechnicalInstructor"
        @change="$emit('update-check', id, 'checkTechnicalInstructor', $event.target.checked)" />
      <span class="checkmark"></span>
      Técnico
    </label>
    <label class="checkbox-container">
      <input
        type="checkbox"
        :checked="checkProjectInstructor"
        @change="$emit('update-check', id, 'checkProjectInstructor', $event.target.checked)"
      />
    </label>
    </div>


  </template>
  
  <script>
  export default {
    props: {
      checkTechnicalInstructor: {
        type: Boolean,
      },
      checkProjectInstructor: {
        type: Boolean,
      },
      id: {
        type: String,
      },
    },
  };
  </script>
  