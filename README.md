# Deploy Lab

Autoevaluación interactiva sobre los contenidos de las primeras cuatro clases de Diseño y Arquitectura de Despliegue 1 (2026).

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

- Presenta 16 desafíos, cuatro por eje temático.
- Combina consola simulada, opciones, edición de JSON y ordenamiento de pasos.
- Otorga 2 puntos por un acierto inicial, 1 con ayuda y 0 al revelar la respuesta.
- Guarda el avance únicamente en `localStorage` del navegador.
- Permite repetir solamente los temas con menos de 75% de dominio.

La aplicación no ejecuta comandos reales ni envía respuestas a un servidor externo.
