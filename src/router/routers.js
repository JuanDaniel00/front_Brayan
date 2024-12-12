import apprentices from '../views/Apprentices.vue'
import assignament from '../views/Assignament.vue'
import myAssignament from '../views/MyAssignament.vue'
import binnacles from '../views/Binnacles.vue'
import followup from '../views/Followup.vue'
import loguin from '../views/Loguin.vue'
import modality from '../views/Modality.vue'
import register from '../views/Register.vue'
import userEP from '../views/UserEP.vue'
import fiche from '../views/Fiche.vue'
import instructor from '../views/Instructor.vue'
import home from '../views/Home.vue'
import horas from '../views/Horas.vue'
import layouts from '../views/Layout.vue'
import certificaciones from '../views/Certificaciones.vue'
import consultant from '../views/Consultant.vue'
import binnacleInstructor from '../views/BinnacleInstructor.vue'
import followupInstructor from '../views/FollowupInstructor.vue'
import history from '../views/AcademicHistoryApprentice.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from "../stores/useAuth.js";

const auth = (to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.token;
  const rol = authStore.rol;
  const email = authStore.email;

  console.log('token', token);
  console.log('rol', rol);
  console.log('email', email);

    // Verificar si el email está definido antes de continuar
  if (!email) {
    console.error("El email no está definido en el store");
  
  }

  if ((rol === "ADMIN" || rol === "INSTRUCTOR") && !token) {
    return next({ path: '/' });
  }

  if (to.meta.roles && !to.meta.roles.includes(rol)) {
    return next({ path: '/' });
  }
  next();
};

const routes = [
  {
    path: '/layouts',
    component: layouts,
    children: [
      { path: '', redirect: '/layouts/home' },

      { path: 'home', component: home, beforeEnter: auth, meta: { roles: ['ADMIN', 'INSTRUCTOR'] } },
      { path: 'apprentices', component: apprentices, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'assignament', component: assignament, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'myAssignament', component: myAssignament, beforeEnter: auth, meta: { roles: ['INSTRUCTOR'] } },
      { path: 'fiche', component: fiche, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'horas', component: horas, beforeEnter: auth, meta: { roles: ['ADMIN', 'INSTRUCTOR'] } },
      { path: 'certificaciones', component: certificaciones, beforeEnter: auth, meta: { roles: ['ADMIN', 'INSTRUCTOR'] } },
      { path: 'binnacles', component: binnacles, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'followup', component: followup, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'instructor', component: instructor, beforeEnter: auth, meta: { roles: ['ADMIN', 'INSTRUCTOR'] } },
      { path: 'modality', component: modality, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'register', component: register, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'userEP', component: userEP, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
      { path: 'followupInstructor', component: followupInstructor, beforeEnter: auth, meta: { roles: ['INSTRUCTOR'] } },
      { path: 'binnaclespInstructor', component: binnacleInstructor, beforeEnter: auth, meta: { roles: ['INSTRUCTOR'] } }
    ]
  },
  { path: '/', component: loguin },
  { path: '/apprentices', component: loguin },
  { path: '/consultant', component: consultant},
  { path: '/history', component: history}
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})