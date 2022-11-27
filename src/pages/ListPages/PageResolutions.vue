<template>
  <q-page class="q-pb-xl" padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Resolución"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
      :isModifying="update"
    >
      <template v-slot:header v-if="update">VER RESOLUCIÓN</template>
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
          max-length="13"
          class="q-mb-md"
        />

        <!--        commissions-->
        <q-card
          v-for="(c, i) in resolutionObject.commissions"
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
                  @click="resolutionObject.commissions.splice(i, 1)"
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
              :options="userSt.array"
              :rules="[val || 'Por favor, seleccione un presidente']"
              label="Presidente"
              lazy-rules
              map-options
              option-label="name"
              emit-value
              option-value="id"
            />
            <q-select
              label="Secretario"
              :readonly="update"
              v-model="c.secretary"
              :dense="state.dense"
              :options="userSt.array"
              :rules="[val || 'Por favor, seleccione un secretario']"
              lazy-rules
              map-options
              emit-value
              option-value="id"
              option-label="name"
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
          :label="`Comisión ${resolutionObject.commissions.length + 1}`"
          @click="
            resolutionObject.commissions.push({
              president: null,
              secretary: null,
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
      @delete-rows="(selectedRows) => s.del(selectedRows)"
      :canUpdate="false"
    ></ListPage>
    <DevInfo>
      resolutionObject: {{ resolutionObject }}<br />
      resolutionStore.array: {{ s.array }}
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
import state, { pathToCurso } from "src/composables/useState.js";
import { useUserStore } from "src/stores/userStore";
import { useResolutionStore } from "src/stores/resolutionStore";
import { useAuthStore } from "src/stores/authStore";
const auth = useAuthStore();
const userSt = useUserStore();
const s = useResolutionStore();
s.refresh();
userSt.refresh();

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const resolutionObject = ref({});
const resolutionRowObject = ref({});
const resolutionExportObject = ref({});

const update = computed(() => resolutionObject.value.id !== undefined);
//openForm triggered on: Nueva entrada, Modificar
const currentYear = new Date().getFullYear();
const curso = `1/${currentYear}-${currentYear + 1}`;
function openForm(
  obj = {
    number: curso,
    commissions: [{}, {}],
  }
) {
  resolutionRowObject.value = obj;
  resolutionObject.value = obj;
  showForm.value = true;
}

//SUBMIT
function submitFormData() {
  resolutionObject.value.resolutor = auth.loggedUser.id;
  s.save(resolutionObject.value);
  resetFormData();
  closeForm();
}
//RESET
function resetFormData() {
  resolutionObject.value = { ano: curso, commissions: [{}] };
}

// delete tuples by array of objects
function deleteTuples(selectedRows = []) {
  s.del(selectedRows);
}
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
    label: "commissions",
    align: "left",
    field: (r) => r.commissions.map((c) => c.president.name),
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
