<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Conclusion"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
    >
      <template v-slot:default>
        <div>
          <div class="text-dark text-caption">Denunciado</div>
          {{ conclusion.implicado.name }}
        </div>
        <div>
          <div class="text-dark text-caption">Denuncia</div>
          {{ conclusion.denuncia.description }}
        </div>
        <q-input filled v-model="conclusion.falta" label="Falta" autogrow />
        <q-select
          v-model="conclusion.calificacion.text"
          :dense="state.dense"
          :options="['Muy Grave', 'Grave', 'Menos Grave']"
          :rules="[val || 'Por favor, seleccione una comisión']"
          filled
          lazy-rules
          label="Calificación de la falta"
        />
        <q-select
          v-model="conclusion.atenuantes"
          multiple
          :dense="state.dense"
          :options="atenuantes"
          :rules="[val || 'Por favor, seleccione atenuantes']"
          filled
          lazy-rules
          map-options
          option-label="text"
          option-value="inciso"
          label="Atenunantes"
          behavior="dialog"
        />
        <q-select
          v-model="conclusion.agravantes"
          multiple
          :dense="state.dense"
          :options="agravantes"
          :rules="[val || 'Por favor, seleccione agravantes']"
          filled
          lazy-rules
          map-options
          option-label="text"
          option-value="inciso"
          label="Agravantes"
          behavior="dialog"
        />
      </template>
    </BaseForm>
    <ListPage
      :columns="casoFields"
      :rows="casosArr"
      heading="Casos"
      rowKey="id"
      @updateList="listarCasos"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => deleteTuples(selectedRows)"
    ></ListPage>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import listar, { eliminar, guardar } from "src/composables/useAPI.js";
import state, {
  casosArr,
  denunciasArr,
  comisionesArr,
} from "src/composables/useState.js";

function incisoToDescription(article = 3, inciso = "a") {
  return "Descripción del inciso.  (ToDo)"; //TODO
}
const atenuantes = [
  {
    inciso: "a",
    text: "Haber mantenido una buena actitud ante el estudio desde el inicio de su especialidad hasta el momento de cometer la falta",
  },
  {
    inciso: "b",
    text: "Haberse declarado autor del hecho cometido antes de que se produzca la denuncia correspondiente",
  },
  {
    inciso: "c",
    text: "Reconocer su responsabilidad en la primera comparecencia ante la ComisiónDisciplinaria",
  },
  {
    inciso: "d",
    text: "Adoptar una actitud autocrítica y consecuente ante la falta cometida",
  },
  {
    inciso: "e",
    text: "Contribuir al total esclarecimiento de los hechos por todos los medios a su alcance",
  },
];

const agravantes = [
  {
    inciso: "a",
    text: "Haber mantenido una mala actitud en relación con el estudio antes de la comisión de la falta. En este sentido se tomarán como criterios principales los que corresponden al colectivo estudiantil y al profesor guía",
  },
  {
    inciso: "b",
    text: "Ser reincidente",
  },
];
const conclusion = ref({
  falta: "Tentativa de fraude",
  date: "22-10-3",
  denuncia: {
    description:
      "El estudiante fue sorprendido intentando cometer fraude durante el examen parcial de Programación ",
  },
  calificacion: {
    article: 5,
    inciso: "c",
    text: "Muy Grave",
  },
  medida: {
    text: "Separación de 3 a 5 cursos de la Educación Superior.",
    inciso: "a1",
  },
  atenuantes: ["c", "d", "e"],
  agravantes: ["a"],
  prescribeEn: 5,
  implicado: {
    name: "Adalberto Pérez González",
    cargo: "estudiante",
    grupo: "4301",
  },
  declaraciones: [
    {
      title: "Declaración del implicado",
      description:
        "La Comisión Disciplinaria se entrevistó con el estudiante, el cual, en su comparecencia, explica lo sucedido, afirma se siente mal por ello y que querría pedir disculpas a los profesores.",
    },
    {
      title: "Opinión del Profesor Guía",
      description:
        "Tiene resultados académicos regulares, y buen comportamiento. No asiste a la mayoría de actividades de la brigada.",
    },
  ],
  revisionExpediente:
    "El estudiante no ha sido sancionado anteriormente. Resultados docentes regulares. Su evaluación de integralidad es de R.",
  comision: {
    integrantes: [
      { cargo: "profesor", rol: "presidente", name: "Ana del Carmen Sosa" },
      {
        cargo: "profesor",
        rol: "secretario",
        name: "José Hernández de la Concepción",
      },
      {
        cargo: "estudiante",
        rol: "vocal de la FEU",
        name: "Armando Paredes del Castillo",
      },
    ],
  },
});

const casoFields = ref([
  {
    name: "denuncia",
    required: true,
    label: "Denuncia",
    field: (caso) => caso.denuncia1?.descripcion.slice(0, 30),
    sortable: true,
  },
  {
    name: "fechaapertura",
    required: true,
    label: "Fecha de apertura",
    field: "fechaapertura",
    sortable: true,
  },
  {
    name: "fechaexpiracion",
    required: true,
    label: "Fecha de expiración",
    field: "fechaexpiracion",
    sortable: true,
  },
  {
    name: "abierto",
    required: true,
    label: "Abierto",
    field: "abierto",
    format: (abierto) => (abierto ? "Sí" : "No"),
    sortable: true,
  },
]);
const url = "/caso";

//listar
const listarCasos = () => listar(casosArr, url);
// execute on component load
listarCasos();
listar(denunciasArr, "/denuncia");
listar(comisionesArr, "/comision");

//form dialog model
const showForm = ref(false);

//closeForm triggered on: Cancel
const closeForm = () => {
  showForm.value = false;
  listarCasos();
};

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const casoObject = ref({});

//openForm triggered on: Nueva entrada, Modificar
const openForm = (
  obj = {
    diaExp: expDay,
    mesExp: expMonth,
    anoExp: expYear,
  }
) => {
  casoObject.value = obj;
  showForm.value = true;
};
const d = new Date();
const expDate = d;
const expYear = expDate.getFullYear();
const expMonth = expDate.getMonth();
const expDay = expDate.getDay();

const update = ref(casoObject.value.casoPK !== undefined);
//SUBMIT
function submitFormData() {
  guardar(casoObject.value, casosArr, url, update.value);
}
//RESET
function resetFormData() {
  casoObject.value = {
    diaExp: expDay,
    mesExp: expMonth,
    anoExp: expYear,
  };
}

// delete tuples by array of objects
const deleteTuples = (selectedRows = []) =>
  eliminar(selectedRows, casosArr, url);
</script>
