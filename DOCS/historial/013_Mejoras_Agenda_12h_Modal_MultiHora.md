# 013 - Mejoras de UX en Agenda: Formato 12h, Modal de Confirmación y Citas Multi-Hora

**Fecha:** 12 de Mayo de 2026
**Módulo:** Full Stack (Base de Datos, Backend, Frontend)

## Descripción del Requerimiento
Se solicitaron tres mejoras funcionales y de experiencia de usuario para el sistema de agenda/citas:

1. **Formato de 12 horas:** Cambiar la columna de horas del calendario de formato 24h (14:00) a formato 12h (2:00 PM).
2. **Modal de confirmación de eliminación:** Reemplazar el `confirm()` nativo del navegador por un modal estilizado que pida confirmación antes de eliminar una cita, siguiendo el diseño existente del sistema (card blanco, título en azul marino, botones "No" / "Sí").
3. **Citas de duración variable:** Permitir asignar citas que abarquen múltiples horas (ej: 10:00 AM a 12:00 PM), para bloquear ese rango de horas en la silla correspondiente.

## Cambios Realizados

### Base de Datos (SQL Server)
- **Script:** `backend/013_agregar_horafin.sql`
  - `ALTER TABLE Citas ADD HoraFin VARCHAR(13) NULL` — nueva columna para hora de finalización.
  - `UPDATE Citas SET HoraFin = HoraCita + 30 minutos` — migración de datos existentes.
  - `ALTER VIEW VW_CitasPorPaciente` — incluye el campo `HoraFin` en las consultas.
  - `ALTER PROCEDURE SP_Edicion_Citas_Agenda` — nuevo parámetro `@HoraFin VARCHAR(13) = NULL` en acciones `INC` y `MOD`.

> **⚠️ IMPORTANTE:** Este script SQL debe ejecutarse manualmente en SQL Server Management Studio antes de que la funcionalidad de duración variable esté operativa.

### Backend (FastAPI)
- **`app/schemas.py`:** Añadido campo `HoraFin: Optional[str] = None` al schema `CitaBase`.
- **`app/routers/citas.py`:** 
  - Los endpoints `GET` ahora retornan `HoraFin` desde la vista (con try/except para compatibilidad hacia atrás).
  - Los endpoints `POST` y `PUT` ahora envían `@HoraFin=:horafin` al SP.

### Frontend (Angular)

#### `cita.service.ts`
- Añadido `HoraFin?: string` a la interfaz `Cita`.

#### `agenda-global.component.ts` (Agenda Global)
- **Formato 12h:** Configurado `slotLabelFormat` y `eventTimeFormat` con `hour12: true`.
- **Modal de confirmación:** Reemplazado `confirm()` por un modal custom con estados `showDeleteConfirm` y `showMoveConfirm`, ambos con `ChangeDetectorRef.detectChanges()`.
- **Hora Fin:** Campo `horaFin` añadido al formulario. El `loadCitas()` usa `c.HoraFin` o calcula 30 min como fallback. `eventResize` permite ajustar la duración arrastrando el borde inferior del evento.

#### `agenda-global.component.html`
- Campo "Hora" renombrado a "Hora Inicio" + nuevo campo "Hora Fin".
- Dos nuevos modales HTML: "Confirmar Eliminación" (con nombre del paciente y advertencia) y "Confirmar Movimiento" (para drag & drop).

#### `agenda-global.scss`
- Nuevas clases: `.confirm-modal`, `.confirm-title`, `.confirm-text`, `.confirm-warning`, `.confirm-actions`.

#### `paciente-citas.component.ts` (Citas del Paciente)
- Mismas tres mejoras aplicadas: formato 12h, modales de confirmación, y soporte de HoraFin.

## Archivos Modificados / Creados
| Archivo | Tipo |
|---------|------|
| `backend/013_agregar_horafin.sql` | [NUEVO] Script SQL |
| `backend/app/schemas.py` | [MODIFICADO] Añadido HoraFin |
| `backend/app/routers/citas.py` | [MODIFICADO] HoraFin en GET/POST/PUT |
| `frontend/src/app/core/services/cita.service.ts` | [MODIFICADO] Interfaz Cita |
| `frontend/src/app/components/agenda/agenda-global/agenda-global.component.ts` | [MODIFICADO] |
| `frontend/src/app/components/agenda/agenda-global/agenda-global.component.html` | [MODIFICADO] |
| `frontend/src/app/components/agenda/agenda-global/agenda-global.scss` | [MODIFICADO] |
| `frontend/src/app/components/pacientes/paciente-citas/paciente-citas.component.ts` | [MODIFICADO] |

## Estado Final
- ✅ Formato de 12 horas en la columna lateral del calendario (7 AM, 8 AM... 7 PM).
- ✅ Modal de confirmación estilizado para eliminación y movimiento de citas (sin alert nativo).
- ✅ Campo "Hora Fin" en el formulario de citas para definir duración variable.
- ✅ Eventos del calendario reflejan la duración real de la cita.
- ✅ Se puede redimensionar eventos arrastrando el borde inferior para ajustar duración.
- ⚠️ Pendiente: Ejecutar `013_agregar_horafin.sql` en SQL Server para activar la persistencia de HoraFin.
