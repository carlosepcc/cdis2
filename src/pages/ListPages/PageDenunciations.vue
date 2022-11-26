<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      :formTitle="`Denuncia ${denunciaObject.idDenuncia ?? ''}`"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
      :isModifying="update"
    >
      <!--TODO @filter="filterFn" use-input -->
      <q-select
        v-model="denunciaObject.acusados"
        multiple
        :dense="state.dense"
        :options="userStore.array"
        :rules="[val || 'Por favor, seleccione una opción']"
        filled
        label="Implicados"
        use-chips
        lazy-rules
        map-options
        option-label="nombre"
        emit-value
        option-value="usuario"
        behavior="dialog"
      />
      <!-- Descripción denuncia -->
      <q-input
        v-model.trim="denunciaObject.descripcion"
        :dense="state.dense"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
        ]"
        autogrow
        clearable
        filled
        label="Descripción"
        lazy-rules
      />
      <DevInfo>
        {{ denunciaObject }}
      </DevInfo>
    </BaseForm>
    <ListPage
      :cargando="false"
      :columns="columns"
      :rows="s.array"
      heading="Denuncias"
      rowKey="id"
      @updateList="s.refresh()"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => deleteTuples(selectedRows)"
    ></ListPage>

    <DevInfo> Denuncias: {{ s.array }} </DevInfo>
  </q-page>
</template>
<script setup>
import { ref, computed } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import { useDenunciaStore } from "src/stores/denunciaStore";
import { useUserStore } from "src/stores/userStore";
import state from "src/composables/useState.js";
const userStore = useUserStore();
const s = useDenunciaStore();
s.refresh();
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
const denunciaObject = ref({});
const denunciaRowObject = ref({});

const update = computed(
  () => denunciaObject.value.idDenuncia || denunciaRowObject.value.id
);
//openForm triggered on: Nueva entrada, Modificar
const openForm = (obj = {}) => {
  denunciaRowObject.value = obj;
  denunciaObject.value = obj;
  let denunciaDto = {};
  if (obj.id !== undefined) {
    denunciaDto.idDenuncia = obj.id;
    denunciaDto.descripcion = obj.descripcion;
    denunciaDto.acusados = obj.acusados.map((acusado) => acusado.usuario);
    denunciaObject.value = denunciaDto;
  }
  showForm.value = true;
};
const createResult = {};
//SUBMIT
function submitFormData() {
  // guardar(denunciaObject.value, denunciasArr, url, update.value);
  createResult = s.create(denunciaObject.value);
  closeForm();
}
//RESET
function resetFormData() {
  denunciaObject.value = {};
}

// delete tuples by array of objects
const deleteTuples = (selectedRows = []) =>
  eliminar(selectedRows, denunciasArr, url);

//Campos de la tabla
const columns = ref([
  /* {name: "acusados",    required: true,    label: "Estudiantes implicados",    align: "left",    field: "acusados",    sortable: true,},*/
  {
    name: "fecha",
    required: true,
    label: "Fecha",
    align: "left",
    field: "fecha",
    sortable: true,
  },
  {
    name: "descripcion",
    required: true,
    label: "Descripción",
    align: "left",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "denunciante",
    required: true,
    label: "Denunciante",
    align: "left",
    field: "denunciante",
    sortable: true,
  },
  {
    name: "procesada",
    required: true,
    label: "Procesada",
    align: "left",
    field: "procesada",
    sortable: true,
    format: (procesada) => (procesada ? "Sí" : "No"),
  },
]);
</script>
