export const topics = {
  deployment: {
    label: "Entornos y despliegue",
    shortLabel: "Despliegue",
    review: "Repasá desarrollo, preview y producción; después explicá por qué automatizar reduce errores humanos."
  },
  modeling: {
    label: "Reglas y JSON",
    shortLabel: "Reglas y JSON",
    review: "Volvé al contrato del juego: qué recibe una jugada, qué devuelve y cómo se codifican las direcciones."
  },
  npm: {
    label: "Node.js y npm",
    shortLabel: "Node.js y npm",
    review: "Reconstruí una instalación limpia y compará package.json, package-lock.json y node_modules."
  },
  http: {
    label: "HTTP y Express",
    shortLabel: "HTTP y Express",
    review: "Dibujá el recorrido motor → endpoint → estrategia → respuesta y asigná una responsabilidad a cada parte."
  }
};

export const questions = [
  {
    id: "deploy-environment",
    topic: "deployment",
    type: "choice",
    mission: "Elegir el entorno",
    title: "Una versión candidata necesita validación",
    prompt: "El equipo quiere revisar integración, configuración y experiencia antes de liberar a usuarios reales. ¿En qué entorno debería hacerlo?",
    consoleTitle: "pipeline.log",
    console: "commit 8e4c2b1 detectado\n✓ build finalizado\n? destino pendiente\nproducción todavía no fue modificada",
    options: ["Desarrollo", "Preview / staging", "Producción", "node_modules"],
    answer: "Preview / staging",
    hint: "Es el entorno intermedio entre desarrollo y producción.",
    explanation: "Preview o staging permite validar una versión candidata sin afectar a los usuarios de producción."
  },
  {
    id: "deploy-automation",
    topic: "deployment",
    type: "choice",
    mission: "Reducir el riesgo",
    title: "El mismo despliegue debe repetirse muchas veces",
    prompt: "¿Cuál es la principal ventaja de reemplazar una lista de pasos manuales por un script de despliegue?",
    consoleTitle: "deploy-checklist.txt",
    console: "1. copiar archivos\n2. instalar dependencias\n3. reiniciar servicio\n4. comprobar respuesta\n\nTres personas ejecutan esta lista de forma diferente.",
    options: [
      "Elimina la necesidad de probar",
      "Hace el proceso repetible y reduce errores humanos",
      "Convierte automáticamente desarrollo en producción",
      "Evita usar control de versiones"
    ],
    answer: "Hace el proceso repetible y reduce errores humanos",
    hint: "Pensá qué ocurre cuando distintas personas siguen la misma receta a mano.",
    explanation: "La automatización estandariza los pasos, reduce variaciones humanas y facilita agregar verificaciones automáticas."
  },
  {
    id: "deploy-node-version",
    topic: "deployment",
    type: "terminal",
    mission: "Diagnosticar el entorno",
    title: "Comprobá que Node.js esté disponible",
    prompt: "Escribí el comando usado para consultar la versión instalada de Node.js.",
    consoleTitle: "terminal",
    console: "Windows PowerShell\nDirectorio: casas-en-disputa\n\nEl entorno todavía no fue verificado.",
    answers: ["node --version", "node -v"],
    placeholder: "node …",
    hint: "El ejecutable es node. La opción larga comienza con dos guiones.",
    explanation: "node --version confirma que Node.js responde. Si no se reconoce, hay que revisar la instalación o PATH y reabrir la terminal."
  },
  {
    id: "deploy-lifecycle",
    topic: "deployment",
    type: "sequence",
    mission: "Ordenar el proceso",
    title: "Reconstruí el ciclo de vida",
    prompt: "Ordená las etapas desde la idea inicial hasta la operación posterior al lanzamiento.",
    consoleTitle: "lifecycle.yml",
    console: "stages:\n  - ???\n\nEl pipeline necesita un orden coherente.",
    items: ["Planificación", "Diseño", "Desarrollo", "Pruebas", "Despliegue", "Mantenimiento"],
    shuffled: ["Pruebas", "Planificación", "Mantenimiento", "Diseño", "Despliegue", "Desarrollo"],
    hint: "Primero se decide qué construir; después se diseña y desarrolla. El mantenimiento ocurre cuando ya se desplegó.",
    explanation: "El orden trabajado fue planificación, diseño, desarrollo, pruebas, despliegue y mantenimiento."
  },
  {
    id: "model-move-contract",
    topic: "modeling",
    type: "choice",
    mission: "Leer el contrato",
    title: "El árbitro espera una jugada",
    prompt: "¿Qué recibe y qué devuelve el bot cuando debe decidir su movimiento?",
    consoleTitle: "game-contract.txt",
    console: "entrada  → bot → salida\n   ?                ?",
    options: [
      "Recibe una dirección y devuelve el tablero",
      "Recibe el estado y devuelve pieceId más direction",
      "Recibe un jugador y modifica el estado original",
      "Recibe una casa y devuelve un turno completo"
    ],
    answer: "Recibe el estado y devuelve pieceId más direction",
    hint: "La entrada describe todo lo necesario para decidir; la salida es una sola acción.",
    explanation: "La jugada recibe el estado o tablero y devuelve la pieza elegida junto con una dirección. El motor valida y aplica la decisión."
  },
  {
    id: "model-west",
    topic: "modeling",
    type: "terminal",
    mission: "Codificar una dirección",
    title: "Mové la pieza hacia el oeste",
    prompt: "Escribí la letra válida para representar oeste según el contrato acordado.",
    consoleTitle: "movement.json",
    console: "{\n  \"pieceId\": \"A1\",\n  \"direction\": \"?\"\n}",
    answers: ["o"],
    placeholder: "una letra",
    hint: "Se usa la inicial en español, no la W del inglés.",
    explanation: "Las direcciones válidas son N, S, E y O; por eso oeste se representa con O."
  },
  {
    id: "model-json",
    topic: "modeling",
    type: "json",
    mission: "Completar una respuesta",
    title: "Devolvé un movimiento válido",
    prompt: "Escribí un objeto JSON cuya pieza sea A1 y cuya dirección sea N. El orden de las propiedades no importa.",
    consoleTitle: "response-body.json",
    console: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n// falta el cuerpo de la respuesta",
    expected: { pieceId: "A1", direction: "N" },
    placeholder: "Escribí acá un objeto JSON válido…",
    hint: "JSON exige comillas dobles en los nombres y en los valores de texto.",
    explanation: "Una respuesta válida es {\"pieceId\":\"A1\",\"direction\":\"N\"}. JSON usa claves y textos entre comillas dobles."
  },
  {
    id: "model-referee",
    topic: "modeling",
    type: "choice",
    mission: "Separar responsabilidades",
    title: "¿Quién modifica el tablero?",
    prompt: "El bot devuelve una decisión. ¿Qué componente debe validarla y aplicarla sobre el estado del juego?",
    consoleTitle: "turn.log",
    console: "bot → { pieceId: \"A1\", direction: \"N\" }\n\nLa decisión todavía no fue aplicada.",
    options: ["La estrategia del bot", "El árbitro o motor", "package.json", "El navegador"],
    answer: "El árbitro o motor",
    hint: "Es el componente que pasa los turnos, evita trampas y ejecuta jugadas válidas.",
    explanation: "El bot propone una jugada; el árbitro o motor controla las reglas, la valida y recién entonces modifica el estado."
  },
  {
    id: "npm-files",
    topic: "npm",
    type: "choice",
    mission: "Reconstruir una instalación",
    title: "Elegí qué debe versionarse",
    prompt: "¿Qué combinación permite declarar dependencias y repetir su resolución sin subir miles de archivos instalados?",
    consoleTitle: "git-status.txt",
    console: "Archivos del proyecto:\n  package.json\n  package-lock.json\n  node_modules/\n\n¿cuáles van al repositorio?",
    options: [
      "Solo node_modules",
      "package.json y package-lock.json",
      "package-lock.json y node_modules",
      "Los tres elementos"
    ],
    answer: "package.json y package-lock.json",
    hint: "Los paquetes instalados pueden reconstruirse y suelen ocupar mucho espacio.",
    explanation: "Se versionan package.json y package-lock.json. node_modules se excluye porque se reconstruye mediante npm."
  },
  {
    id: "npm-semver",
    topic: "npm",
    type: "choice",
    mission: "Interpretar una versión",
    title: "Leé el rango ^5.1.0",
    prompt: "¿Qué actualizaciones acepta este rango de versión para una dependencia?",
    consoleTitle: "package.json",
    console: "{\n  \"dependencies\": {\n    \"express\": \"^5.1.0\"\n  }\n}",
    options: [
      "Únicamente 5.1.0",
      "Versiones compatibles dentro de 5.x.x",
      "Solo versiones 5.1.x",
      "Cualquier versión futura"
    ],
    answer: "Versiones compatibles dentro de 5.x.x",
    hint: "El símbolo ^ conserva la versión mayor indicada.",
    explanation: "^5.1.0 acepta cambios compatibles dentro de la versión mayor 5; ~5.1.0 limitaría los cambios al menor 5.1.x."
  },
  {
    id: "npm-ci",
    topic: "npm",
    type: "terminal",
    mission: "Instalar de forma reproducible",
    title: "Prepará una copia limpia del proyecto",
    prompt: "package.json y package-lock.json ya coinciden. Escribí el comando que instala exactamente el árbol fijado por el lockfile.",
    consoleTitle: "terminal",
    console: "$ git clone casas-en-disputa\nCloning into 'casas-en-disputa'...\n$ cd casas-en-disputa\n\nFalta instalar las dependencias.",
    answers: ["npm ci"],
    placeholder: "npm …",
    hint: "Se usa en CI, copias limpias y despliegues. Tiene dos letras después de npm.",
    explanation: "npm ci elimina node_modules, exige coherencia entre los archivos de paquete e instala exactamente desde el lockfile."
  },
  {
    id: "npm-script-args",
    topic: "npm",
    type: "terminal",
    mission: "Reenviar argumentos",
    title: "Ejecutá el diagnóstico con un argumento",
    prompt: "Existe el script diagnostico. Escribí el comando npm que lo ejecuta y hace llegar la palabra prueba a process.argv.",
    consoleTitle: "package.json",
    console: "{\n  \"scripts\": {\n    \"diagnostico\": \"node diagnostico.js\"\n  }\n}",
    answers: ["npm run diagnostico -- prueba"],
    placeholder: "npm run …",
    hint: "Los argumentos del programa se escriben después de un separador formado por dos guiones.",
    explanation: "npm run diagnostico -- prueba ejecuta el script y reenvía lo que sigue a -- hacia process.argv."
  },
  {
    id: "http-route",
    topic: "http",
    type: "terminal",
    mission: "Usar el endpoint",
    title: "Pedí un movimiento al bot",
    prompt: "Escribí el método HTTP y la ruta que utiliza el motor para enviar el estado al bot.",
    consoleTitle: "server.log",
    console: "Servidor escuchando en http://localhost:3000\nEsperando una solicitud con el estado del juego…",
    answers: ["post /move", "post /move/"],
    placeholder: "MÉTODO /ruta",
    hint: "El estado viaja en el body; no es una consulta GET.",
    explanation: "El contrato del bot recibe el estado mediante POST /move y devuelve un movimiento en la respuesta."
  },
  {
    id: "http-json-middleware",
    topic: "http",
    type: "choice",
    mission: "Interpretar el body",
    title: "Express necesita leer JSON",
    prompt: "¿Qué configuración deja el cuerpo JSON disponible en req.body?",
    consoleTitle: "src/server.js",
    console: "import express from \"express\";\nconst app = express();\n\n// falta configurar el parser JSON",
    options: ["app.use(express.json())", "app.get(req.body)", "npm run json", "res.status(200)"],
    answer: "app.use(express.json())",
    hint: "Es un middleware provisto por Express y se registra con app.use.",
    explanation: "express.json() interpreta requests con cuerpo JSON; al registrarlo con app.use, el handler puede acceder a req.body."
  },
  {
    id: "http-invalid",
    topic: "http",
    type: "choice",
    mission: "Responder un error",
    title: "El estado recibido es inválido",
    prompt: "¿Qué código HTTP debería devolver el endpoint cuando el body no cumple el contrato?",
    consoleTitle: "request.log",
    console: "POST /move\nContent-Type: application/json\n\n{ \"turno\": null }\n\nValidación: estado incompleto",
    options: ["200", "201", "400", "500"],
    answer: "400",
    hint: "El problema está en la solicitud recibida, no en un fallo inesperado del servidor.",
    explanation: "400 indica una solicitud inválida. 500 se reserva para errores inesperados del servidor."
  },
  {
    id: "http-flow",
    topic: "http",
    type: "sequence",
    mission: "Seguir la solicitud",
    title: "Ordená el recorrido de POST /move",
    prompt: "Colocá cada paso desde que llega la solicitud hasta que el motor recibe la decisión.",
    consoleTitle: "request-trace.log",
    console: "POST /move iniciado\ntrace_id=game-042\n\nEl recorrido todavía no está instrumentado.",
    items: [
      "El motor envía el estado",
      "express.json() interpreta el body",
      "El handler valida req.body",
      "chooseMove(state) decide",
      "res.json(movement) responde"
    ],
    shuffled: [
      "chooseMove(state) decide",
      "El motor envía el estado",
      "res.json(movement) responde",
      "express.json() interpreta el body",
      "El handler valida req.body"
    ],
    hint: "Primero llega la solicitud; la estrategia solo puede decidir después de interpretar y validar el estado.",
    explanation: "Express interpreta el body, el handler lo valida, la estrategia decide y res.json envía el movimiento al motor."
  }
];
