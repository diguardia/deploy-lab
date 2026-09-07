import test from "node:test";
import assert from "node:assert/strict";
import { blocks } from "../blocks.mjs";
import { validateJsonAnswer } from "../validation.mjs";

test("los bloques conservan el almacenamiento anterior y usan claves independientes", () => {
  assert.equal(blocks[0].storageKey, "deploy-lab-progress-v2");
  assert.equal(new Set(blocks.map(b => b.storageKey)).size, blocks.length);
  const ids = blocks.flatMap(b => b.questions.map(q => q.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("el bot tiene un recorrido completo con enseñanza y respuestas evaluables", () => {
  const bot = blocks.find(b => b.id === "bot");
  assert.equal(bot.questions.length, 30);
  assert.equal(Object.keys(bot.topics).length, 6);
  for (const topic of Object.keys(bot.topics)) {
    assert.equal(bot.questions.filter(q => q.topic === topic).length, 5);
  }
  for (const q of bot.questions) {
    assert.ok(bot.topics[q.topic]);
    for (const field of ["lesson", "prompt", "console", "hint", "explanation"]) assert.ok(q[field].length > 10, `${q.id}: ${field}`);
    if (q.type === "choice") {
      assert.ok(q.options.includes(q.answer));
      assert.equal(new Set(q.options).size, q.options.length);
    } else if (q.type === "json") {
      assert.equal(validateJsonAnswer(JSON.stringify(q.expected), q.expected).correct, true);
    } else if (q.type === "terminal") assert.ok(q.answers.length);
    else if (q.type === "sequence") {
      assert.deepEqual([...q.items].sort(), [...q.shuffled].sort());
      assert.notDeepEqual(q.items, q.shuffled);
    } else assert.fail(`Tipo desconocido: ${q.type}`);
  }
});

test("el contrato del bot acepta diccionarios y rechaza el formato del bloque de clases", () => {
  assert.equal(validateJsonAnswer('{"A1":"N"}', { A1: "N" }).correct, true);
  assert.equal(validateJsonAnswer('{"pieceId":"A1","direction":"N"}', { A1: "N" }).correct, false);
  assert.equal(validateJsonAnswer('{}', {}).correct, true);
  assert.equal(validateJsonAnswer('null', {}).correct, false);
});
