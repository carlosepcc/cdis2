<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Conclusión"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
    >
      <template v-slot:default>
        <div>
          <div class="text-dark text-caption">Denunciationdo</div>
          {{ conclusion.infractor.name }}
        </div>
        <div>
          <div class="text-dark text-caption">Denunciation</div>
          {{ conclusion.denunciation.description }}
        </div>
        <q-input filled v-model="conclusion.fault" label="Falta" autogrow />
        <q-select
          v-model="conclusion.calificacion.text"
          :dense="state.dense"
          :options="res.qualificationLabels"
          :rules="[val || 'Por favor, seleccione una comisión']"
          filled
          lazy-rules
          label="Calificación de la falta"
        />
        <q-select
          v-model="conclusion.atenuantes"
          multiple
          :dense="state.dense"
          :options="res.atenuantes"
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
          :options="res.agravantes"
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
      :columns="conclusionFields"
      :rows="s.array"
      heading="Casos"
      rowKey="id"
      @updateList="s.refresh()"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => s.del(selectedRows)"
    ></ListPage>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import res from "src/composables/useRegulation";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import state from "src/composables/useState.js";
import { useConclusionStore } from "stores/conclusionStore";
const s = useConclusionStore();
const conclusion = ref({
  fault: "Tentativa de fraude",
  date: "2022-10-3",
  denunciation: {
    description:
      "El estudiante fue sorprendido intentando cometer fraude durante el examen parcial de Programación ",
  },
  qualification: {
    article: 5,
    inciso: "c",
    text: "Muy Grave",
  },
  sanction: {
    text: "Separación de 3 a 5 cursos de la Educación Superior.",
    inciso: "a1",
  },
  atenuantes: ["c", "d", "e"],
  agravantes: ["a"],
  prescription: 5,
  infractor: {
    name: "Adalberto Pérez González",
    position: "estudiante",
    group: "4301",
  },
  declaraciones: [
    {
      title: "Declaración del infractor",
      description:
        "La Comisión Disciplinaria se entrevistó con el estudiante, el cual, en su comparecencia, explica lo sucedido, afirma se siente mal por ello y que querría pedir disculpas a los profesores.",
    },
    {
      title: "Opinión del Profesor Guía",
      description:
        "Tiene resultados académicos regulares, y buen comportamiento. No asiste a la mayoría de actividades de la brigada.",
    },
  ],
  recordRevision:
    "El estudiante no ha sido sancionado anteriormente. Resultados docentes regulares. Su evaluación de integralidad es de R.",
  commission: {
    members: [
      {
        position: "profesor",
        role: "PRESIDENT",
        name: "Ana del Carmen Sosa",
        gender: "F",
        scientificCategory: "Dra.C",
      },
      {
        position: "profesor",
        role: "SECRETARY",
        name: "José Hernández de la Concepción",
        gender: "M",
        scientificCategory: "Mt.C",
      },
      {
        position: "estudiante",
        role: "VOCAL DE LA FEU",
        name: "Armando Paredes del Castillo",
        gender: "M",
        scientificCategory: "Est",
      },
    ],
  },
});

const casoFields = ref([
  {
    name: "denunciation",
    required: true,
    label: "Denunciation",
    field: (caso) => caso.denunciation1?.description.slice(0, 30),
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
</script>
