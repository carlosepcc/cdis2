<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Declaración"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="showForm = false"
    >
      <template v-slot:default>
        <!-- Nombre declaration -->
        <q-select
          v-model="declarationObject.denunciation"
          :dense="state.dense"
          :options="denunciationStore.array"
          :rules="[val || 'Por favor, seleccione una opción']"
          filled
          lazy-rules
          map-options
          emit-value
          label="Caso disciplinario"
          behavior="dialog"
          :option-label="(d) => d.description.slice(0, 50) + '(...)'"
          option-value="id"
        />
        <q-select
          v-model="declarationObject.declarer"
          :options="userStore.array"
          :dense="state.dense"
          :rules="[val || 'Por favor, seleccione un usuario']"
          label="Usuario a declarar"
          lazy-rules
          filled
          map-options
          emit-value
          option-label="name"
          option-value="id"
        />
        <q-input
          label="Título"
          :disable="
            auth.loggedUserUi.role != roles.pre &&
            auth.loggedUserUi.role != roles.su
          "
          filled
          :dense="state.dense"
          v-model.trim="declarationObject.title"
          :rules="[val || 'Por favor, escriba un título']"
        />
        <!-- Descripción declaración -->
        <q-input
          label="Descripción"
          :v-show="false"
          v-model.trim="declarationObject.description"
          :dense="state.dense"
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Este campo no puede estar vacío',
          ]"
          autogrow
          clearable
          filled
          lazy-rules
        />
        <DevInfo>
          declarationObject: {{ declarationObject }}<br />
          declarationStore.array: {{ s.array }}
        </DevInfo>
      </template>
    </BaseForm>
    <ListPage
      :columns="declarationFields"
      :rows="s.array"
      heading="Declarations"
      rowKey="id"
      @updateList="s.refresh()"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => s.del(selectedRows)"
    ></ListPage>
  </q-page>
</template>
<script setup>
import { computed, ref } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import state from "src/composables/useState.js";
import { useDenunciationStore } from "src/stores/denunciationStore";
import { useUserStore } from "src/stores/userStore";
import { useDeclarationStore } from "src/stores/declarationStore";
import { useAuthStore } from "src/stores/authStore";
import roles from "src/composables/useRoles";
const auth = useAuthStore();
const userStore = useUserStore();
const denunciationStore = useDenunciationStore();
const s = useDeclarationStore();
s.refresh();
userStore.refresh();
denunciationStore.refresh();
const showForm = ref(false);

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const declarationObject = ref({ title: "Declaración del " });

const update = computed(() => declarationObject.value.id !== undefined);
//openForm triggered on: Nueva entrada, Modificar
function openForm(obj = { title: "Declaración del " }) {
  declarationObject.value = obj;
  showForm.value = true;
}

//SUBMIT
function submitFormData() {
  s.save(declarationObject.value);
  resetFormData();
  showForm.value = false;
}
//RESET
function resetFormData() {
  declarationObject.value = {};
}

const declarationFields = ref([
  {
    name: "declarer",
    required: true,
    label: "Declarante",
    align: "left",
    field: (d) => d.declarer.name,
    sortable: true,
  },
  {
    name: "denunciation",
    required: true,
    label: "Caso",
    align: "left",
    field: (dec) => dec.denunciation.subject,
    sortable: true,
  },
  {
    name: "status",
    required: true,
    label: "Estado",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "date",
    required: true,
    label: "Fecha",
    align: "left",
    field: "date",
    sortable: true,
  },
]);
</script>
