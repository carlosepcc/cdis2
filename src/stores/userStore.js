import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { useRolStore } from "./rolStore";
export const useUserStore = defineStore("user", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const rolStore = useRolStore();
  const url = apiStore.urls.user;
  const array = ref([
    { usuario: "carloseam", nombre: "Carlos Ernesto Pérez Carriles" },

    { usuario: "angellf", nombre: "Carlos Ernesto Abreu Martínez" },
  ]);
  const mockArray = [
    {
      usuario: "denunciauno",
      nombre: "Denunciante Uno",
      rol: { rol: "roluno", tipo: "sistema" },
      cargo: "Cargouno",
      permisos: "ROLE_C_DENUNCIA",
    },
    {
      usuario: "string",
      nombre: "string",
      contrasena: "string",
      sexo: "string",
      categoriacientifica: "string",
      rol: {
        rol: "string",
        tipo: "string",
      },
    },
  ];
  //GETTERS
  const arrayUi = computed(() => {
    return array.value.map((v) => {
      return {
        usuario: v.usuario,
        nombre: v.nombre,
        sexo: v.sexo,
        cargo: v.cargo,
        categoriacientifica: v.categoriacientifica,
        rol: v.rol,
        rolLabel: rolStore.rolStrToLabel(v.rol),
      };
    });
  });
  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read() {
    return apiStore.read(url); //TODO waiting for backend to be fixed
  }
  function refresh() {
    console.log("Refreshing users list");
    apiStore.read(url, array);
  }
  function save(objectToSave, isUpdate = objectToSave.id) {
    apiStore.save(objectToSave, url, isUpdate);
  }
  function update(objectToUpdate) {
    apiStore.save(objectToUpdate, url, true);
  }
  function create(objectToCreate) {
    apiStore.save(objectToCreate, url, false);
  }
  function del(itemsToDelete) {
    apiStore.del(itemsToDelete, url);
  }

  const scientificCategories = ref(["Dr.C", "M.Sc", "Ing", "Lic"]);
  const genres = ref(["M", "F"]);
  const cargos = ref(["PROFESOR", "ESTUDIANTE", "TRABAJADOR", "ADMINISTRADOR"]);

  return {
    cargos,
    genres,
    scientificCategories,
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
