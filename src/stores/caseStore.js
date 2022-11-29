import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";

export const useCaseStore = defineStore("case", () => {
  // Compositing stores
  const apiStore = useApiStore();
  const url = urls.denunciation;
  const array = ref([]);

  // Action functions

  //// REFRESH (Read and update state)
  function refresh() {
    console.log("Refreshing cases list");
    return apiStore.read(urls.case, array);
  }

  //// SAVE (Create or update)
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate, array);
  }
  function archive(object) {
    object.commission = null;
    object.status = statuses.archived;
    return apiStore.save(object, url, true, array);
  }
  function print() {
    console.info("The user wants to print");
  }

  return {
    array,
    url,
    refresh,
    save,
    archive,
    print,
  };
});
