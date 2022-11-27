// RESOLUCIÓN No 240 /07  Reglamento disciplinario para los estudiantes de la educación superior
const res = {
  atenuantes: [
    {
      inciso: "a",
      text: "Haber mantenido una buena actitud ante el estudio desde el inicio de su especialidad hasta el momento de cometer la falta",
    },
    {
      inciso: "b",
      text: "Haberse declarado autor del hecho cometido antes de que se produzca la denunciation correspondiente",
    },
    {
      inciso: "c",
      text: "Reconocer su responsabilidad en la primera comparecencia ante la ComisiónDisciplinaria",
    },
    {
      inciso: "d",
      text: "Adoptar una actitud autocrítica y consecuente ante la falta cometida",
    },
    {
      inciso: "e",
      text: "Contribuir al total esclarecimiento de los hechos por todos los medios a su alcance",
    },
  ],
  agravantes: [
    {
      inciso: "a",
      text: "Haber mantenido una mala actitud en relación con el estudio antes de la comisión de la falta. En este sentido se tomarán como criterios principales los que corresponden al colectivo estudiantil y al profesor guía",
    },
    {
      inciso: "b",
      text: "Ser reincidente",
    },
  ],
  faultQualifications: ["Muy Grave", "Grave", "Menos Grave"],
};
export function incisoToDescription(article = 3, inciso = "a") {
  return "Descripción del inciso.  (ToDo)"; //TODO
}
export default res;
