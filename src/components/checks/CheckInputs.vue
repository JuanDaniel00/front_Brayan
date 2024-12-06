<!-- components/checks/CheckInputs.vue -->
<template>
    <div>
      <input
        type="checkbox"
        :checked="checkTechnicalInstructor"
        @change="$emit('update-check', id, 'checkTechnicalInstructor', $event.target.checked)"
      />
      <input
        type="checkbox"
        :checked="checkProjectInstructor"
        @change="$emit('update-check', id, 'checkProjectInstructor', $event.target.checked)"
      />
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
  