# Plan de Implementación: Fotos de Pacientes

Este documento detalla los pasos para añadir la funcionalidad de fotos a los pacientes.

## 1. El paradigma Web vs Aplicación de Escritorio (IMPORTANTE)
En el sistema anterior (VB6), al ser una aplicación de escritorio, podías abrir una ventana para buscar directamente en el disco duro del servidor o en una carpeta de red compartida (`\\SERVIDOR\Fotos\`).

**En una aplicación Web moderna (Angular + FastAPI):**
El navegador por seguridad *no tiene acceso* al disco duro del servidor directamente. La forma estándar y correcta de hacerlo es:
1. El usuario hace clic en "Subir/Elegir Foto".
2. Se abre el buscador de archivos de **la computadora donde está usando el navegador**.
3. El archivo seleccionado se "sube" (upload) automáticamente al servidor (al Backend).
4. El Backend guarda ese archivo en una carpeta específica (ej. `C:\VBDesarrollo\SOLUDENT2.0\backend\uploads\fotos_pacientes\`).
5. En la Base de Datos solo se guarda el nombre del archivo (ej. `V12345678.jpg`).

Esto asegura que si mañana usas el sistema desde una Tablet o una PC en otro consultorio, la carga y visualización de fotos funcionará perfectamente.

## 2. Cambios en el Backend (FastAPI)
- Se añadirá el campo `ArchivoFoto` en los esquemas de Python.
- Se actualizará el SP `SP_Edicion_Pacientes` en las rutas de FastAPI (`INC` y `MOD`) para que reciba la ruta de la foto.
- Se creará un nuevo endpoint `POST /api/upload/foto` que reciba el archivo desde Angular y lo guarde en el directorio del servidor.
- Se configurará FastAPI para servir la carpeta de fotos públicamente, de modo que Angular pueda mostrar las imágenes (`GET /static/fotos/...`).

## 3. Cambios en el Frontend (Angular)
- **Directorio de Pacientes:** Se mostrará un círculo con la foto real del paciente si la tiene. Si no, seguirá mostrando la letra de su nombre.
- **Formulario de Pacientes:** 
  - Se añadirá un botón para cargar la foto.
  - Al cargarla, se mostrará una vista previa tamaño carnet.
  - Al guardar el paciente, se enviará el nombre del archivo al Backend.

¿Estás de acuerdo con este enfoque web para el manejo de los archivos?
