import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Dialog, Notify, QSpinnerGears } from "quasar";
import isJwtTokenExpired, { decode } from "jwt-check-expiry";
import { api } from "boot/axios";
import { notifyError } from "src/composables/useAPI.js";
import { useRouter } from "vue-router";
import { urls } from "src/composables/useAPI.js";
export const useAuthStore = defineStore("auth", () => {
  //COMPOSITING STORES
  const router = useRouter();
  //STATE
  const offlineTesting = ref(false);
  const loggedUser = ref(null);
  const mockUser = ref({
    name: "Mock",
    username: "mock",
    role: "Mock",
  });
  const loggedUserUi = computed(() => {
    return {
      username: loggedUser.value?.username,
      name: loggedUser.value?.name,
      thumbnail: loggedUser.value?.name[0].toUpperCase(), //thumbnails supports html
      role: loggedUser.value?.roles.at(-1),
      roles: loggedUser.value?.roles,
      roleThumbnail: loggedUser.value?.roles.at(-1)[0], //thumbnails supports html
    };
  });

  //ACTIONS FUNCTIONS
  function removeLoggedUser() {
    localStorage.removeItem("token");
    api.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("loggedUser");
    loggedUser.value = null;
    router.replace("/");
    console.log("removeLoggedUser");
  }

  function logout() {
    Dialog.create({
      title: "Confirme cerrar sesión",
      message:
        "Deberá iniciar sesión la próxima vez que desee utilizar la aplicación.",
      cancel: true,
      persistent: true,
      color: "negative",
      ok: { label: "Cerrar sesión", noCaps: true, flat: true },
      cancel: { color: "primary", noCaps: true, flat: true },
    })
      .onOk(() => {
        removeLoggedUser();
        return "User wanted to logout";
      })
      .onCancel(() => {
        return "Canceled by user";
      });
  }
  function checkLocalAuthorization() {
    // Siempre se procede a revisar si hay un token guardado en localStorage
    let storedToken = localStorage.getItem("token");
    let isStoredTokenGood;
    try {
      isStoredTokenGood = storedToken && !isJwtTokenExpired(storedToken);
    } catch (error) {
      console.info(error, "The token is not good");
      isStoredTokenGood = false;
    }

    // Si este existe y no ha expirado, se actualiza el estado con los datos de usuario autenticado decodificado en localStorage y se establece el header de Autorization de axios
    if (isStoredTokenGood) {
      console.info("There is a good token stored.");
      loggedUser.value = JSON.parse(localStorage.getItem("loggedUser"));
      api.defaults.headers.common["Authorization"] = storedToken;
      console.log("The Authorization header was set.");
      console.table(
        `The ${loggedUserUi.value.role} ${loggedUserUi.value.name} is logged in. More info below.`,
        loggedUser.value
      );
      // si no existe o ya expiró, se quita de locaStorage y se enruta a la página inicial para que el usuario inicie sesión.
    } else {
      console.log(
        "You don't want to see what I saw looking for the stored token. Redirecting, you'll have to log in."
      );
      removeLoggedUser();
    }

    return isStoredTokenGood;
  }
  //ACTIONS FUNCTIONS
  function authorize(token) {
    console.log("Autorizando..");
    if (offlineTesting.value) {
      console.log("Offline testing. A mock user will be used.");
      return (loggedUser.value = mockUser.value);
    } else {
      // Usuario del token
      let user = null;
      let isTokenGood = token && !isJwtTokenExpired(token);
      console.log(
        `Provided token is ${
          token
            ? isTokenGood
              ? "not expired"
              : "expired, checking if there is a stored token.."
            : "none, checking if there is a stored token.."
        }`
      );

      // Si se recibe un token y este no ha expirado, se guarda en localStorage tanto el token mismo como el usuario decodificado
      if (isTokenGood) {
        user = decode(token).payload.user;
        localStorage.setItem("token", token);
        localStorage.setItem("loggedUser", JSON.stringify(user));
      }

      return checkLocalAuthorization();
    }
  }

  function login(loginObject) {
    let noti = Notify.create({
      type: "ongoing",
      message: `Iniciando sesión para ${loginObject.username}`,
      spinner: QSpinnerGears,
      actions: [{ label: "Ocultar", color: "white" }],
    });

    api({
      url: urls.login,
      method: "POST",
      data: loginObject,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log("Login response received: ", response);
        let token = "";
        try {
          token = response.data;
          console.info("Token received.");
        } catch (err) {
          console.error(err);
        }
        // Almacenar en localStorage, chequear y actualizar estado global
        authorize(token);

        // Notificación
        noti({
          type: "positive",
          spinner: null,
          message: `Sesión iniciada`,
          actions: [{ label: "OK", color: "white" }],
        });
      })
      .catch((error) => {
        console.error("login error: ", error);
        console.info("loginObject: ", loginObject);
        notifyError(error, noti, "No se pudo iniciar sesión");
      });
  }
  /*function login(loginObject) {
    let noti = Notify.create({
      type: "ongoing",
      message: `Iniciando sesión para ${loginObject.usuario}`,
      spinner: QSpinnerGears,
      actions: [{ label: "Ocultar", color: "white" }],
    });

    api({
      url: "/usuario/login",
      method: "POST",
      data: loginObject,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log(response);

        let token = response.data.token;
        console.log("Token:", token);

        // Almacenar en localStorage, chequear y actualizar estado global
        console.log("apiStore", apiStore);
        auth.authorize(token);

        // Notificación
        noti({
          type: "positive",
          spinner: null,
          message: `Sesión iniciada`,
          actions: [{ label: "OK", color: "white" }],
        });
      })
      .catch((error) => {
        console.table("error", error);
        console.table("loginObject: ", loginObject);
        notifyError(error, noti, "No se pudo iniciar sesión");
      });
  }*/
  return {
    loggedUser,
    loggedUserUi,
    removeLoggedUser,
    logout,
    login,
    authorize,
    checkLocalAuthorization,
    mockUser,
    offlineTesting,
  };
});
