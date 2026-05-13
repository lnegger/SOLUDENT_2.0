# Directivas del Proyecto SOLUDENT 2.0

Este archivo contiene reglas y directrices establecidas por el usuario que deben aplicarse proactivamente a todo el desarrollo futuro del proyecto.

## 1. Paginación en Listas (Añadido: Mayo 2026)
**Directiva:** Todas las listas, tablas o directorios de elementos (pacientes, citas, presupuestos, etc.) que se creen en el sistema de ahora en adelante DEBEN implementar paginación obligatoria. 
- La idea es no mostrar una lista infinita que ocupe demasiado espacio en pantalla o sature la vista.
- Preferiblemente usar paginación del lado del cliente (si la carga en memoria lo permite) o del lado del servidor (si son miles de registros).
- El tamaño por defecto sugerido es de 10 a 15 elementos por página.
