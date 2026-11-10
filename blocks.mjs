import { questions as classQuestions, topics as classTopics } from "./questions.mjs";
import { questions as botQuestions, topics as botTopics } from "./bot-questions.mjs";
import { questions as vercelQuestions, topics as vercelTopics } from "./vercel-questions.mjs";

export const blocks = [
  {
    id: "classes", label: "Clases 1–4 · Fundamentos", storageKey: "deploy-lab-progress-v2",
    title: "¿Está listo tu entorno para desplegar?",
    description: "Resolvé misiones breves en una consola simulada. Podés equivocarte, pedir pistas y volver a probar: el objetivo es descubrir qué ya dominás y qué conviene repasar.",
    duration: "30′", questions: classQuestions, topics: classTopics
  },
  {
    id: "bot", label: "Bot de casas · Leer y comprender el repo", storageKey: "deploy-lab-bot-progress-v1",
    title: "Entendé el bot, paso a paso.",
    description: "Aprendé a leer bot-casas-ejemplo: primero las herramientas y los datos, después la lógica y HTTP. Cada desafío trae una explicación previa y fragmentos del repo; no necesitás tener el bot ejecutándose. Podés hacer el recorrido en varias sesiones.",
    duration: "45–60′", questions: botQuestions, topics: botTopics
  },
  {
    id: "vercel", label: "Vercel + GitHub Actions · CI/CD Quest", storageKey: "deploy-lab-vercel-progress-v1",
    title: "De commit a Production: la gran misión.",
    description: "Superá 50 desafíos en 10 misiones: construí el modelo mental, armá la pipeline, protegé secretos y resolvé incidentes. Las rachas, hitos y celebraciones acompañan tu avance.",
    duration: "75–90′", questions: vercelQuestions, topics: vercelTopics
  }
];
