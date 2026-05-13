# Walkthrough: Lógica de Titulares y Dependientes (Representados)

¡La estructura completa para manejar pacientes Titulares y Dependientes usando el campo `Representado` ha sido implementada! 

## ¿Qué se logró?

1. **Backend Automatizado (FastAPI)**
   - El esquema principal (`PacienteBase`) y `PacienteCreate` fueron ampliados.
   - El endpoint de creación (`POST /api/pacientes/`) ahora recibe un `es_dependiente` booleano. 
   - **Cálculo Automático**: Si `es_dependiente` es `True`, el backend busca en la base de datos a los pacientes que comparten esa misma cédula, obtiene el valor máximo de `Representado` (ej. `'00'`), le suma 1, y asigna automáticamente el `'01'`, `'02'`, etc. al nuevo dependiente. Si `es_dependiente` es `False`, automáticamente asume que es el titular y le asigna `'00'`.
   - Todas las operaciones CRUD ahora dependen de la combinación `/cedula/representado`.

2. **Refactorización de Interfaz (Angular)**
   - **Formulario (UI)**: El formulario `PacienteForm` ahora inicia preguntando el **Tipo de Registro** (Titular Principal o Dependiente).
   - **Dinámica Visual**: Al elegir "Dependiente", el texto del input cambia de "Cédula de Identidad" a "Cédula del Representante" para guiar al usuario.
   - **Listado y Rutas**: La lista de pacientes ahora muestra un distintivo visual (Badge) que dice "Titular" o "Dependiente". Además, las rutas de Angular ahora envían a editar correctamente a `/pacientes/editar/:cedula/:representado` para prevenir conflictos de datos.

## Cómo Probarlo
1. **Crear Titular**: Ve a "NUEVO PACIENTE", asegúrate de que esté marcado "Titular Principal", pon una cédula y guárdalo.
2. **Crear Dependiente**: Ve a "NUEVO PACIENTE" nuevamente. Esta vez, **selecciona "Dependiente"**. Escribe **la misma cédula del titular**, pon el nombre del hijo/dependiente y guarda.
3. **Verificar**: En el listado verás dos pacientes con la misma cédula, pero uno tendrá el badge de "Titular" y el otro el de "Dependiente". Ambos pueden editarse y eliminarse de forma independiente gracias a que la URL respeta el campo Representado interno.
