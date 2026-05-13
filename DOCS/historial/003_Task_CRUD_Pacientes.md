# Tareas de Implementación - CRUD Pacientes

## Backend
- `[x]` Refactorizar `backend/app/routers/pacientes.py` para usar `SP_Edicion_Pacientes`.
  - Endpoint GET `/` (Accion: 'COB')
  - Endpoint GET `/{cedula}` (Accion: 'COU')
  - Endpoint POST `/` (Accion: 'INC')
  - Endpoint PUT `/{cedula}` (Accion: 'MOD')
  - Endpoint DELETE `/{cedula}` (Accion: 'ELI')

## Frontend
- `[x]` Actualizar `paciente.service.ts` con todos los métodos HTTP (POST, GET by ID, PUT, DELETE).
- `[x]` Crear el componente `PacienteForm` (`paciente-form.ts`, `paciente-form.html`, `paciente-form.scss`).
- `[x]` Implementar el `FormGroup` con las validaciones requeridas.
- `[x]` Configurar `app.routes.ts` con `/pacientes/nuevo` y `/pacientes/editar/:id`.
- `[x]` Conectar los botones de "NUEVO PACIENTE", "Editar" y "Eliminar" en `pacientes-list.html` y `pacientes-list.ts`.
