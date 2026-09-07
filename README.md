# Deploy Lab

Práctica interactiva de Diseño y Arquitectura de Despliegue 1 (2026), organizada en bloques seleccionables desde la pantalla principal.

## Ejecutar

Requiere Node.js 18 o superior.

```bash
npm start
```

Abrir `http://127.0.0.1:4173`.

## Verificar

```bash
npm test
```

## Cómo funciona

- **Clases 1–4:** 24 desafíos, seis por eje temático; conserva el avance previo.
- **Bot de casas:** 30 desafíos, cinco por etapa: orientación en el repo, Node.js/npm, datos/TypeScript, estrategia, HTTP y pruebas. Duración orientativa: 45–60 minutos, con posibilidad de continuar en otra sesión.
- El nuevo bloque incluye explicaciones previas, fragmentos del código y repeticiones con variaciones. No requiere ejecutar el bot ni conocer previamente TypeScript.
- Combina consola simulada, opciones, edición de JSON y ordenamiento de pasos.
- Otorga 2 puntos por un acierto inicial, 1 con ayuda y 0 al revelar la respuesta.
- Guarda el avance de cada bloque por separado en `localStorage` del navegador.
- Permite repetir solamente los temas con menos de 75% de dominio.

La aplicación no ejecuta comandos reales ni envía respuestas a un servidor externo.

## Mantener el contenido

`blocks.mjs` define los bloques; `questions.mjs` conserva el contenido de clases y `bot-questions.mjs` contiene la práctica del bot. Las explicaciones del segundo bloque se basan en el código de `bot-casas-ejemplo` revisado el 7 de septiembre de 2026: `package.json`, `tsconfig.json`, `src/`, `fixtures/` y `test/move.test.ts`.

Los fragmentos son material didáctico estático, no una lectura en vivo del otro repositorio. Al cambiar el bot, revisar también los ejercicios. Su contrato real es un diccionario como `{"A1":"N"}`, diferente de `{pieceId, direction}` usado en el bloque de clases. La estrategia actual no usa el dado ni verifica legalidad de movimientos.
