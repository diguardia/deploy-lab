import test from "node:test";
import assert from "node:assert/strict";
import { questions, topics } from "../questions.mjs";
import { normalizeText, validateJsonAnswer } from "../validation.mjs";

test("el diagnóstico tiene seis desafíos por tema", () => {
  for (const topicId of Object.keys(topics)) {
    assert.equal(questions.filter((question) => question.topic === topicId).length, 6);
  }
});

test("el diagnóstico contiene 24 desafíos", () => {
  assert.equal(questions.length, 24);
});

test("el JSON acepta espacios, tabs y saltos de línea CRLF", () => {
  const source = "  {\r\n\t\"direction\" : \"N\",\r\n\t\"pieceId\" : \"A1\"\r\n  }  ";
  assert.equal(validateJsonAnswer(source, { pieceId: "A1", direction: "N" }).correct, true);
});

test("el validador JSON explica la causa concreta", () => {
  const expected = { pieceId: "A1", direction: "N" };

  assert.match(validateJsonAnswer('{"pieceId":"A1" "direction":"N"}', expected).message, /sintaxis/i);
  assert.match(validateJsonAnswer('{"pieceId":"A1"}', expected).message, /direction/);
  assert.match(validateJsonAnswer('{"pieceId":1,"direction":"N"}', expected).message, /texto/);
  assert.match(validateJsonAnswer('{"pieceId":"a1","direction":"N"}', expected).message, /mayúsculas/i);
  assert.match(validateJsonAnswer('{"pieceId":"A1","direction":"N","turn":1}', expected).message, /turn/);
});

test("los comandos toleran espacios, tabs y saltos de línea", () => {
  assert.equal(normalizeText(" \tNPM\r\n  CI  "), "npm ci");
});

test("los identificadores son únicos", () => {
  const ids = questions.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
});

test("cada pregunta tiene explicación y mecanismo de respuesta", () => {
  const allowedTypes = new Set(["choice", "terminal", "json", "sequence"]);
  for (const question of questions) {
    assert.ok(allowedTypes.has(question.type), `${question.id}: tipo inválido`);
    assert.ok(question.explanation.length > 20, `${question.id}: falta explicación`);
    assert.ok(question.hint.length > 10, `${question.id}: falta pista`);
    if (question.type === "choice") assert.ok(question.options.includes(question.answer));
    if (question.type === "terminal") assert.ok(question.answers.length > 0);
    if (question.type === "sequence") assert.deepEqual([...question.items].sort(), [...question.shuffled].sort());
    if (question.type === "json") {
      assert.ok(question.expected && typeof question.expected === "object");
      for (const value of Object.values(question.expected)) {
        assert.ok(!question.placeholder.includes(JSON.stringify(value)), `${question.id}: el placeholder revela un valor esperado`);
      }
    }
  }
});
