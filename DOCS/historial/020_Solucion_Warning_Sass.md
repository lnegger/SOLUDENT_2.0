# Historial 020: Solución de Warning por Deprecación en Sass

## Fecha
18 de mayo de 2026

## Descripción
Se solucionó un warning de deprecación generado por el plugin `angular-sass` al utilizar la función global `darken()` en el archivo de estilos de la vista de login.

## Archivos Modificados
- `frontend/src/app/components/auth/login/login.scss`

## Cambios Realizados
- **Reemplazo de Función Deprecada**: Se cambió la instrucción `background-color: darken($surface-container-high, 2%);` por su equivalente moderno en CSS puro `background-color: color-mix(in srgb, $surface-container-high, black 2%);`. Esto permite oscurecer el color de fondo de los inputs del formulario al recibir el foco de forma nativa sin depender de las funciones globales de Sass, eliminando así el mensaje de advertencia durante la compilación (`ng serve` / `ng build`).
