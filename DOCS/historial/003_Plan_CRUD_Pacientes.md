# Plan de Implementación: CRUD de Pacientes (Refactorizado con Stored Procedure)

Este plan detalla la construcción de las operaciones faltantes para gestionar pacientes (Crear, Editar, Eliminar/Inactivar) y la refactorización del backend para utilizar el procedimiento almacenado **`SP_Edicion_Pacientes`**.

## Análisis del Stored Procedure `SP_Edicion_Pacientes`
El SP maneja todas las operaciones mediante el parámetro `@Accion`:
- `'INC'` / `'MOD'`: Inserta o actualiza un paciente (Upsert).
- `'ELI'`: Elimina físicamente el registro.
- `'COB'`: Consulta básica (ideal para el listado de pacientes).
- `'COU'`: Consulta un paciente específico.
- `'COT'`: Consulta todos los pacientes con todos sus campos.

## User Review Required
> [!IMPORTANT]
> **Decisión de Diseño UI**: Para la creación y edición de pacientes, propongo usar una ruta y vista dedicada (`/pacientes/nuevo` y `/pacientes/:id/editar`) en lugar de un "Modal" o ventana emergente. Las vistas dedicadas permiten formularios más extensos y ordenados. ¿Estás de acuerdo con este enfoque?

## Proposed Changes

### 1. Backend (FastAPI)
Refactorizaremos el router para usar el Stored Procedure en lugar de consultas de SQLAlchemy puras.

- **[MODIFICAR] `backend/app/routers/pacientes.py`**
  Se modificarán y agregarán los endpoints para que llamen a `SP_Edicion_Pacientes`:
  - `GET /api/pacientes/`: Ejecutará `EXEC SP_Edicion_Pacientes @Accion='COB', @CodCia='01'` para obtener el listado rápido.
  - `GET /api/pacientes/{cedula}`: Ejecutará `EXEC SP_Edicion_Pacientes @Accion='COU', @CodCia='01', @Cedula='...', @Representado='0'`.
  - `POST /api/pacientes/`: Ejecutará `EXEC SP_Edicion_Pacientes @Accion='INC', ...` pasando todos los parámetros del cuerpo de la petición.
  - `PUT /api/pacientes/{cedula}`: Ejecutará `EXEC SP_Edicion_Pacientes @Accion='MOD', ...`.
  - `DELETE /api/pacientes/{cedula}`: Ejecutará `EXEC SP_Edicion_Pacientes @Accion='ELI', ...`.

- **[MODIFICAR] `backend/app/schemas.py`**
  Actualizaremos los esquemas para que coincidan con los parámetros que recibe y devuelve el Stored Procedure (ej. `COB` devuelve `TelefHabita1`, `TelefOficina1`, etc.).

### 2. Frontend (Angular)
Desarrollaremos la interfaz usando Formularios Reactivos (`ReactiveFormsModule`).

- **[MODIFICAR] `frontend/src/app/core/services/paciente.service.ts`**
  Añadir métodos correspondientes al backend.

- **[NUEVO] `frontend/src/app/components/pacientes/paciente-form/paciente-form.ts` (con HTML/SCSS)**
  Crear un componente dedicado para el formulario, manteniendo el diseño "Clinical Sanctuary".

- **[MODIFICAR] `frontend/src/app/app.routes.ts`**
  Agregar rutas: `/pacientes/nuevo` y `/pacientes/editar/:id`.

- **[MODIFICAR] `frontend/src/app/components/pacientes/pacientes-list.html`**
  Conectar las acciones visuales de la tabla.

## Verification Plan
1. **Backend**: Probar los endpoints usando Swagger (`http://localhost:8000/docs`).
2. **Frontend**: Flujo completo de Crear -> Listar -> Editar -> Eliminar.
