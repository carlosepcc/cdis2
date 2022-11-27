<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      :formTitle="`Denuncia ${denunciationObject.idDenuncia ?? ''}`"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
      :isModifying="update"
    >
      <q-select
        v-if="denunciationObject.id"
        :disable="
          auth.loggedUserUi.role != roles.dec &&
          auth.loggedUserUi.role != roles.adm
        "
        v-model="denunciationObject.status"
        :dense="state.dense"
        :options="['Pendiente', 'Activa', 'Cerrada', 'Archivada']"
        :rules="[val || 'Por favor, seleccione los infractores']"
        filled
        label="Estado"
        use-chips
        lazy-rules
      />
      <!--TODO @filter="filterFn" use-input -->
      <q-select
        v-model="denunciationObject.infractors"
        multiple
        :dense="state.dense"
        :options="userStore.array"
        :rules="[val || 'Por favor, seleccione los infractores']"
        filled
        label="Infractores"
        use-chips
        lazy-rules
        map-options
        option-label="name"
        emit-value
        option-value="id"
        behavior="dialog"
      />
      <!-- Descripción denuncia -->
      <q-input
        v-model.trim="denunciationObject.subject"
        :dense="state.dense"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
        ]"
        clearable
        label="Asunto"
        lazy-rules
      />
      <!-- Descripción denuncia -->
      <q-input
        v-model.trim="denunciationObject.description"
        :dense="state.dense"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
        ]"
        autogrow
        clearable
        label="Descripción"
        lazy-rules
      />
      <div v-if="denunciationObject.id" class="q-mx-md text-dark">
        <label>Período de actuaciones de la comisión</label>
        <q-date landscape range v-model="denunciationObject.range" />
      </div>
      <DevInfo>
        {{ denunciationObject }}
      </DevInfo>
    </BaseForm>
    <ListPage
      :columns="columns"
      :rows="s.array"
      heading="Denuncias"
      @updateList="s.refresh()"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => s.del(selectedRows)"
      :can-update="false"
      :can-delete="false"
    ></ListPage>

    <DevInfo> Denuncias: {{ s.array }} </DevInfo>
  </q-page>
</template>
<script setup>
import { ref, computed } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import roles from "src/composables/useRoles";
import { useAuthStore } from "src/stores/authStore";
import { useDenunciationStore } from "src/stores/denunciationStore";
import { useUserStore } from "src/stores/userStore";
import state from "src/composables/useState.js";
const auth = useAuthStore();
const userStore = useUserStore();
const s = useDenunciationStore();
s.refresh();
userStore.refresh();
// execute on component mounted
//const queryResult = s.refresh();
//const usersQueryResult = userStore.refresh();
//listar usuarios

//form dialog model
const showForm = ref(false);

//closeForm triggered on: Cancel
const closeForm = () => {
  showForm.value = false;
  s.refresh();
};

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const denunciationObject = ref({});
const update = computed(() => denunciationObject.value.id);
//openForm is triggered on emits: Nueva entrada, Modificar
const openForm = (obj = {}) => {
  denunciationObject.value = obj;
  showForm.value = true;
};
//SUBMIT
function submitFormData() {
  denunciationObject.value.openDate = denunciationObject.value.range.from;
  denunciationObject.value.endDate = denunciationObject.value.range.to;
  s.save(denunciationObject.value);
  closeForm();
}
//RESET
function resetFormData() {
  denunciationObject.value = {};
}

//Campos de la tabla
const columns = ref([
  /* {name: "acusados",    required: true,    label: "Estudiantes implicados",    align: "left",    field: "acusados",    sortable: true,},*/

  {
    name: "subject",
    required: true,
    label: "Asunto",
    align: "left",
    field: "subject",
    sortable: true,
  },
  {
    name: "accuser",
    required: true,
    label: "Denunciante",
    align: "left",
    field: (d) => d.accuser.name,
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
  {
    name: "status",
    required: true,
    label: "Estado",
    align: "left",
    field: "status",
    sortable: true,
  },
]);
</script>
