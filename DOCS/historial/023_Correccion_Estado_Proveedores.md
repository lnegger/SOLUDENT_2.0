# Historial 023: Corrección de Estado en Lista de Proveedores

## Descripción del Problema
En la pantalla de la lista de proveedores, todos los proveedores aparecían con estado "Inactivo" aunque estuvieran activos en el sistema.

## Causa Raíz
El problema era originado por dos factores combinados:
1. En el backend, el esquema `DirectorioBase` en Pydantic (`backend/app/schemas.py`) no incluía la propiedad `Activo`. Por lo tanto, al retornar los resultados de la base de datos, FastAPI filtraba este campo, evitando que llegara al frontend.
2. En el frontend, la lógica de validación `isActivo()` en `proveedores-list.ts` solo verificaba si el valor era exactamente `'S'`. Si el backend retornaba un valor numérico (`'1'`), se evaluaba como falso (inactivo).

## Solución Implementada
- **Backend**: Se añadió el campo `Activo: Optional[str] = None` tanto a `DirectorioBase` (que heredan Laboratorios y Proveedores) como a `ColegaBase`, permitiendo que la API devuelva este valor.
- **Frontend**: Se modificó la validación en `proveedores-list.ts` para que considere como activo cualquier proveedor cuyo valor sea `'S'` o `'1'`.

## Archivos Modificados
- `backend/app/schemas.py`
- `frontend/src/app/components/directorio/proveedores/proveedores-list/proveedores-list.ts`
