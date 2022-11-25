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
        :readonly="isUpdate"
        filled
        label="Usuario"
        v-model="userObject.usuario"
        :dense="state.dense"
        :rules="[val || 'Por favor, escriba un nombre de usuario válido']"
        lazy-rules
        title="No se puede modificar el nombre de usuario una vez que se ha guardado en"
      />
      <q-select
        label="Rol"
        v-model="userObject.rol"
        :dense="state.dense"
        :options="rolStore.arrayUi"
        :rules="[val || 'Por favor, seleccione un opción']"
        filled
        map-options
        emit-value
        lazy-rules
      />
      <q-select
        label="Cargo"
        v-model="userObject.cargo"
        :dense="state.dense"
        :options="s.cargos"
        :rules="[val || 'Por favor, seleccione una opción']"
        filled
        lazy-rules
      />
      <q-select
        v-model="userObject.categoriacientifica"
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
      :rows="s.arrayUi"
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
      {{ s.arrayUi }}
    </DevInfo>
  </q-page>
</template>
<script setup>
import { ref } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import state, { rolesArr } from "src/composables/useState.js";
import { useUserStore } from "src/stores/userStore";
import { useRolStore } from "src/stores/rolStore";
const rolStore = useRolStore();
rolStore.refresh();
const s = useUserStore();
s.refresh();

// execute on component load
//listar()
//listar(rolesArr, '/rol')

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
    userObject.value = {
      rol: obj.rol,
      usuario: obj.usuario,
      nombre: obj.nombre,
      sexo: obj.sexo,
      categoriacientifica: obj.categoriacientifica,
    };
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
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "usuario",
    required: true,
    label: "Usuario",
    align: "left",
    field: "usuario",
    sortable: true,
  },
  {
    name: "cargo",
    required: true,
    label: "Cargo",
    align: "center",
    field: (u) => u.cargo ?? "Sin cargo",
    sortable: true,
  },
  {
    name: "rol",
    label: "Rol",
    align: "center",
    field: "rolLabel",
    sortable: true,
  },
]);
</script>
