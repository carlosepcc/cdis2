import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
import generatePdf from "src/composables/usePrint";
export const useConclusionStore = defineStore("conclusion", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.conclusion;
  const array = ref([]);
  const arrayUi = computed(() => {
    array.value.forEach((item) => {
      item.atenuantes = item.atenuantes?.split("");
      item.agravantes = item.agravantes?.split("");
    });
    return array.value;
  });
  //Functions

  function refresh() {
    console.log("Refreshing conclusions list");
    apiStore.read(url, array);
  }
  function update(obj) {
    let dto = obj;
    /*Sructure {
      id: 0,
      fault: "string",
      date: "2022-11-29",
      qualification: "string",
      sanction: "string",
      sanctionInciso: "string",
      atenuantes: "string",
      agravantes: "string",
      prescription: 0,
      recordRevision: "string",
    };*/
    let atenuantesString = "";
    let agravantesString = "";

    dto.atenuantes.forEach((v) => (atenuantesString += v));
    dto.agravantes.forEach((v) => (agravantesString += v));
    dto.atenuantes = atenuantesString;
    dto.agravantes = agravantesString;
    return apiStore.save(obj, url, true, array);
  }

  // Print

  function print(obj) {
    let c = {
      id: 0,
      fault: "string",
      date: "2022-11-29",
      qualification: "string",
      sanction: "string",
      sanctionInciso: "string",
      atenuantes: "string",
      agravantes: "string",
      prescription: 0,
      recordRevision: "string",
      infractor: {
        id: 0,
        name: "string",
        username: "string",
        position: "string",
        gender: "string",
        scientificCategory: "string",
        roles: ["ADMIN"],
      },
      denunciation: {
        id: 0,
        subject: "string",
        description: "string",
        date: "string",
        openDate: "2022-11-29",
        closeDate: "2022-11-29",
        endDate: "2022-11-29",
        status: "string",
        accuser: {
          id: 0,
          name: "string",
          username: "string",
          position: "string",
          gender: "string",
          scientificCategory: "string",
          roles: ["ADMIN"],
        },
        vocals: [
          {
            id: 0,
            role: "string",
            user: {
              id: 0,
              name: "string",
              username: "string",
              position: "string",
              gender: "string",
              scientificCategory: "string",
              roles: ["ADMIN"],
            },
          },
        ],
      },
      commission: {
        id: 0,
        president: {
          id: 0,
          name: "string",
          username: "string",
          position: "string",
          gender: "string",
          scientificCategory: "string",
          roles: ["ADMIN"],
        },
        secretary: {
          id: 0,
          name: "string",
          username: "string",
          position: "string",
          gender: "string",
          scientificCategory: "string",
          roles: ["ADMIN"],
        },
        blocked: true,
        busy: true,
      },
    };
    c = obj;
    //TODO: real data on export
    let documentDefinition = {
      info: {
        title: "Conclusiones de la Comisi??n Disciplinaria",
        author: "Ana del Carmen Sosa",
        subject:
          "Conclusiones de la comisi??n disciplinaria para el caso disciplinario",
        keywords: "caso disciplinario",
        creator:
          "Sistema de Gesti??n del Proceso de Comisi??n Disciplinaria en la Facultad 4",
      },
      content: [
        {
          text: "Conclusiones de la Comisi??n Disciplinaria\n",
          style: "header",
          alignment: "center",
        },
        {
          text: "Fecha: 22-11-30",
        },
        `\nLa comisi??n nombrada al efecto por el Decano de la Facultad 4, integrada por el profesor Ana del Carmen Sosa como presidente, el profesor Jos?? Hern??ndez de la Concepci??n como secretario y el estudiante Armando Paredes del Castillo como vocal de la FEU, se re??ne para iniciar la investigaci??n y an??lisis de la denuncia de la falta cometida por el estudiante ${
          c.infractor.name
        } del grupo ${c.infractor.area ?? "4301"}, consistente en la falta: ${
          c.fault ?? "Tentativa de fraude"
        } . En la investigaci??n realizada se revisaron las siguientes evidencias:\n\n`,
        {
          ol: [
            "Denuncia realizada: El estudiante implicado le falt?? el respeto a la profesora Frida Khalo durante la clase",
            "Revisi??n del expediente acad??mico, donde se resume lo siguiente: El estudiante ha sido sancionado anteriormente. Resultados docentes buenos. Su evaluaci??n de integralidad es de R.",
            "Declaraci??n del implicado: La Comisi??n Disciplinaria se entrevist?? con el estudiante, el cual, en su comparecencia, explica lo sucedido en el aula y anteriormente con la profesora y plantea que se siente mal por lo ocurrido y que querr??a pedir disculpa a la profesora.",
            "Opini??n del Profesor Gu??a: Ha incidido varias veces(...)",
          ],
        },
        `\nTeniendo en cuenta todos los elementos referidos en este an??lisis y siguiendo todos los pasos establecidos en la Resoluci??n No. 240/07, Reglamento Disciplinario para los estudiantes de la Educaci??n Superior, la comisi??n encuentra probada la responsabilidad del estudiante ante la indisciplina: ${
          c.fault ?? "Tentativa de fraude"
        }.\n\n    La comisi??n califica la falta como Grave a partir de lo establecido en el Cap??tulo III, Art??culo 7, Inciso a, de la Resoluci??n No. 240/07, consistente en:\n    a) Descripci??n del inciso.  (ToDo).\n\n    Seg??n los contenidos que aparecen en el Cap??tulo IX, Art??culo 34 y atendiendo a su trayectoria como estudiante de nuestro centro se le reconoce lo siguiente:\n\n`,
        {
          text: "Atenuantes:",
          bold: true,
        },
        {
          ul: [
            "a) Haber, mantenido una buena actitud ante el estudio desde el inicio de su especialidad hasta el momento de cometer la falta",
          ],
        },
        {
          text: "Agravantes:",
          bold: true,
        },
        {
          ul: ["b) Ser reincidente"],
        },
        {
          text: `\nTeniendo en cuenta lo aportado por las declaraciones y las verificaciones realizadas y despu??s de analizar las atenuantes y agravantes, la comisi??n acuerda proponer que al estudiante ${
            c.infractor.name
          } del grupo ${
            c.infractor.area ?? "4301"
          }, le sea impuesta como medida disciplinaria Ejemplo de inciso. Esta medida est?? dictada en el Inciso c1, Art??culo 35, Cap??tulo X (De las medidas disciplinarias imponibles) del Reglamento Disciplinario para los estudiantes de la Educaci??n Superior.\n\n    Por lo expuesto anteriormente, informamos que el acta donde comparece la medida disciplinaria como, luego de ser aprobadas por la instancia correspondiente e informadas al estudiante, se mantendr?? en el expediente acad??mico de dicho estudiante, seg??n lo establecido en el Cap??tulo X, Art??culo 37 y preescribir?? en el t??rmino de 3 cursos acad??micos, seg??n lo establecido en el Cap??tulo IV, Art??culo 14.\n\n    Dado en La Habana ___________________________________.\n\n    \n\n    Presidente _____________________________\n\n    Secretario _____________________________\n\n    FEU           _____________________________\n`,
        },
      ],
    };
    generatePdf(documentDefinition);
    console.info("The user wants to print: ", c);
  }
  return {
    array,
    url,
    refresh,
    update,
    print,
    arrayUi,
  };
});
