<template>
  <q-page class="q-pb-xl" padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="resolution"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
      :isModifying="update"
    >
      <template v-slot:header v-if="update">VER resolution</template>
      <template v-slot:footer v-if="update">
        <q-btn
          flat
          no-caps
          :size="state.dense ? 'sm' : 'md'"
          label="Cerrar"
          icon="r_close"
          class="full-width"
          @click="closeForm"
      /></template>
      <template v-slot:default>
        <q-input
          v-model="resolutionObject.number"
          :borderless="update"
          :dense="state.dense"
          label="Número"
          :readonly="update"
          max-length="4"
          class="q-mb-md"
        />

        <!--        COMISIONES-->
        <q-card
          v-for="(c, i) in resolutionObject.comisiones"
          :key="i"
          flat
          bordered
          class="my-card q-mb-sm"
        >
          <q-card-section class="q-pa-xs q-pl-sm q-pr-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-light">Comisión {{ i + 1 }}</div>
              </div>

              <div class="col-auto" v-if="!update">
                <q-btn
                  color="negative"
                  size="sm"
                  title="Descartar comisión"
                  flat
                  icon="r_close"
                  @click="resolutionObject.comisiones.splice(i, 1)"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-select
              :readonly="update"
              v-model="c.president"
              :dense="state.dense"
              :options="usersArr"
              :rules="[val || 'Por favor, seleccione un presidente']"
              label="Presidente"
              lazy-rules
              map-options
              option-label="name"
              emit-value
              option-value="id"
            />
            <q-select
              :readonly="update"
              v-model="c.secretary"
              :dense="state.dense"
              :options="usersArr"
              :rules="[val || 'Por favor, seleccione un secretario']"
              label="Secretario"
              lazy-rules
              map-options
              option-label="name"
              emit-value
              option-value="id"
            />
          </q-card-section>
        </q-card>

        <q-btn
          v-show="!update"
          flat
          size="xl"
          color="grey"
          icon="r_add"
          spread
          no-caps
          class="full-width"
          :label="`Comisión ${resolutionObject.comisiones.length + 1}`"
          @click="
            resolutionObject.comisiones.push({
              presidente: '',
              secretario: '',
              idRolP: 4,
              idRolS: 5,
            })
          "
        />
        <DevInfo>
          {{ resolutionObject }}
        </DevInfo>
      </template>
    </BaseForm>
    <ListPage
      :columns="resolutionFields"
      :rows="s.array"
      heading="Resolución"
      rowKey="id"
      @updateList="s.refresh"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => deleteTuples(selectedRows)"
      :canUpdate="false"
    ></ListPage>
    <DevInfo>
      resolutionObject: {{ resolutionObject }}<br />
      resolutionesArr: {{ resolutionesArr }}
    </DevInfo>
    <!--    No hay endpoint en el backend para modificar la resolution-->
  </q-page>
</template>
<script setup>
import { computed, ref } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import listar, { eliminar, guardar } from "src/composables/useAPI.js";
import state, {
  usersArr,
  permisosArr,
  resolutionesArr,
  pathToCurso,
} from "src/composables/useState.js";
import { useResolutionStore } from "src/stores/resolutionStore";
const s = useresolutionStore();
s.refresh();

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const resolutionObject = ref({});
const resolutionRowObject = ref({});
const resolutionExportObject = ref({});

const update = computed(() => resolutionObject.value.id !== undefined);
//openForm triggered on: Nueva entrada, Modificar
const currentYear = new Date().getFullYear();
const curso = `${currentYear}-${currentYear + 1}`;
const openForm = (
  obj = {
    ano: curso,
    comisiones: [
      {
        idRolP: 4,
        idRolS: 5,
      },
    ],
  }
) => {
  resolutionRowObject.value = obj;
  resolutionObject.value = obj;
  let resolutionDto = {};
  if (obj.id !== undefined) {
    resolutionDto.id = obj.id;
    resolutionDto.ano = pathToCurso(obj.url);
    resolutionDto.comisiones = obj.comisionList.map((c) => {
      return {
        presidente: c.comisionUsuarioList[0]?.usuario?.usuario,
        secretario: c.comisionUsuarioList[1]?.usuario?.usuario,
      };
    });
    resolutionObject.value = resolutionDto;
  }
  showForm.value = true;
};

//SUBMIT
function submitFormData() {
  s.save(resolutionObject.value);
  resetFormData();
  closeForm();
}
//RESET
function resetFormData() {
  resolutionObject.value = { ano: curso, comisiones: [{}] };
}

// delete tuples by array of objects
const deleteTuples = (selectedRows = []) =>
  s.del(selectedRows, resolutionesArr, url);
const resolutionFields = ref([
  {
    name: "number",
    label: "Número",
    field: "number",
    align: "center",
    sortable: true,
  },
  {
    name: "commissions",
    required: true,
    label: "Comisiones",
    align: "left",
    field: (r) => r.comisionList.map((c) => c.id),
    sortable: true,
  },
]);

//form dialog model
const showForm = ref(false);
//closeForm triggered on: Cancel
const closeForm = () => {
  showForm.value = false;
  s.refresh();
};
</script>
