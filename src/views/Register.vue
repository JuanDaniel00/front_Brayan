<template>
  <q-layout view="lHh Lpr lff" class="layout">
    <q-page-container>
      <Header title="Registro"></Header>

      <div class="table-container">
        <CustomButton label="CREAR" :onClickFunction="openDialog" icon="add_circle">
        </CustomButton>

        <Table :rows="rows" :columns="columns" :onClickEdit="editRegister" :deactivate="toggleStatus"
          :activate="toggleStatus" :showDetails="showDetails" :loading="loading"></Table>
      </div>

      <TableModal v-model="TableModalDialog" :row="selectedRow">
        <template v-slot>
          <div class="table-container">
            <h5>{{ title2 }}</h5>
            <hr id="hr" color="primary" />
            <Table :rows="rows2" :columns="columns2" :onClickView="openDialogWithRow"></Table>
          </div>
        </template>
      </TableModal>

      <FormModal :modelValue="dialog" :title="modalityDialogTitle" @update:modelValue="dialog = $event"
        :next="nextFormModal">
        <template #content>
          <div class="input-grid">
            <q-form ref="formRef" @submit.prevent="nextFormModal">
              <CustomSelect map-options label="Seleccionar modalidad" v-model="modalityId" required
                :options="modalitiesOptions" optionLabel="name" optionValue="_id" errorMessage="Modalidad requerida"
                icon="shapes" type="text">
              </CustomSelect>
            </q-form>
          </div>
        </template>
      </FormModal>


      <FormModal :modelValue="secondModaldialog" :title="dialogTitle" :onSave="saveRegister"
        @update:modelValue="secondModaldialog = $event">
        <template #content>
          <q-form ref="formRef" @submit="saveRegister" class="formModality">
            <div class="input-grid">
              <CustomSelect map-options label="Aprendiz" v-model="idApprentice" :options="apprenticeOptions"
                optionLabel="apprenticeName" optionValue="apprenticeId" errorMessage="Aprendiz requerido"
                icon="users-line" type="text">
              </CustomSelect>

              <CustomSelect filled label="Instructor de Seguimiento" v-model="followUpInstructorUnico" required
                :options="instructorsOptions" optionLabel="instructorLabel" optionValue="instructorId"
                errorMessage="Instructor de seguimiento requerido" icon="chalkboard-user" type="text" />

              <Input id="startDate" filled label="Fecha de Inicio" v-model="startDate" required
                errorMessage="Fecha requerida" icon="calendar-days" type="date" :rules="[
                  (val) => validateRequired(val, 'La fecha de inicio es requerido'),
                  (val) => validateNoSpaces(val)
                ]" />
              <Input id="endDate" filled label="Fecha de Fin" v-model="endDate" required errorMessage="Fecha requerida"
                icon="calendar-days" type="date" :rules="[
                  (val) => validateRequired(val, 'La fecha de fin es requerido'),
                  (val) => validateNoSpaces(val)
                ]" />
              <Input id="company" filled label="Nombre de la Empresa" v-model="company" required
                errorMessage="Empresa requerida" icon="spell-check" type="text" :rules="[
                  (val) => validateRequired(val, 'El nombre de la empresa es requerido '),
                  (val) => validateNoSpaces(val),
                  (val) => validateNoLeadingTrailingSpaces(val)
                ]" />
              <Input id="phoneCompany" filled label="Teléfono de la empresa" v-model="phoneCompany" required
                errorMessage="Número de contacto requerido" icon="phone" type="text" :rules="[
                  (val) => validateRequired(val, 'El teléfono de la empresa es requerido'),
                  (val) => validateNoAnySpaces(val),
                  (val) => validateNoSpaces(val),
                  (val) => validateNoLetters(val)
                ]" />
              <Input id="addressCompany" filled label="Dirección de la empresa" v-model="addressCompany" required
                errorMessage="Dirección requerida" icon="map-location-dot" type="text" :rules="[
                  (val) => validateRequired(val, 'La dirección de la empresa es requerido'),
                  (val) => validateNoSpaces(val),
                ]" />
              <Input id="owner" filled label="Dueño de la Empresa" v-model="owner" required
                errorMessage="Dueño requerido" icon="user-tie" type="text" :rules="[
                  (val) => validateRequired(val, 'El dueño de la empresa es requerido'),
                  (val) => validateNoSpaces(val),
                  (val) => validateNoNumbers(val),
                  (val) => validateMaxLengthTen(val)
                ]" />
              <Input id="docAlternative" filled label="Documento Alternativo" v-model="docAlternative" required
                errorMessage="Documento requerido" icon="file-invoice" type="text" :rules="[
                  (val) => validateRequired(val, 'El documento alternativo es requerido'),
                  (val) => validateNoSpaces(val),
                  (val) => validateGoogleDriveLink(val)
                ]" />
              <Input id="hour" filled label="Horas" v-model="hour" required errorMessage="Horas requeridas" icon="clock"
                type="text" :rules="[
                  (val) => validateRequired(val, 'Las horas son requeridas'),
                  (val) => validateNoAnySpaces(val),
                  (val) => validateNoSpaces(val),
                  (val) => validateNoLetters(val)
                ]" />
              <Input id="businessProyectHour" filled label="Horas del Proyecto de Negocio" v-model="businessProyectHour"
                required errorMessage="Horas requeridas" icon="stopwatch" type="text" :rules="[
                  (val) => validateRequired(val, 'Las horas del proyecto de negocio son requeridas'),
                  (val) => validateNoSpaces(val),
                  (val) => validateNoAnySpaces(val),
                  (val) => validateNoLetters(val)
                ]" />
              <Input id="productiveProjectHour" filled label="Horas del Proyecto Productivo"
                v-model="productiveProjectHour" required errorMessage="Horas requeridas" icon="stopwatch" type="text"
                :rules="[
                  (val) => validateRequired(val, 'Las horas del proyecto productivo son requeridas'),
                  (val) => validateNoAnySpaces(val),
                  (val) => validateNoSpaces(val),
                  (val) => validateNoLetters(val)

                ]" />
              <Input id="mailCompany" filled label="Email de la empresa" v-model="mailCompany" required
                errorMessage="Email de la empresa requerido" icon="envelope" type="text" :rules="[
                  (val) => validateRequired(val, 'El email de la empresa es requerido'),
                  (val) => validateEmail(val),
                  (val) => validateNoSpaces(val)
                ]" />
            </div>
          </q-form>
        </template>
      </FormModal>
    </q-page-container>
    <q-dialog v-model="dialogFull" persistent :maximized="maximizedToggle" transition-show="slide-up"
      transition-hide="slide-down" @hide="clearForm">
      <q-card class="text-dark">
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn dense flat icon="close" @click="confirmClose">
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="modalBody">
          <!-- Formulario de datos planos -->
          <div class="titulo">
            <div>
              <div style="
                  margin: 50px;
                  border-bottom: 4px solid green;
                  font-size: 4em;
                ">
                {{ tituloRegistro }}
              </div>
            </div>
          </div>
          <q-form ref="formRef" @submit="saveRegister" class="formModality">
            <div class="formulario" filled>
              <div class="contFormFila">
                <h5>Datos</h5>
                <div class="contInput">
                  <q-input v-model="ownerModal" label="Jefe inmediato" label-color="primary" label-class="customLabel"
                    class="long" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                      (val) => /^[^\s].*[^\s]$/.test(val) || 'No puede empezar ni terminar con espacios.',
                      (val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val) || 'No puede incluir numeros'
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="person" />
                    </template>
                  </q-input>
                  <q-input v-model="docAlternativeModal" label="Documentos alternativos" label-color="primary"
                    label-class="customLabel" class="long" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                      (val) => /^https:\/\/(?:drive|docs)\.google\.com\/(?:file\/d\/|document\/d\/|spreadsheets\/d\/|presentation\/d\/|forms\/d\/|drive\/folders\/|open\?id=)[a-zA-Z0-9_-]+(?:\/.*)?(?:\?.*)?$/.test(val) || 'Enlace de Google Drive no válido'
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="description" />
                    </template>
                  </q-input>
                  <q-input v-model="hourProductiveStageApprenticeModal" label="Horas etapa productiva"
                    label-color="primary" label-class="customLabel" class="short" type="number" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) => val >= 0 || 'No puede ser un valor negativo'
                    ]" :readonly="isReadOnly" min="0" step="1">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="schedule" />
                    </template>
                  </q-input>
                  <q-input v-model="startDateModal" label="Fecha de inicio" type="date" label-class="customLabel"
                    label-color="primary" class="short" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="event" />
                    </template>
                  </q-input>
                  <q-input v-model="endDateModal" label="Fecha final" type="date" label-class="customLabel"
                    label-color="primary" class="short" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="event" />
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="contFormFila">
                <h5>Datos empresa</h5>
                <div class="contInput">
                  <q-input v-model="companyModal" label="Nombre Empresa" label-color="primary" label-class="customLabel"
                    class="long" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                      (val) => /^[^\s].*[^\s]$/.test(val) || 'No puede empezar ni terminar con espacios.',
                      (val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val) || 'No puede incluir numeros'
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="business" />
                    </template>
                  </q-input>
                  <q-input v-model="mailCompanyModal" label="Correo Empresa" label-color="primary"
                    label-class="customLabel" class="long" type="email" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) => /.+@.+\..+/.test(val) || 'Correo inválido',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="email" />
                    </template>
                  </q-input>
                  <q-input v-model="addressCompanyModal" label="Dirección Empresa" label-color="primary"
                    label-class="customLabel" class="long" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                      (val) => /^[a-zA-Z0-9\s.,-]+$/.test(val) || 'La dirección contiene caracteres no válidos.',
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="location_on" />
                    </template>
                  </q-input>
                  <q-input v-model="phoneCompanyModal" label="Número Empresa" label-color="primary"
                    label-class="customLabel" type="tel" :rules="[
                      (val) => !!val || 'Campo requerido',
                      (val) => /^\d+$/.test(val) || 'Solo números',
                      (val) =>
                        val.trim().length > 0 || 'No se permiten espacios vacíos',
                      (val) => val.length <= 10 || 'No puede ser mayor a 10 dígitos'
                    ]" :readonly="isReadOnly">
                    <template v-slot:prepend>
                      <q-icon color="green-10" name="phone" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </q-form>
          <!-- Fin de Formulario de datos planos -->
          <div>
            <!--Tabla aprendices  -->
            <div class="tablaAprendices">
              <div style="
                  margin: 50px;
                  border-bottom: 4px solid green;
                  font-size: 4em;
                  text-align: center;
                ">
                Aprendices
              </div>
            </div>
            <div style="padding: 40px">
              <div style="display: flex; justify-content: end; gap: 10px">
                <q-select filled clearable v-model="busquedaAprendiz" use-input input-debounce="0"
                  label="Buscar aprendiz por nombre..." :options="aprendicesFiltrados" :option-label="(option) =>
                    `${option.firstName} ${option.lastName} - ${option.numDocument}`
                    " @filter="filtroAprendices" style="width: 40%" transition-show="flip-up"
                  transition-hide="flip-down" :disable="isReadOnly" v-if="!isReadOnly">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        <q-btn style="width: 20%" @click="open = true" icon="add" color="primary"
                          :disable="isReadOnly"></q-btn>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-btn @click="listaAprendices" icon="add" color="primary" :disable="isReadOnly" v-if="!isReadOnly" />
              </div>
              <div>
                <q-table :rows="aprendicesAgregados" :columns="columnsAprendices" row-key="id" flat bordered>
                  <template v-slot:body-cell-no="props">
                    <q-td :props="props">
                      {{ props.pageIndex + 1 }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-options="props" v-if="!isReadOnly">
                    <q-td>
                      <div class="divBorrarFila">
                        <q-btn @click="() => borrarFilaAprendiz(props.row)" icon="delete" color="negative"
                          :disable="isReadOnly" />
                      </div>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
            <!-- Tabla instructores -->
            <div class="contTablaInstructor">
              <div>
                <div style="
                    margin: 50px;
                    border-bottom: 4px solid green;
                    font-size: 4em;
                    text-align: center;
                  ">
                  Instructores
                </div>
              </div>
              <div style="padding: 40px">
                <div style="display: flex; justify-content: end; gap: 10px">
                  <q-select filled clearable v-model="busquedaInstructor" use-input input-debounce="0"
                    label="Buscar instructor por nombre..." :options="instructoresFiltrados" option-label="name"
                    @filter="filtroInstructores" style="width: 40%" transition-show="flip-up"
                    transition-hide="flip-down" :disable="isReadOnly" v-if="!isReadOnly">
                  </q-select>
                  <q-btn @click="listaInstructores" icon="add" color="primary" :disable="isReadOnly"
                    v-if="!isReadOnly" />
                </div>
                <div>
                  <q-table :rows="instructoresAgregados" :columns="columnsInstructores" row-key="id" flat bordered>
                    <template v-slot:body-cell-no="props">
                      <q-td :props="props">
                        {{ props.pageIndex + 1 }}
                      </q-td>
                    </template>
                    <template v-slot:body-cell-tipo="props">
                      <q-td>
                        <div class="contTypeSelect">
                          <q-select class="typeSelect" borderless v-model="props.row.tipo" :options="tipos"
                            :disable="isReadOnly" />
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-options="props" v-if="!isReadOnly">
                      <q-td>
                        <div class="divBorrarFila">
                          <q-btn @click="() => borrarFilaInstructor(props.row)" icon="delete" color="negative"
                            :disable="isReadOnly" />
                        </div>
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </div>
              <!-- Fin tabla instructor -->
            </div>
          </div>
        </div>
        <q-card-actions align="right" class="bg-white text-teal" v-if="!isReadOnly">
          <q-btn color="primary" :loading="isSaving" label="Guardar" @click="saveFunction" :disable="isReadOnly" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="2em" />
          <span class="q-ml-sm">¿Desea cerrar sin guardar?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="No" color="primary" v-close-popup />
          <q-btn flat label="Si" color="primary" @click="closeWithoutSaving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Footer></Footer>
  </q-layout>
</template>


<script setup>
import { ref, onBeforeMount } from "vue";

import Table from "../components/tables/TableButton.vue";
import CustomButton from "../components/buttons/CustomButton.vue";
import CustomSelect from "../components/input/CustomSelect.vue";
import TableModal from "../components/modal/TableModal.vue";
import FormModal from "../components/modal/FormModal.vue";
import Input from "../components/input/CustomInput.vue";
import {
  notifyErrorRequest,
  notifySuccessRequest,
} from "../composables/notify/Notify.vue";

import { getData, postData, putData } from "../services/ApiClient.js";

import Header from "../components/header/header.vue";

// Variables reactivas
const title = ref("REGISTRO EP");
let tituloRegistro = ref("Agregar registro");
const dialog = ref(false);
let dialogFull = ref(false);
const maximizedToggle = ref(true);
const secondModaldialog = ref(false);
const tableModalDialog = ref(false);
const dialogTitle = ref("");
const modalityDialogTitle = ref("SELECCIONE MODALIDAD");
const drawerOpen = ref(true);
const isSaving = ref(false);
const confirmDialog = ref(false);

const modalitiesOptions = ref([]);
const apprenticeOptions = ref([]);
const instructorsOptions = ref([]);

// v-models de los inputs
const idApprentice = ref("");
const modalityId = ref("");
const startDate = ref("");
const endDate = ref("");
const company = ref("");
const phoneCompany = ref("");
const addressCompany = ref("");
const owner = ref("");
const docAlternative = ref("");
const hour = ref("");
const businessProyectHour = ref("");
const productiveProjectHour = ref("");
const mailCompany = ref("");
const followUpInstructorUnico = ref("");

// v-models de los inputs del modal
const idApprenticeModal = ref("");
const startDateModal = ref("");
const endDateModal = ref("");
const companyModal = ref("");
const phoneCompanyModal = ref("");
const addressCompanyModal = ref("");
const ownerModal = ref("");
const docAlternativeModal = ref("");
const hourProductiveStageApprenticeModal = ref("");
const mailCompanyModal = ref("");

const modalityName = ref("");
let isReadOnly = ref(false);
let loading = ref(false);

// Asignación de instructores
const assignment = ref([
  {
    followUpInstructor: [],
    technicalInstructor: [],
    projectInstructor: [],
  },
]);

// validateInput
const validateRequired = (val, message = 'Este campo es obligatorio') => !!val || message;
const validateNoSpaces = (val, message = 'No se permiten espacios vacíos') => val.trim().length > 0 || message;
const validateNoNumbers = (val, message = 'No puede incluir números') => /^[^0-9]*$/.test(val) || message;
const validateMaxLengthTen = (val, message = 'No puede ser mayor a 10 dígitos') => val.length <= 10 || message;
const validateNoLeadingTrailingSpaces = (val, message = 'No puede empezar ni terminar con espacios.') => /^[^\s].*[^\s]$/.test(val) || message;
const validateEmail = (val, message = 'Correo inválido') => /.+@.+\..+/.test(val) || message;
// const validateAddress = (val, message = 'La dirección contiene caracteres no válidos.') => /^[a-zA-Z0-9\s.,-]+$/.test(val) || message;
const validateNoLetters = (val, message = 'Solo puede contener números') => /^[0-9]*$/.test(val) || message;
const validateNoAnySpaces = (val, message = 'No se permiten espacios vacíos en ningún lugar') => !/\s/.test(val) || message;
const validateGoogleDriveLink = (val, message = 'Enlace de Google Drive inválido') => {
  const drivePattern = /^https:\/\/(?:drive|docs)\.google\.com\/(?:file\/d\/|document\/d\/|spreadsheets\/d\/|presentation\/d\/|forms\/d\/|drive\/folders\/|open\?id=)[a-zA-Z0-9_-]+(?:\/.*)?(?:\?.*)?$/;
  return drivePattern.test(val) || message;
};




let busquedaInstructor = ref(null);

const selectedRow = ref(null);
const saveFunction = ref(() => { });

const rows = ref([]);
const instructores = ref([]);
const instructoresAgregados = ref([]);
const instructoresFiltrados = ref([]);
const aprendices = ref([]);
const aprendicesAgregados = ref([]);
const aprendicesFiltrados = ref([]);
let busquedaAprendiz = ref(null);
const tipos = ref([]);
const columns = ref([
  {
    name: "no",
    required: true,
    label: "N°",
    align: "center",
    field: "no",
  },
  {
    name: "name",
    required: true,
    label: "NOMBRE APRENDIZ",
    align: "center",
    field: "apprenticeName",
    sortable: true,
  },
  {
    name: "ficheNumber",
    required: true,
    label: "COD. FICHA",
    align: "center",
    field: "ficheNumber",
    sortable: true,
  },
  {
    name: "ficheName",
    required: true,
    label: "FICHA",
    align: "center",
    field: "ficheName",
    sortable: true,
  },
  {
    name: "modality",
    align: "center",
    label: "MODALIDAD",
    field: "modalityName",
    sortable: true,
  },
  {
    name: "startDate",
    required: true,
    label: "FECHA INICIO",
    align: "center",
    field: "startDate",
    sortable: true,
  },
  {
    name: "endDate",
    align: "center",
    label: "FECHA FIN",
    field: "endDate",
    sortable: true,
  },
  {
    name: "status",
    align: "center",
    label: "ESTADO",
    field: "endDate",
    sortable: true,
  },
  {
    name: "opciones",
    align: "center",
    label: "OPCIONES",
    field: "opciones",
  },
]);

const columnsInstructores = ref([
  {
    name: "no",
    required: true,
    label: "N°",
    align: "center",
    field: "no",
  },
  {
    name: "name",
    required: true,
    label: "Nombre Instructor",
    align: "center",
    field: "name",
  },
  {
    name: "numdocument",
    required: true,
    label: "N° documento",
    align: "center",
    field: "numdocument",
  },
  {
    name: "email",
    required: true,
    label: "Email",
    align: "center",
    field: "email",
  },
  {
    name: "phone",
    required: true,
    label: "Telefono",
    align: "center",
    field: "phone",
  },
  {
    name: "thematicarea",
    required: true,
    label: "Area tematica",
    align: "center",
    field: "thematicarea",
  },
  {
    name: "tipo",
    required: true,
    label: "Tipo de instructor",
    align: "center",
    field: "tipo",
  },
  {
    name: "options",
    label: "opciones",
    align: "center",
    sortable: true,
  },
]);

const columnsAprendices = ref([
  {
    name: "no",
    required: true,
    label: "N°",
    align: "center",
    field: "no",
  },
  {
    name: "name",
    required: true,
    label: "Nombre Aprendiz",
    align: "center",
    field: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    name: "numDocument",
    required: true,
    label: "N° documento",
    align: "center",
    field: "numDocument",
  },
  {
    name: "personalEmail",
    required: true,
    label: "Email",
    align: "center",
    field: "personalEmail",
  },
  {
    name: "phone",
    required: true,
    label: "Telefono",
    align: "center",
    field: "phone",
  },
  {
    name: "numfiche",
    required: true,
    label: "N° Ficha",
    align: "center",
    field: "numfiche",
  },
  {
    name: "fiche",
    required: true,
    label: "Ficha",
    align: "center",
    field: "fiche",
  },
  {
    name: "options",
    label: "opciones",
    align: "center",
    sortable: true,
  },
]);

// Función para obtener datos al montar el componente
onBeforeMount(() => {
  getDataForTable();
  getInstructores();
});

// Función para obtener instructores
async function getInstructores() {
  const response = await getData(`Repfora/instructors`);
  console.log(response);
  instructores.value = response;
}

// Función para listar instructores
function listaInstructores() {
  const maxInstructores = (() => {
    if (
      modalityId.value.name?.toLowerCase() === "proyecto productivo" ||
      modalityId.value.name?.toLowerCase() === "proyecto social" ||
      modalityName.value?.toLowerCase() === "proyecto productivo" ||
      modalityName.value?.toLowerCase() === "proyecto social"
    ) {
      return 2;
    } else {
      return 3; // Valor por defecto si no coincide con ninguna modalidad específica
    }
  })();

  if (instructoresAgregados.value.length >= maxInstructores) {
    notifyErrorRequest(
      `No se pueden agregar más de ${maxInstructores} instructores para esta modalidad.`
    );
    return;
  }

  if (!busquedaInstructor.value) {
    notifyErrorRequest("Busque el nombre del instructor");
    return;
  }

  const instructorExistente = instructoresAgregados.value.find(
    (instructor) => instructor.id === busquedaInstructor.value._id
  );
  if (instructorExistente) {
    notifyErrorRequest("El instructor ya ha sido agregado.");
    return;
  }

  instructoresAgregados.value.push({
    id: busquedaInstructor.value._id,
    name: busquedaInstructor.value.name,
    tpdocument: busquedaInstructor.value.tpdocument,
    numdocument: busquedaInstructor.value.numdocument,
    email: busquedaInstructor.value.email,
    phone: busquedaInstructor.value.phone,
    thematicarea: busquedaInstructor.value.thematicarea,
    tipo: "",
  });
  console.log(instructores.value);
  console.log(instructoresAgregados.value);
}

// Función para listar aprendices
function listaAprendices() {
  if (!busquedaAprendiz.value) {
    notifyErrorRequest("Busque el nombre del aprendiz");
    return;
  }

  const aprendizExistente = aprendicesAgregados.value.find(
    (aprendiz) => aprendiz.id === busquedaAprendiz.value._id
  );
  if (aprendizExistente) {
    notifyErrorRequest("El aprendiz ya ha sido agregado.");
    return;
  }

  aprendicesAgregados.value.push({
    id: busquedaAprendiz.value._id,
    firstName: busquedaAprendiz.value.firstName,
    lastName: busquedaAprendiz.value.lastName,
    tpdocument: busquedaAprendiz.value.tpdocument,
    numDocument: busquedaAprendiz.value.numDocument,
    personalEmail: busquedaAprendiz.value.personalEmail,
    phone: busquedaAprendiz.value.phone,
    numfiche: busquedaAprendiz.value.fiche.number,
    fiche: busquedaAprendiz.value.fiche.name,
  });
  console.log(aprendices.value);
}

// Función para filtrar instructores
const filtroInstructores = (val, update) => {
  /* productosFiltrados.value =  !nombre ? productosApi.value : productosApi.value.filter((item)=> item.nombre.toLowerCase().includes(nombre)) 
  console.log(productosFiltrados.value); */
  if (val == "") {
    update(() => {
      instructoresFiltrados.value = instructores.value;
    });

    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    instructoresFiltrados.value = instructores.value.filter((instructor) =>
      instructor.name.toLowerCase().includes(needle)
    );
  });
};

// Función para borrar fila de instructor
const borrarFilaInstructor = (row) => {
  instructoresAgregados.value = instructoresAgregados.value.filter(
    (instructor) => instructor.id !== row.id
  );
};

// Función para filtrar aprendices
const filtroAprendices = (val, update) => {
  if (val == "") {
    update(() => {
      aprendicesFiltrados.value = aprendices.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    aprendicesFiltrados.value = aprendices.value.filter((aprendiz) =>
      `${aprendiz.numDocument} ${aprendiz.firstName} ${aprendiz.lastName}`
        .toLowerCase()
        .includes(needle)
    );
  });
};

// Función para borrar fila de aprendiz
const borrarFilaAprendiz = (row) => {
  aprendicesAgregados.value = aprendicesAgregados.value.filter(
    (aprendiz) => aprendiz.id !== row.id
  );
};

// Función para obtener datos de la tabla
async function getDataForTable() {
  loading.value = true;
  console.log(loading.value);

  try {
    const getRegisters = await getData("register/listallregister");
    const getApprentices = await getData("apprendice/listallapprentice");
    const getModalities = await getData("modality/listallmodality");
    console.log("getModalities: ", getModalities);

    // Verificar que las respuestas contengan los datos esperados
    if (
      !getRegisters.data ||
      !Array.isArray(getApprentices) ||
      !Array.isArray(getModalities)
    ) {
      throw new Error("Datos no encontrados en la respuesta");
    }

    // Para usar en el modal e imprimir los aprendices en el filtro
    aprendices.value = getApprentices;

    const registersWithApprenticeAndModality = getRegisters.data.map(
      (register) => {
        const apprentice = getApprentices.find(
          (apprentice) => apprentice._id === register.idApprentice[0]?._id
        );

        const modality = getModalities.find(
          (modality) => modality._id === register.idModality?._id
        );

        modalitiesOptions.value = getModalities.map((modality) => ({
          _id: modality._id,
          name: modality.name,
        }));

        apprenticeOptions.value = getApprentices.map((apprentice) => ({
          apprenticeId: apprentice._id,
          apprenticeName:
            `${apprentice.firstName} ${apprentice.lastName} - ${apprentice.fiche.name}`.trim(),
        }));

        instructorsOptions.value = instructores.value.map((instructor) => ({
          instructorId: instructor._id,
          instructorLabel:
            `${instructor.name} - ${instructor.numdocument}`.trim(),
          name: instructor.name,
          email: instructor.email,
          numDocument: instructor.numdocument,
        }));

        return {
          ...register,
          apprenticeName: apprentice
            ? `${apprentice.firstName} ${apprentice.lastName}`
            : "No Encontrado",
          ficheNumber: apprentice
            ? `${apprentice.fiche.number}`
            : "No Encontrada",
          ficheName: apprentice ? `${apprentice.fiche.name}` : "No Encontrada",
          modalityName: modality ? modality.name : "No Encontrada",
          startDate: formatDate(register.startDate),
          endDate: formatDate(register.endDate),
        };
      }
    );

    // Ordenar los registros por fecha de creación en orden descendente
    rows.value = registersWithApprenticeAndModality.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log("rows: ", rows.value);
  } catch (error) {
    console.error("Error al obtener datos para la tabla:", error);
  } finally {
    loading.value = false;
    console.log(loading.value);
  }
}

// Función para formatear fecha para input
function formatDateToInput(date) {
  if (!date) return "";
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
}

// Función para formatear fecha
function formatDate(date) {
  if (!date) return "No Encontrado";
  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formattedDate;
}

// Función para abrir el siguiente modal del formulario
function nextFormModal() {
  const isvalid = formRef.value.validate();
  if (!isvalid) {
    return;
  }
  console.log(modalityId.value.name);
  dialogTitle.value = "CREAR REGISTRO";
  if (
    modalityId.value.name.toLowerCase() == "pasantia" ||
    modalityId.value.name.toLowerCase() == "vinculo laboral" ||
    modalityId.value.name.toLowerCase() == "unidad productiva familiar" ||
    modalityId.value.name.toLowerCase() == "contrato de aprendizaje" ||
    modalityId.value.name.toLowerCase() == "monitorias"
  ) {
    dialog.value = false;
    secondModaldialog.value = true;
  } else {
    dialog.value = false;
    dialogFull.value = true;

    // PROYECTO EMPRESARIAL y PROYECTO PRODUCTIVO I+D:
    // Requieren los instructores: projectInstructor, technicalInstructor, followUpInstructor.

    // PROYECTO SOCIAL y PROYECTO PRODUCTIVO:
    // Requieren los instructores: followUpInstructor, technicalInstructor.

  } if (
    modalityId.value.name?.toLowerCase() == "proyecto productivo" ||
    modalityId.value.name?.toLowerCase() == "proyecto social"
  ) {
    tipos.value = ["Seguimiento", "Tecnico"];
  } else {
    tipos.value = ["Seguimiento", "Tecnico", "Proyecto"];
  }
}


const confirmClose = () => {
  if (isReadOnly.value) {
    dialogFull.value = false;
    clearForm();
  } else {
    confirmDialog.value = true;
  }
};

const closeWithoutSaving = () => {
  confirmDialog.value = false;
  dialogFull.value = false;
  clearForm();
};

// Función para alternar el estado del drawer
function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}

// Función para abrir el diálogo
const openDialog = () => {
  clearForm();
  isReadOnly.value = false;
  tituloRegistro.value = "Agregar registro";
  saveFunction.value = saveRegisterModal;
  dialog.value = true;
  console.log("dialog: ", dialog.value);
};

// Función para limpiar el formulario
const clearForm = () => {
  isReadOnly.value = false;
  idApprenticeModal.value = "";
  startDateModal.value = "";
  endDateModal.value = "";
  modalityId.value = "";
  companyModal.value = "";
  phoneCompanyModal.value = "";
  addressCompanyModal.value = "";
  ownerModal.value = "";
  docAlternativeModal.value = "";
  hourProductiveStageApprenticeModal.value = "";
  mailCompanyModal.value = "";
  instructoresAgregados.value = [];
  aprendicesAgregados.value = [];
  busquedaInstructor.value = null;
  busquedaAprendiz.value = null;

  startDate.value = "";
  endDate.value = "";
  company.value = "";
  phoneCompany.value = "";
  addressCompany.value = "";
  owner.value = "";
  docAlternative.value = "";
  hour.value = "";
  businessProyectHour.value = "";
  productiveProjectHour.value = "";
  mailCompany.value = "";
  followUpInstructorUnico.value = "";
  idApprentice.value = "";
};

// Función para editar un registro
const editRegister = (row) => {
  selectedRow.value = row;
  tituloRegistro.value = "Editar registro";
  saveFunction.value = editRegisterModal;

  console.log("selectedRow: ", selectedRow.value);

  modalityName.value = row.modalityName;

  if (
    row.modalityName.toLowerCase() == "pasantia" ||
    row.modalityName.toLowerCase() == "vinculo laboral" ||
    row.modalityName.toLowerCase() == "unidad productiva familiar" ||
    row.modalityName.toLowerCase() == "contrato de aprendizaje" ||
    row.modalityName.toLowerCase() == "monitorias"
  ) {
    dialog.value = false;

    // Asignar los datos seleccionados a los campos del formulario del segundo modal
    idApprentice.value = {
      apprenticeId: row.idApprentice[0]?._id,
      apprenticeName: `${row.idApprentice[0]?.firstName} ${row.idApprentice[0]?.lastName} - ${row.idApprentice[0]?.fiche?.name}`
    };
    startDate.value = formatDateToInput(row.startDate);
    endDate.value = formatDateToInput(row.endDate);
    company.value = row.company;
    phoneCompany.value = row.phoneCompany;
    addressCompany.value = row.addressCompany;
    owner.value = row.owner;
    docAlternative.value = row.docAlternative;
    hour.value = row.hourProductiveStageApprentice;
    businessProyectHour.value = row.businessProyectHour;
    productiveProjectHour.value = row.productiveProjectHour;
    mailCompany.value = row.mailCompany;

    if (row.assignment && row.assignment.length > 0) {
      const lastAssignment = row.assignment[row.assignment.length - 1];
      followUpInstructorUnico.value = {
        instructorId: lastAssignment.followUpInstructor[0]?.idInstructor,
        instructorLabel: `${lastAssignment.followUpInstructor[0]?.name}`
      };
    } else {
      followUpInstructorUnico.value = null;
    }

    secondModaldialog.value = true;
  } else {
    dialog.value = false;

    // Asignar los datos seleccionados a los campos del formulario del primer modal
    idApprenticeModal.value = row.idApprentice.map(
      (apprentice) => apprentice._id
    );
    startDateModal.value = formatDateToInput(row.startDate);
    endDateModal.value = formatDateToInput(row.endDate);
    companyModal.value = row.company;
    phoneCompanyModal.value = row.phoneCompany;
    addressCompanyModal.value = row.addressCompany;
    ownerModal.value = row.owner;
    docAlternativeModal.value = row.docAlternative;
    hourProductiveStageApprenticeModal.value = row.hourProductiveStageApprentice;
    mailCompanyModal.value = row.mailCompany;

    if (row.assignment && row.assignment.length > 0) {
      const lastAssignment = row.assignment[row.assignment.length - 1];
      const followUpInstructor = lastAssignment.followUpInstructor
        .slice(-1)
        .map((instructor) => ({ ...instructor, tipo: "Seguimiento" }));
      const technicalInstructor = lastAssignment.technicalInstructor
        .slice(-1)
        .map((instructor) => ({ ...instructor, tipo: "Tecnico" }));
      const projectInstructor = lastAssignment.projectInstructor
        .slice(-1)
        .map((instructor) => ({ ...instructor, tipo: "Proyecto" }));

      instructoresAgregados.value = followUpInstructor
        .concat(technicalInstructor, projectInstructor)
        .map((instructor) => {
          const busquedaInstructorData =
            instructores.value.find((i) => i._id === instructor.idInstructor) ||
            {};
          return {
            id: instructor.idInstructor,
            name: instructor.name,
            tpdocument: busquedaInstructorData.tpdocument || "",
            numdocument: busquedaInstructorData.numdocument || "",
            email: instructor.email,
            phone: busquedaInstructorData.phone || "",
            thematicarea: busquedaInstructorData.thematicarea || "",
            tipo: instructor.tipo,
          };
        });
    } else {
      instructoresAgregados.value = [];
    }

    aprendicesAgregados.value = row.idApprentice.map((apprentice) => {
      return {
        id: apprentice._id,
        firstName: apprentice.firstName,
        lastName: apprentice.lastName,
        tpdocument: apprentice.tpdocument,
        numDocument: apprentice.numDocument,
        personalEmail: apprentice.personalEmail,
        phone: apprentice.phone,
        numfiche: apprentice.fiche.number,
        fiche: apprentice.fiche.name,
      };
    });

    dialogFull.value = true;

    // PROYECTO EMPRESARIAL y PROYECTO PRODUCTIVO I+D:
    // Requieren los instructores: projectInstructor, technicalInstructor, followUpInstructor.

    // PROYECTO SOCIAL y PROYECTO PRODUCTIVO:
    // Requieren los instructores: followUpInstructor, technicalInstructor.

    if (
      row.modalityName.toLowerCase() == "proyecto productivo" ||
      row.modalityName.toLowerCase() == "proyecto social"
    ) {
      tipos.value = ["Seguimiento", "Tecnico"];
    } else {
      tipos.value = ["Seguimiento", "Tecnico", "Proyecto"];
    }
  }
};


const saveRegisterModal = async () => {
  if (!formRef.value.validate()) {
    return
  }

  // Verificar que todos los campos estén llenos
  if (
    !startDateModal.value ||
    !endDateModal.value ||
    !companyModal.value ||
    !phoneCompanyModal.value ||
    !addressCompanyModal.value ||
    !ownerModal.value ||
    !docAlternativeModal.value ||
    !hourProductiveStageApprenticeModal.value ||
    !mailCompanyModal.value
  ) {
    notifyErrorRequest("Todos los campos deben estar llenos.");
    return;
  }

  // Lógica de validación y actualización
  const followUpInstructor = [];
  const technicalInstructor = [];
  const projectInstructor = [];

  const tiposSeleccionados = new Set();

  for (const instructor of instructoresAgregados.value) {
    if (!instructor.tipo) {
      notifyErrorRequest(
        "Todos los instructores deben tener un tipo seleccionado."
      );
      return;
    }
    if (tiposSeleccionados.has(instructor.tipo.toLowerCase())) {
      notifyErrorRequest(
        `No se pueden agregar más de un instructor con el tipo ${instructor.tipo}.`
      );
      return;
    }
    tiposSeleccionados.add(instructor.tipo.toLowerCase());

    if (instructor.tipo.toLowerCase() === "seguimiento") {
      followUpInstructor.push({
        idInstructor: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: 1, // Agregar el campo status
      });
    } else if (instructor.tipo.toLowerCase() === "tecnico") {
      technicalInstructor.push({
        idInstructor: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: 1, // Agregar el campo status
      });
    } else if (instructor.tipo.toLowerCase() === "proyecto") {
      projectInstructor.push({
        idInstructor: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: 1, // Agregar el campo status
      });
    }
  }

  const assignmentData = {
    followUpInstructor,
    technicalInstructor,
    projectInstructor,
  };

  const registerDataModal = {
    idApprentice: aprendicesAgregados.value.map((aprendiz) => aprendiz.id), // Solo enviar los IDs
    idModality: modalityId.value._id,
    modalityName: modalityId.value.name,
    startDate: startDateModal.value,
    endDate: endDateModal.value,
    company: companyModal.value,
    phoneCompany: phoneCompanyModal.value,
    owner: ownerModal.value,
    docAlternative: docAlternativeModal.value,
    hourProductiveStageApprentice: hourProductiveStageApprenticeModal.value,
    mailCompany: mailCompanyModal.value,
    addressCompany: addressCompanyModal.value,
    assignment: [assignmentData], // Incluye assignment en registerDataModal
  };

  if (new Date(endDateModal.value) < new Date(startDateModal.value)) {
    notifyErrorRequest(
      "La fecha final no puede ser menor que la fecha inicial."
    );
    return;
  }

  console.log(registerDataModal);
  console.log(assignmentData);

  try {
    let response = await postData("register/addregister", registerDataModal);

    getDataForTable();
    console.log("save register" + response);
    // Si la respuesta es exitosa, actualizamos la tabla y cerramos el modal
    dialogFull.value = false;
    notifySuccessRequest("Asignación guardada exitosamente");
  } catch (error) {
    notifyErrorRequest("Ocurrió un error al guardar la asignación");
  }
};

// Función para editar un registro desde el modal
const editRegisterModal = async () => {
  // Verificar que todos los campos estén llenos
  if (
    !startDateModal.value ||
    !endDateModal.value ||
    !companyModal.value ||
    !phoneCompanyModal.value ||
    !addressCompanyModal.value ||
    !ownerModal.value ||
    !docAlternativeModal.value ||
    !hourProductiveStageApprenticeModal.value ||
    !mailCompanyModal.value ||
    aprendicesAgregados.value.length === 0
  ) {
    notifyErrorRequest("Todos los campos deben estar llenos.");
    return;
  }

  // Lógica de validación y actualización de los aprendices
  if (new Date(endDateModal.value) < new Date(startDateModal.value)) {
    notifyErrorRequest(
      "La fecha final no puede ser menor que la fecha inicial."
    );
    return;
  }

  const registerDataModal = {
    idApprentice: aprendicesAgregados.value.map((aprendiz) => aprendiz.id),
    startDate: startDateModal.value,
    endDate: endDateModal.value,
    company: companyModal.value,
    phoneCompany: phoneCompanyModal.value,
    owner: ownerModal.value,
    docAlternative: docAlternativeModal.value,
    hourProductiveStageApprentice: hourProductiveStageApprenticeModal.value,
    mailCompany: mailCompanyModal.value,
    addressCompany: addressCompanyModal.value,
  };

  console.log(registerDataModal);

  try {
    let response = await putData(
      `register/updateregisterbyid/${selectedRow.value._id}`,
      registerDataModal
    );

    // Si la respuesta es exitosa, llamamos a addAssignment
    await addAssignment();
    console.log(response);
  } catch (error) {
    console.log(error);
    notifyErrorRequest("Ocurrió un error al editar el registro");
  }
};

// Función para mostrar detalles
const showDetails = (row) => {
  selectedRow.value = row;
  tituloRegistro.value = "Detalles del registro";
  isReadOnly.value = true;
  dialogFull.value = true;

  // Asignar los datos seleccionados a los campos del formulario
  idApprenticeModal.value = row.idApprentice;
  startDateModal.value = formatDateToInput(row.startDate);
  endDateModal.value = formatDateToInput(row.endDate);
  companyModal.value = row.company;
  phoneCompanyModal.value = row.phoneCompany;
  addressCompanyModal.value = row.addressCompany;
  ownerModal.value = row.owner;
  docAlternativeModal.value = row.docAlternative;
  hourProductiveStageApprenticeModal.value = row.hourProductiveStageApprentice;
  mailCompanyModal.value = row.mailCompany;

  if (row.assignment && row.assignment.length > 0) {
    const lastAssignment = row.assignment[row.assignment.length - 1];
    const followUpInstructor = lastAssignment.followUpInstructor
      .slice(-1)
      .map((instructor) => ({ ...instructor, tipo: "Seguimiento" }));
    const technicalInstructor = lastAssignment.technicalInstructor
      .slice(-1)
      .map((instructor) => ({ ...instructor, tipo: "Tecnico" }));
    const projectInstructor = lastAssignment.projectInstructor
      .slice(-1)
      .map((instructor) => ({ ...instructor, tipo: "Proyecto" }));

    instructoresAgregados.value = followUpInstructor
      .concat(technicalInstructor, projectInstructor)
      .map((instructor) => {
        const busquedaInstructorData =
          instructores.value.find((i) => i._id === instructor.idInstructor) ||
          {};
        return {
          id: instructor.idInstructor,
          name: instructor.name,
          tpdocument: busquedaInstructorData.tpdocument || "",
          numdocument: busquedaInstructorData.numdocument || "",
          email: instructor.email,
          phone: busquedaInstructorData.phone || "",
          thematicarea: busquedaInstructorData.thematicarea || "",
          tipo: instructor.tipo,
        };
      });
  } else {
    instructoresAgregados.value = [];
  }

  aprendicesAgregados.value = row.idApprentice.map((apprentice) => {
    return {
      id: apprentice._id,
      firstName: apprentice.firstName,
      lastName: apprentice.lastName,
      tpdocument: apprentice.tpdocument,
      numDocument: apprentice.numDocument,
      personalEmail: apprentice.personalEmail,
      phone: apprentice.phone,
      numfiche: apprentice.fiche.number,
      fiche: apprentice.fiche.name,
    };
  });

  // Desplazarse a la sección de aprendices
  setTimeout(() => {
    const aprendizSection = document.querySelector('.tablaAprendices');
    if (aprendizSection) {
      aprendizSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

// Función para añadir asignación
const addAssignment = async () => {
  // Lógica actualización
  const followUpInstructor = [];
  const technicalInstructor = [];
  const projectInstructor = [];

  const tiposSeleccionados = new Set();

  for (const instructor of instructoresAgregados.value) {
    if (!instructor.tipo) {
      notifyErrorRequest(
        "Todos los instructores deben tener un tipo seleccionado."
      );
      return;
    }
    if (tiposSeleccionados.has(instructor.tipo.toLowerCase())) {
      notifyErrorRequest(
        `No se pueden agregar más de un instructor con el tipo ${instructor.tipo}.`
      );
      return;
    }
    tiposSeleccionados.add(instructor.tipo.toLowerCase());

    if (instructor.tipo.toLowerCase() === "seguimiento") {
      followUpInstructor.push({
        idInstructor: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: 1, // Agregar el campo status
      });
    } else if (instructor.tipo.toLowerCase() === "tecnico") {
      technicalInstructor.push({
        idInstructor: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: 1, // Agregar el campo status
      });
    } else if (instructor.tipo.toLowerCase() === "proyecto") {
      projectInstructor.push({
        idInstructor: instructor.id,
        name: instructor.name,
        email: instructor.email,
        status: 1, // Agregar el campo status
      });
    }
  }

  const assignmentData = {
    assignment: [
      {
        followUpInstructor,
        technicalInstructor,
        projectInstructor,
      },
    ],
  };

  console.log(assignmentData);

  try {
    let response = await putData(
      `register/addassignment/${selectedRow.value._id}`,
      assignmentData
    );
    // Si la respuesta es exitosa, actualizamos la tabla y cerramos el modal
    dialogFull.value = false;
    getDataForTable();
    console.log(response);

    notifySuccessRequest("Registro actualizado exitosamente");
  } catch (error) {
    console.log(error);
    notifyErrorRequest("Ocurrió un error al editar el registro");
  }
};

// Función para alternar el estado de un registro
async function toggleStatus(row) {
  try {
    console.log("row" + row);

    const url =
      row.status === 0
        ? `register/enableregister/${row._id}`
        : `register/disableregister/${row._id}`;
    const res = await putData(url, {}); // Definir la variable res aquí
    await getDataForTable();
    notifySuccessRequest("Estado cambiado exitosamente");
    getDataForTable();
    console.log(res);
  } catch (error) {
    console.log(error);

    notifyErrorRequest("Ocurrió un error al cambiar el estado del registro");
  }
}
</script>

<style scoped>
.divBorrarFila {
  display: flex;
  justify-content: center;
  align-items: center;
}

.contTypeSelect {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.contTablaInstructor {
  padding: 20px 0;
}

.contFormFila {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  width: 100%;
}

.contInput {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 50px;
  width: 100%;
  margin: 10px 0;
}

.customLabel {
  font-size: large;
}

.formulario {
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  gap: 40px;
  border-radius: 10px;
  width: 100%;
  padding: 40px;
}

.titulo {
  text-align: center;
  margin: 0;
}

.long {
  width: 25%;
}
</style>