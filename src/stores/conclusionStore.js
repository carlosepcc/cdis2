import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
import print from "src/composables/usePrint";
export const useConclusionStore = defineStore("conclusion", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.conclusion;
  const array = ref([]);

  //Functions

  function refresh() {
    console.log("Refreshing conclusions list");
    apiStore.read(url, array);
  }
  function update(obj) {
    return apiStore.save(obj, url, true, array);
  }

  // Print

  function print(obj) {
    let c = obj;

    let documentDefinition = {
      info: {
        title: "Conclusiones de la Comisión Disciplinaria",
        author: presidenteComision.value.name,
        subject:
          "Conclusiones de la comisión disciplinaria para el caso disciplinario",
        keywords: "caso disciplinario, conclusion, comision disciplinaria",
        creator:
          "Sistema de Gestión para el Proceso de Comisión Disciplinaria de la Facultad 4 (CDIS)",
      },
      userPassword: "f4",
      ownerPassword: "owner",
      // a string or { width: number, height: number }
      pageSize: "A4",

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: "Conclusiones de la Comisión Disciplinaria\n",
          style: "header",
          alignment: "center",
        },
        { text: `Fecha: ${c.value.date}` },
        `\nLa comisión nombrada al efecto por el Decano de la Facultad 4, integrada por ${integrantesHtml.value}, se reúne para iniciar la investigación y análisis de la denuncia de la falta cometida por el ${c.value.implicado.cargo} ${c.value.implicado.name} del grupo ${c.value.implicado.grupo}, consistente en la falta: ${c.value.falta}. En la investigación realizada se revisaron las siguientes evidencias:\n\n`,
        { ol: listaEvidenciasPdfMake.value },
        `\nTeniendo en cuenta todos los elementos referidos en este análisis y siguiendo todos los pasos establecidos en la Resolución No. 240/07, Reglamento Disciplinario para los estudiantes de la Educación Superior, la comisión encuentra probada la responsabilidad del estudiante ante la indisciplina: ${
          c.value.falta
        }.\n
    La comisión califica la falta como ${
      c.value.calificacion.text
    } a partir de lo establecido en el Capítulo III, Artículo ${
          c.value.calificacion.article
        }, Inciso ${
          c.value.calificacion.inciso
        }, de la Resolución No. 240/07, consistente en:
    ${c.value.calificacion.inciso}) ${incisoToDescription(
          c.value.calificacion.article,
          c.value.calificacion.inciso
        )}.\n
    Según los contenidos que aparecen en el Capítulo IX, Artículo 34 y atendiendo a su trayectoria como estudiante de nuestro centro se le reconoce lo siguiente:\n\n`,
        { text: "Atenuantes:", bold: true },
        { ul: listaAtenuantesPdfMake.value },
        { text: "Agravantes:", bold: true },
        { ul: listaAgravantesPdfMake.value },
        {
          text: `\nTeniendo en cuenta lo aportado por las declaraciones y las verificaciones realizadas y después de analizar las atenuantes y agravantes, la comisión acuerda proponer que al ${c.value.implicado.cargo} ${c.value.implicado.name} del grupo ${c.value.implicado.grupo}, le sea impuesta como medida disciplinaria ${c.value.medida.text}. Esta medida está dictada en el Inciso ${c.value.medida.inciso}, Artículo ${c.value.medida.article}, Capítulo X (De las medidas disciplinarias imponibles) del Reglamento Disciplinario para los estudiantes de la Educación Superior.\n
    Por lo expuesto anteriormente, informamos que el acta donde comparece la medida disciplinaria como, luego de ser aprobadas por la instancia correspondiente e informadas al estudiante, se mantendrá en el expediente académico de dicho estudiante, según lo establecido en el Capítulo X, Artículo 37 y preescribirá en el término de ${c.value.prescribeEn} cursos académicos, según lo establecido en el Capítulo IV, Artículo 14.\n
    Dado en La Habana ___________________________________.\n
    \n
    Presidente _____________________________\n
    Secretario _____________________________\n
    FEU           _____________________________\n`,
        },
      ],
      // header: 'Universidad de las Ciencias Informáticas.\nFacultad 4.',
      // footer: {
      //   text: 'Universidad de las Ciencias Informáticas\nCarretera San Antonio Km 2 ½ Torrens. Boyeros. La Habana.Cuba.', alignment: 'right'
      // },
      defaultStyle: {
        fontSize: 12,
        alignment: "justify",
        lineHeight: 1.5,
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 15,
          bold: true,
        },
        strong: {
          bold: true,
        },
      },
    };
    print(documentDefinition);
    console.info("The user wants to print: ", obj);
  }
  return {
    array,
    url,
    refresh,
    update,
    print,
  };
});
