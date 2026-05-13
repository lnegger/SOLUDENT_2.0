# 015 - Corrección Reactivación de Pacientes

**Fecha:** 2026-05-12  
**Objetivo:** Corregir el error al reactivar pacientes eliminados y mejorar la experiencia visual del proceso de reactivación.

---

## Problema

La reactivación de pacientes fallaba con el mensaje "No se pudo reactivar el paciente" porque:
- Se usaba el endpoint `PUT /{cedula}/{representado}` que requiere **todos** los campos del paciente
- Ese mismo endpoint tenía la validación 403 que bloqueaba ediciones de pacientes inactivos
- El error se mostraba con un feo `alert()` del navegador

## Solución

Se creó un flujo dedicado de reactivación usando el SP con `@Accion='REC'`.

---

## Archivos Modificados

### Backend

#### `backend\app\routers\pacientes.py`
- **Nuevo endpoint `PUT /{cedula}/{representado}/reactivar`** (líneas 232-237): Llama al SP `SP_Edicion_Pacientes` con `@Accion='REC'`. Solo necesita cédula y representado, sin campos adicionales.

### Frontend — Servicio

#### `frontend\src\app\core\services\paciente.service.ts`
- **Nuevo método `reactivarPaciente(cedula, representado)`**: Llama al nuevo endpoint dedicado de reactivación.

### Frontend — Directorio de Pacientes

#### `frontend\src\app\components\pacientes\pacientes-list.ts`
- Nuevos signals: `showSuccessToast`, `successMessage`, `showErrorModal`, `errorModalMessage`
- **`confirmarActivar()` reescrito**: Usa `reactivarPaciente()` en lugar de `updatePaciente()`. Al éxito muestra un toast animado. Al error muestra un modal estilizado.
- Nuevos métodos: `dismissSuccessToast()`, `dismissErrorModal()`
- El toast de éxito se auto-oculta después de 4 segundos

#### `frontend\src\app\components\pacientes\pacientes-list.html`
- **Toast de éxito**: Notificación deslizable (top-right) con ícono ✅, título "Paciente Reactivado" y nombre del paciente
- **Modal de error**: Modal estilizado con ícono ⚠️ y botón "Entendido", reemplazando el feo `alert()`

#### `frontend\src\app\components\pacientes\pacientes-list.scss`
- `.success-toast`: Toast con gradiente verde, borde accent, sombra profunda y animación `slideInRight`
- `@keyframes slideInRight`: Animación de deslizamiento desde la derecha
- `.error-modal`: Modal de error con ícono grande y título rojo

---

## Cómo Verificar

1. Eliminar un paciente desde el directorio
2. Presionar ✅ (reactivar) en el paciente inactivo
3. Confirmar en el modal → debería aparecer un **toast verde animado** arriba a la derecha
4. El paciente debe volver a estado "Activo" en la lista
5. El toast desaparece solo después de 4 segundos (o al hacer clic)
