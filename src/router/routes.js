const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Inicio",
        path: "",
        component: () => import("pages/PageIndex.vue"),
      },
      {
        name: "Resoluciones",
        path: "/resolutions",
        component: () => import("pages/ListPages/PageResolutions.vue"),
      },
      {
        name: "Comisiones Disciplinarias",
        path: "/commissions",
        component: () => import("pages/ListPages/PageCommissions.vue"),
      },
      {
        name: "Denuncias",
        path: "/denunciations",
        component: () => import("pages/ListPages/PageDenunciations.vue"),
      },
      {
        name: "Usuarios",
        path: "/users",
        component: () => import("pages/ListPages/PageUsers.vue"),
      },
      {
        name: "Roles",
        path: "/roles",
        component: () => import("pages/ListPages/PageRoles.vue"),
      },
      {
        name: "Casos disciplinarios",
        path: "/cases",
        component: () => import("pages/ListPages/PageCases.vue"),
      },
      {
        name: "Conclusiones",
        path: "/conclusions",
        component: () => import("pages/ListPages/PageConclusions.vue"),
      },
      {
        name: "Declaraciones",
        path: "/declaraciones",
        component: () => import("pages/ListPages/PageDeclaraciones.vue"),
      },
      {
        name: "Imprimir",
        path: "/print",
        component: () => import("pages/PageExport.vue"),
      },
      {
        name: "Ayuda",
        path: "/help",
        component: () => import("pages/PageHelp.vue"),
      },
      {
        name: "Acerca de",
        path: "/about",
        component: () => import("pages/PageAbout.vue"),
      },
      {
        name: "Ajustes",
        path: "/settings",
        component: () => import("pages/PageSettings.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    name: "404",
    path: "/:catchAll(.*)*",
    component: () => import("pages/PageError404.vue"),
  },
];

export default routes;
