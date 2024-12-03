import { createApp } from 'vue'
import { Quasar, Dialog, Notify, Dark } from 'quasar'
import {createPinia} from 'pinia'
import { router } from './router/routers'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import  axios from 'axios'

// Font awesome (para iconos)
import { library } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import '@fortawesome/fontawesome-free/css/all.css';



// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import { faPenToSquare, faBan, faCheck, faFileInvoice, faSpellCheck, 
  faAddressCard, faPhone, faEnvelope, faUsersLine, faLock, 
  faHashtag, faUserGraduate, faCalendarDays, faFloppyDisk, faCircleXmark,
  faHouse, faPeopleArrows, faSquarePollHorizontal, faReceipt, faMagnifyingGlassChart,
  faShapes, faFile, faChalkboardUser,faPersonChalkboard, faStreetView, faImage,
  faListOl, faEnvelopeOpenText, faBuilding, faMapLocationDot, faUserTie, faStopwatch,
  faClock, faCircleCheck, faCirclePlus, faEye, faRightToBracket, faHourglassHalf,
  faMagnifyingGlass, faFileArrowUp, faCircleRight, faRectangleList, faArrowLeft,
  faBars, faAward
} from '@fortawesome/free-solid-svg-icons';

// Añadir el ícono a la librería de Font Awesome
library.add(faPenToSquare, faBan, faCheck, faFileInvoice, faSpellCheck, 
  faAddressCard, faPhone, faEnvelope, faUsersLine, faLock, faHashtag, 
  faUserGraduate, faCalendarDays,faFloppyDisk, faCircleXmark, faHouse,
  faPeopleArrows, faSquarePollHorizontal, faReceipt, faMagnifyingGlassChart,
faShapes, faFile, faChalkboardUser, faPersonChalkboard, faStreetView, faImage,
faListOl, faEnvelopeOpenText, faBuilding, faMapLocationDot, faUserTie, faStopwatch,
faClock, faCircleCheck, faCirclePlus, faEye, faRightToBracket, faHourglassHalf,
faMagnifyingGlass, faFileArrowUp,faCircleRight, faRectangleList, faArrowLeft, faBars,
faAward

);

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'



const myApp = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

myApp.use(Quasar, {
  plugins: { Dialog, Notify, Dark} 
})


myApp.use(pinia)
myApp.use(router)
myApp.component('font-awesome-icon', FontAwesomeIcon);
myApp.mount('#app')