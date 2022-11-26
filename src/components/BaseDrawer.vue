<script setup>
import DrawerItem from "components/DrawerItem.vue";
import { ref } from "vue";
import { useAuthStore } from "src/stores/authStore";
import state, { userHasPermission } from "src/composables/useState.js";
import r from "src/composables/useRoles";
const auth = useAuthStore();
// DRAWER
const miniState = ref(true);

const drawerItems = [
  { title: "Inicio", icon: "home", alt: "n", to: "/" },

  {
    title: "Denuncias",
    icon: "r_announcement",
    to: "denunciations",
    for: [r.user],
  },
  {
    title: "Comisiones Disciplinarias",
    icon: "r_admin_panel_settings",
    to: "commissions",
    for: [r.dec],
  },
  {
    title: "Usuarios",
    icon: "r_manage_accounts",
    to: "users",
    for: [r.adm],
  },
  {
    title: "Declaraciones",
    icon: "r_chat",
    to: "declarations",
    for: [r.user, r.pres, r.sec],
  },
  {
    title: "Casos",
    icon: "r_assignment_ind",
    to: "cases",
    for: [r.dec, r.pre, r.sec, r.voc],
  },
  {
    title: "Conclusiones",
    icon: "r_article",
    to: "conclusions",
    for: [r.pre, r.sec, r.dec],
  },
  {
    title: "Resoluciones",
    icon: "r_article",
    to: "resolutions",
    for: [r.dec],
  },

  { title: "Ajustes", icon: "settings", to: "settings", separate: true },
  { title: "Ayuda", icon: "help", to: "help" },
  { title: "Acerca de CDIS", icon: "info", to: "about" },
];
</script>

<template>
  <!--MENU LATERAL (DRAWER "gaveta") -->
  <q-drawer
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    mini-to-overlay
    :breakpoint="500"
    bordered
    side="left"
  >
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="drawerItem in drawerItems" :key="drawerItem.title">
          <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <!--v-if="
                drawerItem.for == undefined ||
                (state.loggedUser
                  ? state.loggedUser.permisos.some((iPermisoObject) =>
                      drawerItem.for.includes(iPermisoObject.permiso)
                    )
                  : false) /*si el item del drawer no tiene for, o el arreglo de permisos del usuario autenticado tiene algún permiso en común con el arreglo fors del item, se muestra, de lo contrario no.*/
              "

              v-if="
                drawerItem.for == undefined ||
                (state.loggedUser
                  ? state.loggedUser.permisos.some((iPermisoObject) =>
                      drawerItem.for === iPermisoObject.permiso
                    )
                  : false) //TODO /*si el item del drawer no tiene for, o el arreglo de permisos del usuario autenticado tiene algún permiso en común con el arreglo fors del item, se muestra, de lo contrario no.*/
              "-->
            <DrawerItem
              v-bind="drawerItem"
              v-if="
                drawerItem.for === undefined ||
                auth.offlineTesting ||
                auth.loggedUser?.roles[1] === r.adm ||
                auth.loggedUser?.roles.some((rol) => drawerItem.for === rol)
              "
            />
            <!-- TODO si el item del drawer no tiene for, o el arreglo de permisos del usuario autenticado tiene algún permiso en común con el arreglo fors del item, se muestra, de lo contrario no. -->
          </transition-group>
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>
