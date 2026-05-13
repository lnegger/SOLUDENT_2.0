# 016 - Validación de Citas por Silla y Visualización de Solapamientos

## Fecha
Mayo 12, 2026

## Descripción
Implementación de validación para impedir citas en la misma silla/hora/fecha, y visualización de citas solapadas en distintas sillas con colores diferenciados.

## Cambios Realizados

### Backend
- **Archivo:** `backend/app/routers/citas.py`
  - Agregada validación en `create_cita()` para verificar conflictos de silla antes de crear cita.
  - Agregada validación en `update_cita()` para verificar conflictos de silla antes de modificar cita.
  - Mensaje de error detallado: "La silla X ya está ocupada en la fecha Y a las Z. Seleccione otra silla o cambie la hora."
  - Código de error HTTP 409 (Conflict) para conflictos de silla.

### Frontend - Agenda Global
- **Archivo:** `frontend/src/app/components/agenda/agenda-global/agenda-global.component.ts`
  - Agregado `HttpClient` para consultar configuración de empresa.
  - Agregada propiedad `selectedCompany` y `empresaNroSillas`.
  - Agregado método `loadEmpresaConfig()` para obtener `NroSillas` de la empresa.
  - Agregado getter `sillaOptions` para generar opciones dinámicas de silla.
  - Modificado `loadCitas()` para usar colores por silla en lugar de colores por status.
  - Colores definidos: Silla 1 (Azul #3b82f6), Silla 2 (Verde #10b981), Silla 3 (Naranja #f59e0b), etc.

- **Archivo:** `frontend/src/app/components/agenda/agenda-global/agenda-global.component.html`
  - Modificado selector de silla para usar `*ngFor` con `sillaOptions` en lugar de opciones fijas.

### Frontend - Citas de Paciente
- **Archivo:** `frontend/src/app/components/pacientes/paciente-citas/paciente-citas.component.ts`
  - Modificado `loadCitas()` para cargar todas las citas y filtrar las que solapan con citas del paciente.
  - Citas del paciente se muestran con título normal.
  - Citas de otros pacientes en la misma fecha/hora se muestran como "Otra cita - Nombre (Silla X)".
  - Aplicados colores por silla para distinguir visualmente.
  - Agregada propiedad `isPacienteCita` en `extendedProps` para identificar citas propias.

## Reglas Implementadas
1. **Prohibición:** No se permiten dos citas en la misma `CodCia`, `FechaCita`, `HoraCita` y `Silla`.
2. **Permisión:** Se permiten citas en la misma fecha/hora si son en sillas distintas.
3. **Visualización:** En la agenda del paciente, se muestran ambas citas en el mismo recuadro horario con colores diferenciados por silla.
4. **Identificación:** Las citas de otros pacientes se marcan como "Otra cita" para distinguirlas.

## Colores por Silla
- Silla 1: Azul (#3b82f6)
- Silla 2: Verde (#10b981)
- Silla 3: Naranja (#f59e0b)
- Silla 4: Rojo (#ef4444)
- Silla 5: Violeta (#8b5cf6)
- Sillas adicionales: Gris (#6b7280)

## Validación
- Backend rechaza creación/modificación con HTTP 409 y mensaje detallado.
- Frontend usa número dinámico de sillas basado en `NroSillas` de la empresa.
- No se permite guardar citas con conflictos de silla.

## Archivos Afectados
- `backend/app/routers/citas.py`
- `frontend/src/app/components/agenda/agenda-global/agenda-global.component.ts`
- `frontend/src/app/components/agenda/agenda-global/agenda-global.component.html`
- `frontend/src/app/components/pacientes/paciente-citas/paciente-citas.component.ts`

## Pruebas Recomendadas
1. Crear cita en silla 1 a las 09:00.
2. Intentar crear otra cita en silla 1 a las 09:00 → Debe fallar con mensaje de error.
3. Crear cita en silla 2 a las 09:00 → Debe funcionar.
4. Verificar que ambas citas aparezcan en el mismo recuadro con colores distintos.
5. En vista de paciente, verificar que se muestren citas solapadas de otras sillas.