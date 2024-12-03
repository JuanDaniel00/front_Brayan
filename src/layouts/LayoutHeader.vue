<template>
  <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-green-8'">
    <q-toolbar>
      <q-btn
        v-if="!isConsultant"
        flat
        dense
        round
        icon="menu"
        @click="toggleDrawer"
      />
      <q-toolbar-title style="font-weight: bold;">ETAPAS PRÁCTICAS</q-toolbar-title>
      <q-btn @click="logout">
        <q-icon name="logout" style="font-size: 25px;"></q-icon>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'; 
import { ref, watch } from 'vue';

const props = defineProps(['toggleDrawer']);
const route = useRoute(); 
const router = useRouter();

const isConsultant = ref(route.path === '/consultant');

watch(() => route.path, (newPath) => {
  isConsultant.value = newPath === '/consultant';
});

const logout = () => {
  router.push({ path: '/' }); 
};
</script>
