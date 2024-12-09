<template>
  <div id="en">
    <button id="atras" @click="Salir()">
      <span class="material-symbols-outlined"><q-icon name="arrow_back"></q-icon></span>
    </button>
    <h1 id="programas">{{title}}</h1>
  </div>
  <hr>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuth';

const router = useRouter();
const authStore = useAuthStore();
const userRole = authStore.rol
console.log(userRole)

const props = defineProps({
  title:{
    type:String,
    required:true,
    default:'Title'
  },
  Salir:{
    type:Function,
    required:true
  } 
})


const Salir = async () => {
  if(userRole !== 'CONSULTOR'){
    router.replace("/layouts/home")
  }else{
    router.replace("/consultant")
 
  }
}


</script>

<style>
#en {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0px;
  padding-top: 0px;
}

#programas {
  font-size: 37px;
  font-weight: 700;
  text-align: center;
  flex-grow: 1;
  padding-top: 20px;
  margin-bottom: 0px;
}

#atras {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: #2F7D32;
  color: white;
  margin-left: 3%;
  margin-top: 20px;
  cursor: pointer;
  position: absolute;
}

#atras:focus {
  outline: none;
}

hr {
  width: 95%;
  border: 2px solid #2F7D32;
  margin: 0 auto;
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>