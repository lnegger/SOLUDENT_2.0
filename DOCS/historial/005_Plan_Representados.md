# Plan de Implementación: Gestión de Representantes y Representados

Este plan detalla los cambios necesarios para soportar la lógica de pacientes dependientes (Representados) que comparten la cédula de un Representante Principal.

## User Review Required
> [!IMPORTANT]
> **Lógica de Secuencia para 'Representado'**: Para evitar que el usuario tenga que adivinar qué número de representado toca ('01', '02', etc.), propongo que el **Backend asigne este número automáticamente**. El formulario solo preguntará: "¿Es este paciente el titular o un dependiente?". Si es dependiente, el backend buscará la cédula, verá cuántos dependientes existen, y le asignará el siguiente número. ¿Te parece correcto este enfoque automático?
>
> **Nota sobre registros actuales**: Los registros actuales en la base de datos tienen el valor `'0'` en el campo Representado. A partir de ahora, los nuevos titulares usarán `'00'` y los dependientes `'01'`, `'02'`, etc., tal como solicitaste.

## Proposed Changes

### 1. Backend (FastAPI)
Actualizaremos las rutas para que la clave primaria completa (`Cedula` + `Representado`) sea respetada en todas las operaciones.

- **[MODIFICAR] `backend/app/schemas.py`**
  - Añadir campo `es_dependiente: bool = False` al esquema `PacienteCreate` para que el frontend pueda indicar la intención de crear un hijo/dependiente.
  - Asegurar que `Representado` tenga `'00'` como valor por defecto.

- **[MODIFICAR] `backend/app/routers/pacientes.py`**
  - **GET, PUT, DELETE**: Cambiar las rutas que afecten a un paciente específico de `/{cedula}` a `/{cedula}/{representado}` para garantizar que se modifica al paciente correcto.
  - **POST (Crear)**:
    - Si `es_dependiente == False`, forzar `Representado = '00'`.
    - Si `es_dependiente == True`, consultar la base de datos para obtener el número máximo de `Representado` asociado a esa `Cedula` (ej. si existe '00' y '01', el nuevo será '02').
    - Validar que, si se crea un dependiente, la cédula del representante principal ya exista.

### 2. Frontend (Angular)
Adaptaremos el formulario para hacer la distincción clara de manera visual.

- **[MODIFICAR] `frontend/src/app/core/models/paciente.model.ts`**
  - Asegurar que todos los campos y el campo `es_dependiente` opcional estén definidos.

- **[MODIFICAR] `frontend/src/app/core/services/paciente.service.ts`**
  - Ajustar las URL de los métodos `getPaciente`, `updatePaciente` y `deletePaciente` para recibir también el parámetro `representado`.

- **[MODIFICAR] `frontend/src/app/app.routes.ts`**
  - Actualizar la ruta de edición a `path: 'pacientes/editar/:cedula/:representado'`.

- **[MODIFICAR] `frontend/src/app/components/pacientes/pacientes-list.html` y `.ts`**
  - Actualizar los enlaces de los botones Editar y Eliminar para pasar tanto `p.Cedula` como `p.Representado`.
  - Mostrar en la tabla una indicación visual (ej. un pequeño badge que diga "Titular" o "Dependiente").

- **[MODIFICAR] `frontend/src/app/components/pacientes/paciente-form/paciente-form.html` y `.ts`**
  - Añadir un control tipo "Radio Button" o "Selector": **Tipo de Registro** -> Titular / Dependiente.
  - Si se selecciona Dependiente:
    - Cambiar el texto del campo "Cédula de Identidad" a "Cédula del Representante".
    - Añadir lógica para enviar `es_dependiente: true` al backend al guardar.

## Verification Plan
1. **Titular**: Crear un paciente titular, verificar que se guarda con Representado `00`.
2. **Dependiente**: Crear un dependiente usando la cédula del titular, verificar que el backend le asigna automáticamente `01`.
3. **Edición/Borrado**: Editar el titular y el dependiente independientemente, garantizando que no se sobreescriben los datos debido a la ruta `/cedula/representado`.
