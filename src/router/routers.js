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
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
      path: '/layouts',
      component: layouts,
      children: [
        { path: '', redirect: '/layouts/home' },
        { path: 'home', component: home },
        { path: 'apprentices', component: apprentices },
        { path: 'assignament', component: assignament },
        { path: 'myAssignament', component: myAssignament },
        { path: 'fiche', component: fiche },
        { path: 'horas', component: horas },
        { path: 'certificaciones', component: certificaciones },
        { path: 'binnacles', component: binnacles },
        { path: 'followup', component: followup },
        { path: 'instructor', component: instructor },
        { path: 'modality', component: modality },
        { path: 'register', component: register },
        { path: 'userEP', component: userEP }
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




