# 014 - Bloqueo de Pacientes Eliminados

**Fecha:** 2026-05-12  
**Objetivo:** Impedir que se editen datos o se asignen citas a pacientes eliminados (inactivos). El único proceso permitido para un paciente eliminado es reactivarlo.

---

## Archivos Modificados

### Backend

#### `backend\app\routers\pacientes.py`
- **Endpoint `PUT /{cedula}/{representado}`** (líneas 152-164): Se agregó validación que consulta el estado `Activo` del paciente antes de permitir la actualización. Si el paciente está inactivo (`Activo = 0`), solo se permite la operación si el nuevo valor es `Activo = 1` (reactivación). Cualquier otro intento de edición retorna **HTTP 403 Forbidden**.

#### `backend\app\routers\citas.py`
- **Endpoint `POST /`** (líneas 105-114): Se agregó validación que verifica el estado `Activo` del paciente antes de crear una cita. Si está inactivo, retorna **HTTP 403**.
- **Endpoint `PUT /modificar`** (líneas 144-153): Misma validación aplicada antes de modificar una cita existente.

---

### Frontend — Directorio de Pacientes

#### `frontend\src\app\components\pacientes\pacientes-list.html`
- Columna de acciones ahora es condicional:
  - **Paciente activo:** Botones ✏️ (editar) y 🗑️ (eliminar)
  - **Paciente inactivo:** Botones 👁️ (ver solo lectura) y ✅ (reactivar)
- Se agregó un **modal de confirmación de reactivación** con botón verde "Reactivar"

#### `frontend\src\app\components\pacientes\pacientes-list.ts`
- Nuevos signals: `showActivateModal`, `pacienteToActivate`
- Nuevos métodos: `activarPaciente()`, `confirmarActivar()`, `cancelarActivar()`
- `confirmarActivar()` envía un PUT con `Activo: 1` para reactivar al paciente

#### `frontend\src\app\components\pacientes\pacientes-list.scss`
- Estilo `.view-btn` (azul) para el botón de solo ver
- Estilo `.activate-btn` (verde) para el botón de reactivar
- Estilo `.btn-activate` para el botón del modal de reactivación

---

### Frontend — Formulario del Paciente

#### `frontend\src\app\components\pacientes\paciente-form\paciente-form.ts`
- Nuevo signal `isReadOnly` — se activa cuando `paciente.Activo === 0`
- En `loadPaciente()`: si el paciente está inactivo, se llama `this.pacienteForm.disable()` para deshabilitar todos los campos

#### `frontend\src\app\components\pacientes\paciente-form\paciente-form.html`
- Banner amarillo de advertencia: *"⛔ Este paciente está eliminado..."*
- Controles de foto ocultos en modo solo lectura
- Botones de acción (Cancelar/Guardar) ocultos en modo solo lectura

#### `frontend\src\app\components\pacientes\paciente-form\paciente-form.scss`
- Estilo `.readonly-banner` — fondo amarillo con borde dorado

---

### Frontend — Dashboard del Paciente

#### `frontend\src\app\components\pacientes\paciente-dashboard\paciente-dashboard.ts`
- Nuevo signal `pacienteActivo`
- Las tabs ahora son un `computed()` que **filtra la pestaña "Citas"** cuando el paciente está inactivo
- Se actualiza `pacienteActivo` en `cargarDatosPaciente()`

#### `frontend\src\app\components\pacientes\paciente-dashboard\paciente-dashboard.html`
- Badge rojo **"ELIMINADO"** junto al nombre del paciente inactivo
- Banner amarillo de advertencia visible solo para pacientes eliminados
- `tabs` cambiado a `tabs()` (llamada al computed signal)

#### `frontend\src\app\components\pacientes\paciente-dashboard\paciente-dashboard.scss`
- Estilo `.inactive-badge` — badge rojo con texto blanco
- Estilo `.readonly-banner` — banner de advertencia amarillo

---

### Frontend — Agenda Global

#### `frontend\src\app\components\agenda\agenda-global\agenda-global.component.ts`
- `loadPacientes()` ahora filtra con `.filter(p => p.Activo === 1)`, mostrando solo pacientes activos en el selector de citas

---

## Flujo de Protección

```
Paciente Eliminado (Activo = 0)
├── Directorio: Solo puede Ver (👁️) o Reactivar (✅)
├── Formulario: Todos los campos deshabilitados + banner de advertencia
├── Dashboard: Badge "ELIMINADO" + pestaña Citas oculta
├── Agenda Global: No aparece en el dropdown de pacientes
├── Backend PUT paciente: Rechazado (403) excepto reactivación
├── Backend POST cita: Rechazado (403)
└── Backend PUT cita: Rechazado (403)
```

## Cómo Verificar

1. Eliminar un paciente desde el directorio (botón 🗑️)
2. Verificar que en la lista aparece como **"Inactivo"** con botones 👁️ y ✅
3. Entrar al expediente del paciente → verificar que el formulario está **deshabilitado** y no muestra la pestaña **"Citas"**
4. Ir a la **Agenda Global** → verificar que el paciente eliminado **no aparece** en el dropdown
5. Presionar ✅ en el directorio → reactivar el paciente → verificar que todo vuelve a funcionar normalmente
