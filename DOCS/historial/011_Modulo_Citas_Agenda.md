# 011: Desarrollo del Módulo de Citas y Agenda Profesional

## Resumen del Objetivo
Desarrollo de un sistema de agendamiento robusto ("Agenda Profesional") que funciona en dos contextos:
1. **Agenda Global:** Accesible desde el menú principal, donde se visualizan y gestionan todas las citas de la clínica médica.
2. **Agenda Contextual del Paciente:** Accesible dentro del `PacienteDashboard` (pestaña "Citas"), donde solo se muestran las citas exclusivas de un paciente y permite agendar nuevas citas atadas automáticamente a su ficha.

## Cambios Realizados

### Base de Datos
- **Tabla `Citas`:** Se agregó el campo `Motivo VARCHAR(250) NULL`.
- **Vista `VW_CitasPorPaciente`:** Se alteró para extraer el campo `Motivo`.
- **Procedimiento Almacenado `SP_Edicion_Citas_Agenda`:** 
  - Se modificó la acción `INC` para soportar la inserción de `@Motivo`.
  - Se agregó la nueva acción `MOD` para actualizar detalles como el `Motivo` y `Confirmada` sin tener que alterar la hora.

### Backend (FastAPI)
- Creación de `backend/app/routers/citas.py` con Endpoints REST para `GET`, `POST`, `PUT` y `DELETE` integrados directamente a la vista y SP.
- Actualización de `schemas.py` para añadir Pydantic models correspondientes (`CitaBase`, `CitaResponse`).
- Inclusión del `router` de citas en `main.py`.

### Frontend (Angular)
- Instalación de la librería `@fullcalendar/angular` y plugins `daygrid`, `timegrid` e `interaction`.
- Creación de `src/app/core/services/cita.service.ts` para comunicarse con la REST API.
- Creación del `AgendaGlobalComponent` y asignación de la ruta `/agenda`.
- Creación del `PacienteCitasComponent` y enrutamiento contextual bajo `/pacientes/:id/:representado/citas`.

## Estado Actual
El sistema ahora soporta agendas "drag & drop" con modalidades dinámicas de búsqueda y autocompletado de pacientes dependiendo del contexto desde donde se lanza la cita. Todo bajo el esquema del componente "Clinical Sanctuary".
