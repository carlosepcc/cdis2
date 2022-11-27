import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";

export const useDenunciationStore = defineStore("denunciation", () => {
  // Compositing stores
  const apiStore = useApiStore();
  const url = urls.denunciation;
  const array = ref([]);
  const mockArray = [];

  // Action functions

  //// REFRESH (Read and update state)
  function refresh() {
    console.log("Refreshing denunciations list");
    return apiStore.read(url, array);
  }

  //// SAVE (Create or update)
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate, array);
  }

  //// DELETE
  function del(itemsToDelete) {
    return apiStore.del(itemsToDelete, url, array);
  }

  return {
    array,
    url,
    refresh,
    save,
    del,
  };
});
