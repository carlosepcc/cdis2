import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { usePermisoStore } from "src/stores/permisoStore.js";
import { urls } from "src/composables/useAPI";
export const useRolStore = defineStore("rol", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const permisoStore = usePermisoStore();
  const tipos = ["SISTEMA", "COMISION", "CASO"];
  const url = urls.rol;
  const mockArray = [
    {
      id: 1,
      tipo: "comision",
      rol: "ROLE_PRESIDENTE",
      permisoList: [
        { permiso: "ROLE_R_DENUNCIA" },
        { permiso: "ROLE_C_DENUNCIA" },
        { permiso: "ROLE_C_DECLARACION" },
      ],
    },
    {
      id: 2,
      tipo: "sistema",
      rol: "ROLE_ESTUDIANTE",
      permisoList: [{ permiso: "ROLE_R_DENUNCIA" }],
    },
  ];
  const array = ref([]);

  //HELPERS
  function rolStrToLabel(rolStr) {
    let rules = [
      { s: "role_", r: "" },
      { s: "admin", r: "Administrador" },
      { s: "cion", r: "ción" },
      { s: "_d", r: " de decano" },
      { s: "_c", r: " de comisión" },
    ];
    let rolLabel = rolStr.toLowerCase();
    rules.forEach((rule) => {
      rolLabel = rolLabel.replace(rule.s, rule.r);
    });
    rolLabel = rolLabel.replace(/^\w/, rolLabel[0].toUpperCase());
    return rolLabel;
  }

  //GETTERS
  const arrayUi = computed(() => {
    return array.value.map((rol) => {
      return {
        tipo: rol.tipo,
        permisoList: permisoStore.permisoArrayToUi(rol.permisoList),
        value: rol.rol,
        label: rolStrToLabel(rol.rol),
      };
    });
  });
  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read() {
    return apiStore.read(url);
  }
  function refresh() {
    console.log("Refreshing roles list");
    apiStore.read(url, array);
  }
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate);
  }
  function update(objectToUpdate) {
    return apiStore.save(objectToUpdate, url, true);
  }
  function create(objectToCreate) {
    return apiStore.save(objectToCreate, url, false);
  }
  function del(itemsToDelete) {
    return apiStore.del(itemsToDelete, url);
  }

  return {
    tipos,
    rolStrToLabel,
    arrayUi,
    array,
    url,
    read,
    refresh,
    save,
    del,
    update,
    create,
  };
});
