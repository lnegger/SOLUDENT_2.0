# Módulo de Pacientes: Estructura Base y Listado

Este plan detalla los pasos para construir el siguiente módulo fundamental del sistema: la gestión de Pacientes. Empezaremos construyendo la API en el backend para consultar pacientes y luego crearemos la interfaz en Angular siguiendo el estilo "Clinical Sanctuary".

## Cambios Propuestos

### 1. Backend (FastAPI)
Ampliaremos la base de datos y la API para manejar la tabla de pacientes.

- **[MODIFICAR] `backend/app/models.py`**
  Añadir el modelo SQLAlchemy `Paciente` con los campos correspondientes (Cédula, Nombre, Sexo, Teléfono, etc.) según la estructura existente en SQL Server.

- **[MODIFICAR] `backend/app/schemas.py`**
  Añadir los esquemas Pydantic (`PacienteBase`, `PacienteCreate`, `Paciente`) para la validación y serialización de datos de la API.

- **[NUEVO] `backend/app/routers/pacientes.py`**
  Crear un nuevo archivo de rutas para manejar los endpoints relacionados con pacientes:
  - `GET /api/pacientes/`: Para listar todos los pacientes (protegido con token).

- **[MODIFICAR] `backend/main.py`**
  Registrar el nuevo router de `pacientes` en la aplicación principal de FastAPI.

---

### 2. Frontend (Angular)
Crearemos los servicios y vistas para consumir y mostrar los pacientes.

- **[NUEVO] `frontend/src/app/core/models/paciente.model.ts`**
  Definir la interfaz TypeScript para tipar correctamente los datos de los pacientes que llegan del backend.

- **[NUEVO] `frontend/src/app/core/services/paciente.service.ts`**
  Crear un servicio Angular que utilice `HttpClient` para realizar peticiones al endpoint `/api/pacientes`.

- **[NUEVO] `frontend/src/app/components/pacientes/pacientes-list.ts` (y HTML/SCSS)**
  Crear el componente `PacientesList` que mostrará una tabla o lista de pacientes siguiendo el diseño de `DESIGN.md` (bordes suaves, sombras tenues, tipografía Inter).

- **[MODIFICAR] `frontend/src/app/app.routes.ts`**
  Añadir la ruta `path: 'pacientes'` protegida por `authGuard`.

- **[MODIFICAR] `frontend/src/app/components/dashboard/dashboard.html`**
  Actualizar el enlace "PACIENTES" del menú lateral para que navegue a la nueva ruta usando `routerLink="/pacientes"`.

## Plan de Verificación
1. **Backend**: Revisar en `http://localhost:8000/docs` que el endpoint `/api/pacientes/` exista y requiera autenticación.
2. **Frontend**: Navegar a la sección de Pacientes desde el Dashboard y verificar que se realice la petición HTTP (con el Interceptor inyectando el token) y se pinte la lista de pacientes proveniente de la base de datos.
