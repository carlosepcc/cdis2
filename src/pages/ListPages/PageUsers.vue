<template>
  <q-page class="q-pb-xl" padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Usuario"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
      :isModifying="true"
    >
      <q-input
        filled
        label="Nombre"
        v-model="userObject.name"
        :dense="state.dense"
        :rules="[val || 'Por favor, escriba un nombre de usuario válido']"
        lazy-rules
      />
      <q-input
        filled
        label="Usuario"
        v-model="userObject.user"
        :dense="state.dense"
        :rules="[val || 'Por favor, escriba un nombre de usuario válido']"
        lazy-rules
      />
      <q-select
        label="Rol"
        v-model="userObject.role"
        :dense="state.dense"
        :options="roleStore.array"
        :rules="[val || 'Por favor, seleccione un opción']"
        filled
        map-options
        emit-value
        lazy-rules
      />
      <q-select
        label="Cargo"
        v-model="userObject.position"
        :dense="state.dense"
        :options="s.cargos"
        :rules="[val || 'Por favor, seleccione una opción']"
        filled
        lazy-rules
      />
      <q-select
        v-model="userObject.scientificCategory"
        :dense="state.dense"
        :options="s.scientificCategories"
        :rules="[val || 'Por favor, seleccione una opción']"
        filled
        label="Categoría científica"
        lazy-rules
      />

      <DevInfo> userObject: {{ userObject }} </DevInfo>
    </BaseForm>
    <ListPage
      :columns="columns"
      :rows="s.array"
      heading="Usuarios"
      rowKey="usuario"
      @updateList="s.refresh"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => deleteTuples(selectedRows)"
      :canCreate="true"
      :canDelete="true"
    >
    </ListPage>
    <DevInfo>
      {{ s.array }}
    </DevInfo>
  </q-page>
</template>
<script setup>
import { ref } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import state from "src/composables/useState.js";
import { useUserStore } from "src/stores/userStore";
import { useRoleStore } from "src/stores/roleStore";
const roleStore = useRoleStore();
const s = useUserStore();
s.refresh();

//form dialog model
const showForm = ref(false);

//closeForm triggered on: Cancel
const closeForm = () => {
  showForm.value = false;
  s.refresh();
};

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const userObject = ref({});
const isUpdate = ref(false); //Is user object meant to be an update of an existing entry?
//openForm triggered on: Nueva entrada, Modificar
const openForm = (obj) => {
  if (obj) {
    isUpdate.value = true;
    userObject.value = obj;
  } else isUpdate.value = false;
  showForm.value = true;
};

//SUBMIT
function submitFormData() {
  s.save(userObject.value, isUpdate);
}
//RESET
function resetFormData() {
  userObject.value = null;
}

// delete tuples by array of objects
function deleteTuples(selectedRows = []) {
  eliminar(selectedRows, usersArr, url);
}
//Campos de la tabla
const columns = ref([
  {
    label: "Nombre",
    name: "name",
    required: true,
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    label: "Usuario",
    name: "username",
    required: true,
    align: "username",
    field: "username",
    sortable: true,
  },
  {
    label: "Cargo",
    name: "position",
    required: true,
    align: "center",
    field: (u) => u.position ?? "Sin cargo",
    sortable: true,
  },
  {
    label: "Rol",
    name: "role",
    align: "center",
    field: (u) => u.roles[1],
    sortable: true,
  },
]);
</script>
