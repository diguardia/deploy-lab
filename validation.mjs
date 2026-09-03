export function normalizeText(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function locationFromError(source, error) {
  const positionMatch = error.message.match(/position\s+(\d+)/i);
  if (!positionMatch) return "";

  const position = Number(positionMatch[1]);
  const beforeError = source.slice(0, position);
  const lines = beforeError.split(/\r\n|\r|\n/);
  return ` cerca de la línea ${lines.length}, columna ${lines.at(-1).length + 1}`;
}

function expectedTypeLabel(value) {
  if (typeof value === "string") return "texto";
  if (typeof value === "number") return "un número";
  if (typeof value === "boolean") return "true o false";
  if (Array.isArray(value)) return "una lista";
  return "un objeto";
}

function quotedList(values) {
  return values.map((value) => `“${value}”`).join(", ");
}

export function validateJsonAnswer(source, expected) {
  let parsed;

  try {
    parsed = JSON.parse(source);
  } catch (error) {
    const location = locationFromError(source, error);
    return {
      correct: false,
      message: `El JSON tiene un error de sintaxis${location}. Revisá las comillas dobles, las comas entre propiedades y el cierre de llaves.`
    };
  }

  if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
    return {
      correct: false,
      message: "La respuesta es JSON válido, pero debe ser un objeto entre llaves, no un valor suelto ni una lista."
    };
  }

  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(parsed);
  const missingKeys = expectedKeys.filter((key) => !Object.hasOwn(parsed, key));
  const extraKeys = actualKeys.filter((key) => !Object.hasOwn(expected, key));

  if (missingKeys.length) {
    const extraNote = extraKeys.length
      ? ` Además, ${extraKeys.length === 1 ? "la propiedad" : "las propiedades"} ${quotedList(extraKeys)} no forma${extraKeys.length === 1 ? "" : "n"} parte del contrato; revisá si hay un nombre mal escrito.`
      : "";
    return {
      correct: false,
      message: `Falta ${missingKeys.length === 1 ? "la propiedad requerida" : "las propiedades requeridas"} ${quotedList(missingKeys)}.${extraNote}`
    };
  }

  if (extraKeys.length) {
    return {
      correct: false,
      message: `${extraKeys.length === 1 ? "La propiedad" : "Las propiedades"} ${quotedList(extraKeys)} no forma${extraKeys.length === 1 ? "" : "n"} parte del contrato pedido.`
    };
  }

  for (const key of expectedKeys) {
    const actualValue = parsed[key];
    const expectedValue = expected[key];

    if (typeof actualValue !== typeof expectedValue || Array.isArray(actualValue) !== Array.isArray(expectedValue)) {
      return {
        correct: false,
        message: `La propiedad “${key}” existe, pero debe contener ${expectedTypeLabel(expectedValue)}.`
      };
    }

    if (actualValue !== expectedValue) {
      const differsOnlyByCase = typeof actualValue === "string"
        && actualValue.toLowerCase() === expectedValue.toLowerCase();
      return {
        correct: false,
        message: differsOnlyByCase
          ? `El valor de “${key}” tiene las letras correctas, pero no respeta las mayúsculas y minúsculas solicitadas.`
          : `El valor de “${key}” no coincide con el solicitado en la consigna.`
      };
    }
  }

  return { correct: true, message: "" };
}
