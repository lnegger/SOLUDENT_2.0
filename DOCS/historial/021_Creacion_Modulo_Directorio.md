# Historial de Cambios: 021 - Creación del Módulo Directorio

## Resumen del Cambio
Se implementó el módulo "Directorio" para la gestión de Colegas, Laboratorios y Proveedores, con acceso a través de un submenú desplegable en la navegación principal. El módulo incluye las capas de Base de Datos (integración con Stored Procedures), Backend (FastAPI Router) y Frontend (Angular Services, Listados y Formularios Reactivos).

## Componentes Modificados/Creados
### Backend
- **`backend/app/schemas.py`**: Se agregaron los esquemas Pydantic para `Colega`, `Laboratorio` y `Proveedor` (y sus variantes Base/Create/Response).
- **`backend/app/routers/directorio.py`**: Nuevo enrutador con endpoints GET, POST, PUT y DELETE para las tres entidades, utilizando los procedimientos almacenados correspondientes (`sp_edicion_colegas`, `sp_edicion_Laboratorios`, `sp_edicion_proveedores`).
- **`backend/main.py`**: Inclusión del router `/directorio` en la aplicación principal.

### Frontend
- **`frontend/src/app/core/services/directorio.ts`**: Nuevo servicio HTTP para centralizar la comunicación CRUD de Colegas, Laboratorios y Proveedores.
- **`frontend/src/app/core/layout/main-layout/`**:
  - `main-layout.html`: Inclusión del menú "Directorio" con submenú desplegable usando eventos `mouseenter` y `mouseleave`.
  - `main-layout.scss`: Estilos para `.nav-item-dropdown` y `.dropdown-menu` con animación suave y estética "Clinical Sanctuary".
  - `main-layout.ts`: Agregado de estado `showDirectorio` y la importación de `CommonModule`.
- **Componentes CRUD**:
  - `colegas-list` & `colegas-form`: Listado y creación/edición de colegas.
  - `laboratorios-list` & `laboratorios-form`: Listado y creación/edición de laboratorios.
  - `proveedores-list` & `proveedores-form`: Listado y creación/edición de proveedores.
- **`frontend/src/app/app.routes.ts`**: Se declararon las rutas de listado y formulario bajo `/directorio`.

## Detalles de la Lógica de Negocio
- **Acciones Estándar de los Stored Procedures**: Se analizó la estructura interna de los procedimientos de la base de datos (mediante `sqlcmd`). Se actualizaron los endpoints en `directorio.py` para mapear los valores correctos de `@Accion`:
  - **`COT`**: Consultar Todos (Listado completo)
  - **`INC`**: Incluir (Creación de registros)
  - **`MOD`**: Modificar (Actualización de registros)
  - **`ELI`**: Eliminar (Borrado lógico)
  - **`COU`**: Consulta Única
- **Correcciones Críticas de Esquemas y Parámetros**:
  - Se corrigió el mapeo de Pydantic para `ColegaResponse`, `LaboratorioResponse` y `ProveedorResponse` asignando `CodCia` como `Optional[str]`. Esto previene el error HTTP 500 (Internal Server Error) de validación, dado que los Stored Procedures no retornan este campo en los queries de consulta (`COT`, `COU`).
  - Se actualizaron los parámetros requeridos por `sp_edicion_colegas`, reemplazando el campo `Contacto` por `DireccionHabitacion`, `TelefonoHabitacion1` y `TelefonoHabitacion2`, asegurando que la llamada desde Python refleje al 100% la firma esperada en SQL Server.
- **Consistencia Visual y Refinamientos UI**: Se homologaron las tres pantallas (`colegas-list`, `laboratorios-list`, `proveedores-list`) añadiéndoles el componente de cabecera (`top-bar`) con sus respectivas cajas de búsqueda. Todas las tablas utilizan la clase `.clinical-table` y los formularios están construidos como tarjetas (`.form-card` con `.clinical-form`), respetando íntegramente la identidad visual ("Clinical Sanctuary") establecida para los demás módulos (ej. Pacientes).

## Estado Final y Verificación
- Las tres secciones de "Directorio" cargan correctamente sin errores 500, permitiendo visualizar los registros desde SQL Server.
- La interfaz luce idéntica al diseño consolidado para el resto del sistema SoluDent.
