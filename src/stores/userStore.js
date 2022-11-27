import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { useRolStore } from "./rolStore";
export const useUserStore = defineStore("user", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const rolStore = useRolStore();
  const url = apiStore.urls.user;
  const array = ref([]);
  const mockArray = [
    {
      user: "denunciauno",
      name: "Denunciante Uno",
      roles: ["USER", "ADMIN"],
      cargo: "Cargouno",
      permisos: "ROLE_C_DENUNCIA",
    },
  ];
  //GETTERS
  const arrayUi = computed(() => {
    return array;
    // .value.map((v) => {
    //   return {
    //     username: v.user,
    //     name: v.name,
    //     genre: v.genre,
    //     position: v.position,
    //     scientificCategory: v.scientificCategory,
    //     role: v.roles[1],
    //     roles: v.roles,
    //     roleThumbnail: v.roles[1][0],
    //   };
    // });
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
