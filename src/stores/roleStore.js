import { defineStore } from "pinia";
import roles from "src/composables/useRoles";

export const useRoleStore = defineStore("role", () => {
  const array = [
    roles.adm,
    roles.dec,
    roles.pre,
    roles.sec,
    roles.voc,
    roles.user,
  ];
});
