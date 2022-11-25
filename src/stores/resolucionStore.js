import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
export const useResolucionStore = defineStore("resolucion", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.resolucion;
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
    apiStore.read(url);
    return mockArray;
  }
  function refresh() {
    console.log("Refreshing resoluciones list");
    array.value = read();
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
