import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { Dialog, Notify, QSpinnerGears } from "quasar";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useAuthStore } from "src/stores/authStore.js";
import { urls } from "src/composables/useAPI";
import { notifyError } from "src/composables/useAPI";

export const useApiStore = defineStore("api", () => {
  //COMPOSITING STORES
  const router = useRouter();
  const auth = useAuthStore();

  //STATE
  const offlineApiTesting = true;

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read(url = urls.user, refArray) {
    let responseData = [];
    let noti = Notify.create({
      type: "ongoing",
      message: `Accediendo al listado ${url}`,
      spinner: QSpinnerGears,
      actions: [{ label: "Ocultar", color: "white" }],
    });
    console.log(`Prepared to access to api endpoint: ${url}`);
    api
      .get(url)
      .then((response) => {
        noti({ timeout: 100 });
        // handle success
        console.log(`Api endpoint ${url} accessed. Response: `, response);

        responseData = response.data;

        if (refArray) refArray.value = response.data;

        console.info("responseData", responseData);
      })
      .catch((error) => {
        // handle error
        console.log("There was an error accessing the api endpoint: ", error);
        notifyError(
          error,
          {
            message: `Carga fallida de ${url}. ${error.response.data.mensaje}`,
          },
          noti
        );
      });
    return responseData;
  }

  function save(objectToSave, url, isUpdate = objectToSave.id) {
    console.info("save function triggered");
    if (offlineApiTesting) {
      let localKey = url + objectToSave.id ?? Math.random().toString;
      localStorage.setItem(localKey, objectToSave);
      return localStorage.getItem(localKey);
    }
  }
  function del(itemsToDelete = [], url = urls.value.usuario) {
    console.info("del function triggered");
    if (offlineApiTesting) {
      itemsToDelete.forEach((item) => {
        let localKey = url + item.id;
        localStorage.removeItem(localKey);
        console.info("deleted item: " + localKey);
      });
    }
  }
  return {
    offlineApiTesting,
    urls,
    read,
    save,
    del,
  };
});
