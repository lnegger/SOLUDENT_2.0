# 017 - Corrección Z-Index Modales de Confirmación

## Fecha
Mayo 12, 2026

## Descripción
Corrección del problema de z-index en los modales de confirmación de eliminación y movimiento, que aparecían detrás del modal principal de edición/creación de citas.

## Problema
Cuando se intentaba eliminar una cita desde el modal de edición, el modal de confirmación de eliminación aparecía detrás del modal principal, impidiendo la interacción con el usuario.

## Solución
Asignación de valores de z-index jerárquicos a los modales:

- Modal principal (crear/editar cita): `z-index: 1000`
- Modal de confirmación de movimiento: `z-index: 1100`
- Modal de confirmación de eliminación: `z-index: 1200`

## Cambios Realizados

### Frontend - Citas de Paciente
- **Archivo:** `frontend/src/app/components/pacientes/paciente-citas/paciente-citas.html`
  - Agregado `style="z-index: 1000;"` al modal principal
  - Cambiado `style="z-index: 1100;"` a `style="z-index: 1200;"` en modal de eliminación
  - Modal de movimiento mantiene `z-index: 1100`

### Frontend - Agenda Global
- **Archivo:** `frontend/src/app/components/agenda/agenda-global/agenda-global.component.html`
  - Agregado `style="z-index: 1000;"` al modal principal
  - Cambiado `style="z-index: 1100;"` a `style="z-index: 1200;"` en modal de eliminación
  - Modal de movimiento mantiene `z-index: 1100`

## Jerarquía de Modales
1. Modal principal (z-index: 1000) - Base
2. Modal de movimiento (z-index: 1100) - Intermedio
3. Modal de eliminación (z-index: 1200) - Superior

## Archivos Afectados
- `frontend/src/app/components/pacientes/paciente-citas/paciente-citas.html`
- `frontend/src/app/components/agenda/agenda-global/agenda-global.component.html`

## Resultado
Los modales de confirmación ahora aparecen correctamente por encima del modal principal, permitiendo la interacción adecuada con el usuario.