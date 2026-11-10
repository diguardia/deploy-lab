import { blocks } from "./blocks.mjs";
import { normalizeText, validateJsonAnswer } from "./validation.mjs";

let activeBlock = blocks[0];
let { questions, topics, storageKey } = activeBlock;
const maxPointsPerQuestion = 2;

const elements = {
  welcome: document.querySelector("#welcome-screen"),
  quiz: document.querySelector("#quiz-screen"),
  results: document.querySelector("#results-screen"),
  start: document.querySelector("#start-button"),
  resume: document.querySelector("#resume-button"),
  exit: document.querySelector("#exit-button"),
  topic: document.querySelector("#question-topic"),
  position: document.querySelector("#question-position"),
  score: document.querySelector("#score-copy"),
  progress: document.querySelector(".progress-track"),
  progressFill: document.querySelector("#progress-fill"),
  mission: document.querySelector("#question-mission"),
  title: document.querySelector("#question-title"),
  prompt: document.querySelector("#question-prompt"),
  answerArea: document.querySelector("#answer-area"),
  feedback: document.querySelector("#feedback"),
  consoleTitle: document.querySelector("#console-title"),
  console: document.querySelector("#console-output"),
  check: document.querySelector("#check-button"),
  hint: document.querySelector("#hint-button"),
  reveal: document.querySelector("#reveal-button"),
  next: document.querySelector("#next-button"),
  resultTitle: document.querySelector("#result-title"),
  resultSummary: document.querySelector("#result-summary"),
  totalPercent: document.querySelector("#total-percent"),
  scoreRing: document.querySelector("#score-ring"),
  scoreDetail: document.querySelector("#score-detail"),
  topicBars: document.querySelector("#topic-bars"),
  recommendationList: document.querySelector("#recommendation-list"),
  retryWeak: document.querySelector("#retry-weak-button"),
  restart: document.querySelector("#restart-button"),
  print: document.querySelector("#print-button")
};

const praise = ["¡Excelente!", "¡Impecable!", "¡Gran lectura!", "¡Pipeline power!", "¡Eso es!", "¡Nivel desbloqueado!", "¡Respuesta de arquitecto/a!"];

let state = freshState();

function freshState(questionIds = questions.map(({ id }) => id)) {
  return {
    questionIds,
    index: 0,
    answers: {},
    attempts: {},
    hintUsed: {},
    points: {},
    optionOrders: {},
    streak: 0,
    completed: false
  };
}

function currentQuestion() {
  const id = state.questionIds[state.index];
  return questions.find((question) => question.id === id);
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function loadSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved || !Array.isArray(saved.questionIds) || !saved.questionIds.length) return null;
    if (saved.questionIds.some((id) => !questions.some((question) => question.id === id))) return null;
    return { ...freshState(saved.questionIds), ...saved };
  } catch {
    return null;
  }
}

function showScreen(name) {
  elements.welcome.hidden = name !== "welcome";
  elements.quiz.hidden = name !== "quiz";
  elements.results.hidden = name !== "results";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startAttempt(questionIds) {
  state = freshState(questionIds);
  save();
  showScreen("quiz");
  renderQuestion();
}

function resumeAttempt() {
  const saved = loadSavedState();
  if (!saved) return;
  state = saved;
  if (state.completed) renderResults();
  else {
    showScreen("quiz");
    renderQuestion();
  }
}

function updateWelcome() {
  document.querySelector("#block-select").value = activeBlock.id;
  document.querySelector("#welcome-title").textContent = activeBlock.title;
  document.querySelector("#welcome-description").textContent = activeBlock.description;
  document.querySelector("#challenge-count").textContent = questions.length;
  document.querySelector("#topic-count").textContent = Object.keys(topics).length;
  document.querySelector("#duration").textContent = activeBlock.duration;
  document.querySelector("#active-block-label").textContent = activeBlock.label;
  const list = document.querySelector("#syllabus-list");
  list.replaceChildren();
  Object.values(topics).forEach((topic, index) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const content = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = topic.label.replace(/^\d+\. /, "");
    const detail = document.createElement("small");
    detail.textContent = topic.review;
    content.append(title, detail);
    item.append(number, content);
    list.append(item);
  });
  const saved = loadSavedState();
  elements.resume.hidden = !saved;
  if (saved) elements.resume.textContent = saved.completed ? "Ver último resultado" : `Continuar intento · ${saved.index + 1}/${saved.questionIds.length}`;
}

function renderQuestion() {
  const question = currentQuestion();
  const alreadyAnswered = Object.hasOwn(state.points, question.id);

  elements.topic.textContent = topics[question.topic].label;
  updateQuizHeader();
  elements.mission.textContent = question.mission;
  elements.title.textContent = question.title;
  elements.prompt.textContent = question.prompt;
  const lesson = document.querySelector("#question-lesson");
  lesson.hidden = !question.lesson;
  document.querySelector("#lesson-copy").textContent = question.lesson || "";
  elements.consoleTitle.textContent = question.consoleTitle;
  elements.console.textContent = question.console;
  elements.feedback.className = "feedback";
  elements.feedback.textContent = "";
  elements.check.hidden = alreadyAnswered;
  elements.hint.hidden = alreadyAnswered;
  elements.hint.disabled = Boolean(state.hintUsed[question.id]);
  elements.reveal.hidden = true;
  elements.next.hidden = !alreadyAnswered;

  renderAnswer(question, alreadyAnswered);

  if (alreadyAnswered) {
    const resultClass = state.points[question.id] > 0 ? "feedback-success" : "feedback-reveal";
    elements.feedback.classList.add(resultClass);
    showFeedback(question.explanation, state.points[question.id] > 0 ? "success" : "reveal", state.points[question.id] > 0 ? "Resuelto." : "Respuesta revisada.");
  }

  requestAnimationFrame(() => {
    const firstControl = elements.answerArea.querySelector("input, textarea, button");
    firstControl?.focus();
  });
}

function updateQuizHeader() {
  const total = state.questionIds.length;
  const answered = Object.keys(state.points).length;
  const score = Object.values(state.points).reduce((sum, value) => sum + value, 0);
  elements.position.textContent = `Desafío ${state.index + 1} de ${total}`;
  elements.score.textContent = `${score} ${score === 1 ? "punto" : "puntos"}`;
  elements.progress.setAttribute("aria-valuemax", String(total));
  elements.progress.setAttribute("aria-valuenow", String(answered));
  elements.progressFill.style.width = `${(answered / total) * 100}%`;
  document.querySelector("#streak-copy").textContent = `🔥 Racha: ${state.streak || 0}`;
  const nextMilestone = Math.min(total, Math.ceil((answered + 1) / 10) * 10);
  document.querySelector("#milestone-copy").textContent = answered === total ? "🏆 Recorrido completo" : `Próximo hito: ${nextMilestone}`;
}

function renderAnswer(question, disabled) {
  elements.answerArea.replaceChildren();

  if (question.type === "choice") {
    const group = document.createElement("div");
    group.className = "choice-list";
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", "Opciones de respuesta");
    const options = choiceOptions(question);
    options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "choice-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      input.disabled = disabled;
      input.checked = state.answers[question.id] === option;
      const marker = document.createElement("span");
      marker.className = "choice-key";
      marker.textContent = String.fromCharCode(65 + optionIndex);
      const text = document.createElement("span");
      text.textContent = option;
      label.append(input, marker, text);
      group.append(label);
    });
    elements.answerArea.append(group);
    return;
  }

  if (question.type === "sequence") {
    const list = document.createElement("ol");
    list.className = "sequence-list";
    list.setAttribute("aria-label", "Orden de pasos");
    const savedOrder = state.answers[question.id];
    const items = Array.isArray(savedOrder) ? savedOrder : [...question.shuffled];
    state.answers[question.id] = items;
    items.forEach((item, itemIndex) => {
      const row = document.createElement("li");
      row.dataset.item = item;
      const text = document.createElement("span");
      text.textContent = item;
      const controls = document.createElement("span");
      controls.className = "sequence-controls";
      const up = document.createElement("button");
      up.type = "button";
      up.className = "move-button";
      up.textContent = "↑";
      up.setAttribute("aria-label", `Subir ${item}`);
      up.disabled = disabled || itemIndex === 0;
      up.addEventListener("click", () => moveSequenceItem(itemIndex, -1));
      const down = document.createElement("button");
      down.type = "button";
      down.className = "move-button";
      down.textContent = "↓";
      down.setAttribute("aria-label", `Bajar ${item}`);
      down.disabled = disabled || itemIndex === items.length - 1;
      down.addEventListener("click", () => moveSequenceItem(itemIndex, 1));
      controls.append(up, down);
      row.append(text, controls);
      list.append(row);
    });
    elements.answerArea.append(list);
    return;
  }

  const terminalInput = document.createElement("div");
  terminalInput.className = question.type === "json" ? "editor-input" : "terminal-input";
  const label = document.createElement("label");
  label.htmlFor = "answer-input";
  label.className = "visually-hidden";
  label.textContent = question.type === "json" ? "Objeto JSON" : "Comando o respuesta";
  const prompt = document.createElement("span");
  prompt.className = "input-prompt";
  prompt.textContent = question.type === "json" ? "JSON" : "$";
  const input = document.createElement(question.type === "json" ? "textarea" : "input");
  input.id = "answer-input";
  input.disabled = disabled;
  input.placeholder = question.placeholder || "Escribí tu respuesta…";
  input.spellcheck = false;
  input.autocomplete = "off";
  input.value = typeof state.answers[question.id] === "string" ? state.answers[question.id] : "";
  if (question.type !== "json") {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") checkAnswer();
    });
  }
  terminalInput.append(label, prompt, input);
  elements.answerArea.append(terminalInput);
}

function choiceOptions(question) {
  const savedOrder = state.optionOrders?.[question.id];
  if (Array.isArray(savedOrder)
    && savedOrder.length === question.options.length
    && savedOrder.every(option => question.options.includes(option))) {
    return savedOrder;
  }

  const shuffled = [...question.options];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  state.optionOrders ??= {};
  state.optionOrders[question.id] = shuffled;
  save();
  return shuffled;
}

function moveSequenceItem(index, direction) {
  const question = currentQuestion();
  const items = [...state.answers[question.id]];
  const target = index + direction;
  [items[index], items[target]] = [items[target], items[index]];
  state.answers[question.id] = items;
  save();
  renderAnswer(question, false);
  const movedButtonIndex = Math.max(0, Math.min(items.length - 1, target));
  elements.answerArea.querySelectorAll(".sequence-list li")[movedButtonIndex]?.focus?.();
}

function readAnswer(question) {
  if (question.type === "choice") return elements.answerArea.querySelector("input:checked")?.value || "";
  if (question.type === "sequence") return state.answers[question.id];
  return elements.answerArea.querySelector("#answer-input")?.value || "";
}

function evaluateAnswer(question, answer) {
  if (question.type === "json") return validateJsonAnswer(answer, question.expected);
  if (question.type === "choice") return { correct: answer === question.answer, message: "" };
  if (question.type === "terminal") {
    return {
      correct: question.answers.map(normalizeText).includes(normalizeText(answer)),
      message: ""
    };
  }
  if (question.type === "sequence") {
    return {
      correct: question.items.every((item, index) => answer[index] === item),
      message: ""
    };
  }
  return { correct: false, message: "" };
}

function checkAnswer() {
  const question = currentQuestion();
  const answer = readAnswer(question);
  if (!answer || (Array.isArray(answer) && !answer.length)) {
    showFeedback("Necesitás ingresar o seleccionar una respuesta.", "error");
    return;
  }

  state.answers[question.id] = answer;
  state.attempts[question.id] = (state.attempts[question.id] || 0) + 1;
  const evaluation = evaluateAnswer(question, answer);

  if (evaluation.correct) {
    const fullPoints = state.attempts[question.id] === 1 && !state.hintUsed[question.id];
    state.points[question.id] = fullPoints ? 2 : 1;
    state.streak = (state.streak || 0) + 1;
    save();
    updateQuizHeader();
    elements.console.textContent += `\n\n✓ desafío resuelto`;
    const heading = fullPoints ? `${praise[Math.floor(Math.random() * praise.length)]} +2 puntos` : "¡Bien remontado! +1 punto";
    showFeedback(question.explanation, "success", heading);
    celebrate(Object.keys(state.points).length % 10 === 0 ? "milestone" : "success");
    lockQuestion();
    return;
  }

  state.streak = 0;
  save();
  elements.console.textContent += `\n\n✗ la verificación encontró un problema`;
  const message = evaluation.message
    || "Todavía no coincide con el comportamiento esperado. Leé nuevamente el contexto y probá otra vez.";
  showFeedback(message, "error", "La prueba falló.");
  if (state.attempts[question.id] >= 2) elements.reveal.hidden = false;
}

function showFeedback(message, kind, heading = "") {
  elements.feedback.className = `feedback feedback-${kind}`;
  elements.feedback.replaceChildren();
  if (heading) {
    const strong = document.createElement("strong");
    strong.textContent = heading;
    elements.feedback.append(strong);
  }
  const span = document.createElement("span");
  span.textContent = message;
  elements.feedback.append(span);
}

function useHint() {
  const question = currentQuestion();
  state.hintUsed[question.id] = true;
  save();
  showFeedback(question.hint, "hint", "Pista");
  elements.hint.disabled = true;
}

function revealAnswer() {
  const question = currentQuestion();
  state.points[question.id] = 0;
  state.streak = 0;
  save();
  updateQuizHeader();
  showFeedback(question.explanation, "reveal", "Respuesta revisada.");
  lockQuestion();
}

function celebrate(kind) {
  const layer = document.querySelector("#celebration-layer");
  if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const count = kind === "milestone" ? 42 : 16;
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("i");
    piece.style.setProperty("--x", `${Math.random() * 100}vw`);
    piece.style.setProperty("--delay", `${Math.random() * 180}ms`);
    piece.style.setProperty("--hue", `${Math.floor(Math.random() * 360)}`);
    layer.append(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

function lockQuestion() {
  elements.check.hidden = true;
  elements.hint.hidden = true;
  elements.reveal.hidden = true;
  elements.next.hidden = false;
  renderAnswer(currentQuestion(), true);
  elements.next.focus();
}

function nextQuestion() {
  if (state.index < state.questionIds.length - 1) {
    state.index += 1;
    save();
    renderQuestion();
    return;
  }
  state.completed = true;
  save();
  renderResults();
}

function topicResults() {
  return Object.fromEntries(Object.keys(topics).map((topicId) => {
    const topicQuestionIds = state.questionIds.filter((id) => questions.find((question) => question.id === id)?.topic === topicId);
    const earned = topicQuestionIds.reduce((sum, id) => sum + (state.points[id] || 0), 0);
    const maximum = topicQuestionIds.length * maxPointsPerQuestion;
    return [topicId, { earned, maximum, percent: maximum ? Math.round((earned / maximum) * 100) : null }];
  }));
}

function renderResults() {
  showScreen("results");
  const earned = Object.values(state.points).reduce((sum, value) => sum + value, 0);
  const maximum = state.questionIds.length * maxPointsPerQuestion;
  const percent = Math.round((earned / maximum) * 100);
  const perTopic = topicResults();
  celebrate("milestone");

  let title = "Tenés una base para seguir construyendo";
  let summary = "El diagnóstico señaló algunos conceptos para reforzar. No es una nota: es un mapa para decidir dónde practicar.";
  if (percent >= 85) {
    title = "Tu base técnica está muy firme";
    summary = "Resolviste la mayoría de las situaciones sin ayuda. Concentrate ahora en explicar tus decisiones y conectarlas entre sí.";
  } else if (percent >= 65) {
    title = "La base está encaminada";
    summary = "Dominás buena parte del recorrido. Un repaso focalizado puede convertir las dudas puntuales en decisiones seguras.";
  }

  elements.resultTitle.textContent = title;
  elements.resultSummary.textContent = summary;
  elements.totalPercent.textContent = `${percent}%`;
  elements.scoreRing.style.setProperty("--score-angle", `${percent * 3.6}deg`);
  elements.scoreDetail.textContent = `${earned} de ${maximum} puntos de dominio`;
  elements.topicBars.replaceChildren();

  Object.entries(perTopic).forEach(([topicId, result]) => {
    if (result.percent === null) return;
    const row = document.createElement("div");
    row.className = "topic-result-row";
    row.innerHTML = `
      <div class="topic-result-heading"><span>${topics[topicId].label}</span><strong>${result.percent}%</strong></div>
      <div class="topic-track" role="progressbar" aria-label="${topics[topicId].label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${result.percent}">
        <span style="width:${result.percent}%"></span>
      </div>`;
    elements.topicBars.append(row);
  });

  const ranked = Object.entries(perTopic)
    .filter(([, result]) => result.percent !== null)
    .sort((a, b) => a[1].percent - b[1].percent);
  elements.recommendationList.replaceChildren();
  ranked.slice(0, 2).forEach(([topicId, result], index) => {
    const item = document.createElement("article");
    item.className = "recommendation-item";
    item.innerHTML = `<span>0${index + 1}</span><div><strong>${topics[topicId].label} · ${result.percent}%</strong><p>${topics[topicId].review}</p></div>`;
    elements.recommendationList.append(item);
  });

  elements.retryWeak.hidden = !ranked.some(([, result]) => result.percent < 75);
}

function retryWeakTopics() {
  const weakTopics = Object.entries(topicResults())
    .filter(([, result]) => result.percent !== null && result.percent < 75)
    .map(([topicId]) => topicId);
  const ids = questions.filter((question) => weakTopics.includes(question.topic)).map(({ id }) => id);
  startAttempt(ids.length ? ids : questions.map(({ id }) => id));
}

function exitQuiz() {
  if (!elements.quiz.hidden) state.answers[currentQuestion().id] = readAnswer(currentQuestion());
  save();
  showScreen("welcome");
  updateWelcome();
}

elements.start.addEventListener("click", () => startAttempt(questions.map(({ id }) => id)));
elements.resume.addEventListener("click", resumeAttempt);
elements.exit.addEventListener("click", exitQuiz);
elements.check.addEventListener("click", checkAnswer);
elements.hint.addEventListener("click", useHint);
elements.reveal.addEventListener("click", revealAnswer);
elements.next.addEventListener("click", nextQuestion);
elements.retryWeak.addEventListener("click", retryWeakTopics);
elements.restart.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  startAttempt(questions.map(({ id }) => id));
});
elements.print.addEventListener("click", () => window.print());
document.querySelector("#blocks-button").addEventListener("click", exitQuiz);
document.querySelector("#block-select").addEventListener("change", (event) => {
  activeBlock = blocks.find(block => block.id === event.target.value);
  ({ questions, topics, storageKey } = activeBlock);
  state = freshState();
  updateWelcome();
});

updateWelcome();
