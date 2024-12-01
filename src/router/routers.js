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
import informationFicheApprentice from '../views/InformationFicheApprentice.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import information from '../views/Information.vue'
import { useAuthStore } from "../stores/useAuth.js";

const auth = (to, from, next) => {
  const authStore = useAuthStore();
  const token = authStore.token;
  const rol = authStore.rol;

  console.log('token', token);
  console.log('rol', rol);  

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
        { path: 'certificaciones', component: certificaciones, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
        { path: 'binnacles', component: binnacles, beforeEnter: auth, meta: { roles: ['ADMIN', 'INSTRUCTOR'] } },
        { path: 'followup', component: followup, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
        { path: 'instructor', component: instructor, beforeEnter: auth, meta: { roles: ['ADMIN', 'INSTRUCTOR'] } },
        { path: 'modality', component: modality, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
        { path: 'register', component: register, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
        { path: 'userEP', component: userEP, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
        { path: 'informationFicheApprentice', component: informationFicheApprentice, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
        { path: 'information', component: information, beforeEnter: auth, meta: { roles: ['ADMIN', 'INSTRUCTOR'] } }
      ]
    },
    { path: '/', component: loguin },
    { path: '/apprentices', component: loguin },
    { path: '/consultant', component: consultant}
  ];

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})




