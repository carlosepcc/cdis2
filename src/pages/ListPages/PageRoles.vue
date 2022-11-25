<template>
  <q-page class="q-pb-xl" padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Rol"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
    >
      <!-- Nombre rol -->
      <q-input
        :disable="rolNombreNoEditable"
        v-model.trim="rolObject.rol"
        :dense="state.dense"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
          (val) =>
            (val && /^[A-Za-z_ ]+$/.test(val)) ||
            'Sólo se admiten letras y guiones bajos (_)',
        ]"
        filled
        label="Nombre del rol"
        lazy-rules
      />
      <q-select
        label="Permisos"
        :dense="state.dense"
        filled
        v-model="rolObject.permisos"
        :options="permisoStore.arrayUi"
        emit-value
        map-options
        multiple
        use-chips
        behavior="dialog"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
        ]"
      />
      <q-select
        label="Tipo"
        :dense="state.dense"
        filled
        v-model="rolObject.tipo"
        :options="s.tipos"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
        ]"
      />
      <pre class="text-caption" v-if="state.loggedUser.usuario == 'admin'">
Developer info
rol se enviará como {{ rolObject.rol.toUpperCase().replace(/\s/g, "_") }}
{{ rolObject }}
        </pre
      >
      <DevInfo>{{ rolObject }}</DevInfo>
    </BaseForm>
    <ListPage
      :columns="rolFields"
      :rows="s.arrayUi"
      heading="Roles"
      rowKey="rol"
      @updateList="s.refresh"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => deleteTuples(selectedRows)"
    ></ListPage>
    <DevInfo>
      PERMISOS: {{ permisoStore.array }} Roles: {{ s.arrayUi }}
    </DevInfo>
  </q-page>
</template>
<script setup>
import DevInfo from "src/components/DevInfo.vue";
import { ref, computed } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import state, {
  permisoStrToLabel,
  permisosArr,
  permisosArrToLabeled,
} from "src/composables/useState.js";
import { usePermisoStore } from "src/stores/permisoStore";
import { useRolStore } from "src/stores/rolStore";
const permisoStore = usePermisoStore();
const s = useRolStore();
//listar
s.refresh();
permisoStore.refresh();

// execute on component load
//permisoStore.refresh();
//permisosArrToLabeled(permisosArr.value);

//form dialog model
const showForm = ref(false);

//closeForm triggered on: Cancel
const closeForm = () => {
  showForm.value = false;
  s.refresh();
};

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const rolObject = ref({});

//openForm triggered on: Nueva entrada, Modificar
const openForm = (obj = {}) => {
  rolObject.value = {
    tipo: obj?.tipo,
    rol: obj?.value,
    permisos: obj.permisoList?.map((p) => p.value),
  };
  showForm.value = true;
};

//SUBMIT
function submitFormData() {
  if (!/^ROLE_/i.test(rolObject.value.rol))
    rolObject.value.rol = `ROLE_${rolObject.value.rol}`; // Prueba si existe la cadena ROLE_ en el rol y, si no, la coloca
  rolObject.value.rol = rolObject.value.rol.replace(/\s/g, "_").toUpperCase(); //Modificar valor del nombre de rol para encajar con la manera en que se guardan en la base de datos. Reemplaza los espacios en blanco por _ y lleva todos los caracteres a mayúscula
  s.save(rolObject.value); //Hace la petición de guardado al servidor
  resetFormData();
}
//RESET object to default
function resetFormData() {
  rolObject.value = {};
}

// delete tuples by array of objects
const deleteTuples = (selectedRows = []) => s.del(selectedRows, s.array, url);

const rolFields = ref([
  {
    name: "rol",
    required: true,
    label: "Nombre",
    align: "left",
    field: "label",
    sortable: true,
  },
  {
    name: "permisos",
    required: true,
    label: "Primer permiso",
    align: "left",
    field: (row) => row.permisoList[0].label ?? "Sin permisos", //Nombre del primer permiso
    sortable: true,
  },
]);

const rolNombreNoEditable = computed(() => {
  return [
    "ROLE_SECRETARIO_D",
    "ROLE_PRESIDENTE_C",
    "ROLE_SECRETARIO_C",
    "ROLE_ADMIN",
    "ROLE_VOCAL",
    "ROLE_DECANO",
  ].some((value) => {
    return rolObject.value.rol ? rolObject.value.rol == value : false;
  });
});
</script>
