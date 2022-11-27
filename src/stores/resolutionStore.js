import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
export const useResolutionStore = defineStore("resolution", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.resolution;
  const array = ref([]);
  const mockArray = [
    {
      id: 0,
      numero: 15,
      curso: "2022",
      facultad: 4,
      fecha: "2022-11-04",
      decano: {
        nombre: "Maria Frida Cada",
        categoriacientifica: "Dra",
        sexo: "F",
        usuario: "mariafc",
      },
      comisionList: [
        {
          presidente: {
            nombre: "Fulano",
            usuario: "fulano",
            categoriacientifica: "MSc",
          },
          secretario: {
            nombre: "Mengano",
            usuario: "mengano",
            categoriacientifica: "MSc",
          },
        },
      ],
    },
  ];

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read() {
    return apiStore.read(url);
  }
  function refresh() {
    console.log("Refreshing resoluciones list");
    apiStore.read(url, array);
  }
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate, array);
  }
  function update(objectToUpdate) {
    return apiStore.save(objectToUpdate, url, true, array);
  }
  function del(itemsToDelete = []) {
    return apiStore.del(itemsToDelete, url, array);
  }

  return {
    array,
    url,
    read,
    refresh,
    save,
    del,
    update,
  };
});
