import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
export const useDenunciaStore = defineStore("denuncia", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.denuncia;
  const array = ref([]);
  const mockArray = [
    {
      id: 0,
      denunciante: "Angel Leandro Fabré Sores",
      fecha: "2022-11-04",
      abierto: true,
      descripcion: "Esta es la descripción de la denuncia.",
    },
    {
      id: 0,
      denunciante: "Daniel Chávez Enriquez",
      fecha: "2022-11-04",
      abierto: true,
      descripcion: "Esta es la descripción de la denuncia.",
    },
    {
      id: 0,
      denunciante: "Belkis Uveros Reinas",
      fecha: "2022-11-04",
      abierto: true,
      descripcion: "Esta es la descripción de la denuncia.",
    },
  ];

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read() {
    if (apiStore.offlineApiTesting) {
      return mockArray;
    } else return apiStore.read(url);
  }
  function refresh() {
    console.log("Refreshing denuncias list");
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
