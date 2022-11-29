import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
export const useResolutionStore = defineStore("resolution", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.resolution;
  const array = ref([]);

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)

  function refresh() {
    console.log("Refreshing resoluciones list");
    apiStore.read(url, array);
  }
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate, array);
  }
  function del(itemsToDelete = []) {
    return apiStore.del(itemsToDelete, url, array);
  }

  function print(obj) {
    obj = {
      id: 0,
      number: "string",
      date: "string",
      commissions: [
        {
          id: 0,
          president: {
            id: 0,
            name: "string",
            username: "string",
            position: "string",
            gender: "string",
            scientificCategory: "string",
            roles: ["ADMIN"],
          },
          secretary: {
            id: 0,
            name: "string",
            username: "string",
            position: "string",
            gender: "string",
            scientificCategory: "string",
            roles: ["ADMIN"],
          },
          blocked: true,
          busy: true,
        },
      ],
      resolutor: {
        id: 0,
        name: "string",
        username: "string",
        position: "string",
        gender: "string",
        scientificCategory: "string",
        roles: ["ADMIN"],
      },
    };
    let documentDefinition = {};
    console.info("The user wants to print: ", obj);
  }

  return {
    array,
    url,
    refresh,
    save,
    del,
    print,
  };
});
