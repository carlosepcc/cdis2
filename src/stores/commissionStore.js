import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";

export const useCommissionStore = defineStore("commission", () => {
  // Compositing stores
  const apiStore = useApiStore();
  const url = urls.commission;
  const array = ref([]);

  // Action functions

  //// Refresh (Read and update state)
  function refresh() {
    console.log("Refreshing commissions list");
    return apiStore.read(url, array);
  }

  return {
    array,
    url,
    refresh,
  };
});
