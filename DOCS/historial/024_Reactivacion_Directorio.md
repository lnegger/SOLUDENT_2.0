# Historial 024: Reactivación en Módulos de Colegas y Laboratorios

## Descripción
Se ha extendido la funcionalidad de reactivación y visualización del estado (`Activo/Inactivo`) que inicialmente fue implementada en Proveedores, hacia las entidades de **Colegas** y **Laboratorios** en el módulo de Directorio.

## Cambios Realizados

1. **Backend (FastAPI)**:
   - Se agregaron los endpoints `PUT /colegas/{codigo}/reactivar` y `PUT /laboratorios/{codigo}/reactivar` en `backend/app/routers/directorio.py`.
   - Se configuran para llamar a los procedimientos almacenados `sp_edicion_colegas` y `sp_edicion_Laboratorios` con `@Accion='ACT'`.
   - Se actualizaron los esquemas de respuesta `ColegaResponse` y `LaboratorioResponse` en `backend/app/schemas.py` para mapear de manera robusta el campo `activo` proveniente de la base de datos (incluso si viene en minúsculas) al campo `Activo` usando alias de Pydantic.

2. **Frontend (Angular Services & Interfaces)**:
   - Se añadieron los métodos `reactivarColega` y `reactivarLaboratorio` en `directorio.ts` para establecer comunicación con los endpoints del backend.
   - Se actualizaron las interfaces de TypeScript `Colega` y `Laboratorio` para incluir explícitamente los campos opcionales `Activo?: string | null;` y `activo?: string | null;`, solucionando un error de compilación (`TS2339`).

3. **Frontend (Angular UI Uniformity)**:
   - **Colegas (`colegas-list`)** y **Laboratorios (`laboratorios-list`)**:
     - Se eliminó el botón de texto tosco para reactivación y se reemplazó por el **botón de icono circular con el check verde (`✅`)**, utilizando la clase `.activate-btn` con efectos hover impecables.
     - **Estandarización Absoluta de Modales**: Se reformularon los modales de confirmación para reactivación de Colegas y Laboratorios, igualándolos exactamente al diseño de Proveedores (empleando el título `Reactivar Colega` / `Reactivar Laboratorio`, añadiendo el texto descriptivo `"El [registro] volverá a estar disponible en el directorio."` y aplicando la clase `.btn-activate` para el botón de confirmación en verde esmeralda).
     - Se estandarizó la estructura HTML de los **Toasts de éxito (`.success-toast`)** y del **Modal de Error (`.error-modal`)**, garantizando una alineación visual perfecta y homogénea con el estilo de *Clinical Sanctuary* de todo el Directorio.
     - Se añadió la columna **Estado** en la tabla con un badge estilizado (`Activo`/`Inactivo`).
     - Se ajustó el arreglo de botones en la columna "Acciones". Si el registro está inactivo, el botón "Editar" se reemplaza por un botón "Ver detalles" (`👁️`), y se habilita el botón "Reactivar" (`✅`).
     - Se creó la lógica en los componentes TS (`activarColega`, `activarLaboratorio`, `confirmarActivar`, `isActivo`, etc.).

## Notas Adicionales
- Con estas correcciones de tipos tanto en TypeScript como en los esquemas Pydantic del backend, la compilación de Angular pasa limpiamente.
- Las tres listas del directorio (Proveedores, Colegas y Laboratorios) comparten exactamente el mismo diseño premium, comportamiento, iconos de acción y flujos de confirmación/mensajería en sus modales y toasts.
