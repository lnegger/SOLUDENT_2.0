import os
import uuid
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter(
    prefix="/api/upload",
    tags=["upload"]
)

# Directorio donde se guardarán las fotos
UPLOAD_DIR = "uploads/fotos_pacientes"

@router.post("/foto")
async def upload_foto(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No se ha proporcionado ningún archivo")
        
    # Verificar extensión simple
    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp']:
        raise HTTPException(status_code=400, detail="Tipo de archivo no permitido. Solo imágenes.")

    # Generar un nombre único para evitar sobrescribir
    unique_filename = f"{uuid.uuid4().hex}{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Asegurarse de que el directorio existe (aunque se crea en main.py)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    try:
        # Guardar el archivo físicamente
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        # Retornar la ruta estática para la base de datos
        # Nota: La carpeta 'uploads' está montada en '/static'
        # Por lo tanto, uploads/fotos_pacientes/archivo.jpg -> /static/fotos_pacientes/archivo.jpg
        return {"path": f"/static/fotos_pacientes/{unique_filename}"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar el archivo: {str(e)}")
