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
        v-model="denunciationObject.commission"
        :dense="state.dense"
        :options="commissionStore.array"
        :rules="[val || 'Por favor, seleccione los infractores']"
        filled
        map-options
        emit-value
        :option-label="(c) => c.president?.name + ', ' + c.secretary?.name"
        option-value="id"
        label="Comisión Disciplinaria"
        use-chips
        lazy-rules
      />
      <q-input
        v-if="denunciationObject.commission"
        label="Fin de actuaciones de la comisión"
        filled
        v-model="denunciationObject.endDate"
        mask="date"
        :rules="['date']"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="denunciationObject.endDate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-select
        v-if="denunciationObject.id"
        readonly
        borderless
        :disable="
          auth.loggedUserUi.role != roles.dec &&
          auth.loggedUserUi.role != roles.adm
        "
        v-model="denunciationObject.status"
        :dense="state.dense"
        :options="['Pendiente', 'Activa', 'Cerrada', 'Archivada']"
        :rules="[val || 'Por favor, seleccione un estado']"
        label="Estado"
        lazy-rules
      />

      <!--TODO @filter="filterFn" use-input -->
      <!-- INFRACTORES -->
      <q-select
        :readonly="update"
        :filled="!update"
        :borderless="update"
        v-model="denunciationObject.infractors"
        multiple
        :dense="state.dense"
        :options="userStore.students"
        :rules="[val || 'Por favor, seleccione los infractores']"
        label="Infractores"
        use-chips
        lazy-rules
        map-options
        option-label="name"
        emit-value
        option-value="id"
        behavior="dialog"
      />
      <!-- Asunto denuncia -->
      <q-input
        :readonly="update"
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
        :readonly="update"
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
      <!-- VOCALS -->
      <template v-if="denunciationObject.id">
        <q-card
          v-for="(vocal, i) in denunciationObject.vocals"
          :key="i"
          flat
          bordered
          class="my-card q-mb-sm"
        >
          <q-card-section class="q-pa-xs q-pl-sm q-pr-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-light">Vocal {{ i + 1 }}</div>
              </div>

              <div class="col-auto" v-if="!update">
                <q-btn
                  color="negative"
                  size="sm"
                  title="Descartar comisión"
                  flat
                  icon="r_close"
                  @click="denunciationObject.vocals.splice(i, 1)"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-select
              :readonly="!auth.loggedUserUi.role"
              v-model="vocal.id"
              :dense="state.dense"
              :options="userStore.array"
              :rules="[val || 'Por favor, seleccione un usuario']"
              label="Usuario"
              filled
              lazy-rules
              map-options
              option-label="name"
              emit-value
              option-value="id"
            />
            <q-input
              label="Actúa como"
              :readonly="!auth.loggedUserUi.role"
              filled
              :dense="state.dense"
              v-model.trim="vocal.role"
              :rules="[val || 'Por favor, escriba un rol']"
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
          :label="`Vocal ${denunciationObject.vocals.length + 1}`"
          @click="denunciationObject.vocals.push({})"
        />
      </template>

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

    <DevInfo>
      denunciationObject : {{ denunciationObject }}<br />
      Denuncias: {{ s.array }}
    </DevInfo>
    <DevInfo> commissions: {{ commissionStore.array }} </DevInfo>
  </q-page>
</template>
<script setup>
import { ref, computed } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import roles from "src/composables/useRoles";
import state from "src/composables/useState.js";
import { useAuthStore } from "src/stores/authStore";
import { useDenunciationStore } from "src/stores/denunciationStore";
import { useUserStore } from "src/stores/userStore";
import { useCommissionStore } from "src/stores/commissionStore";
const commissionStore = useCommissionStore();
const auth = useAuthStore();
const userStore = useUserStore();
const s = useDenunciationStore();
s.refresh();
userStore.refresh();
commissionStore.refresh();
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
const denunciationObject = ref({ vocals: [{}] });
const update = computed(() => (denunciationObject.value.id ? true : false));

//openForm is triggered on emits: Nueva entrada, Modificar
const openForm = (obj) => {
  denunciationObject.value = obj ?? { vocals: [{}] };
  showForm.value = true;
};

//SUBMIT
function submitFormData() {
  console.info("submitFormData", denunciationObject.value);
  s.save(denunciationObject.value);
  closeForm();
}
//RESET
function resetFormData() {
  denunciationObject.value = {};
}

const userIsAccuser = computed(
  () => denunciationObject.value.accuser?.id == auth.loggedUser.id
);
const userIsPresident = computed(
  () => denunciationObject.value.commission?.id == auth.loggedUser.id
);
const userIsInfractor = computed(() =>
  denunciationObject.value.infractors?.some(
    (infractor) => infractor.id == auth.loggedUser.id
  )
);
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
