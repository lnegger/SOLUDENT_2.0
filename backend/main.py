import os # importamos la libreria os para manejar rutas y archivos
from fastapi import FastAPI, Depends, HTTPException, status # FastAPI, Depends, HTTPException, status son herramientas para crear apis 
from fastapi.middleware.cors import CORSMiddleware # CORSMiddleware es una herramienta para permitir que Angular se conecte a la api
from fastapi.staticfiles import StaticFiles # StaticFiles es una herramienta para permitir que Angular se conecte a la api
from sqlalchemy.orm import Session # Session es una herramienta para manejar la base de datos
from app import models, schemas, auth, database # importamos los modelos, esquemas, autenticación y base de datos de la aplicacion

# Directorio de subidas
os.makedirs("uploads/fotos_pacientes", exist_ok=True) # Creamos la carpeta uploads/fotos_pacientes si no existe

# Crear tablas (esto solo crea las que no existen, como ya existe Usuarios, no la alterará)
models.Base.metadata.create_all(bind=database.engine) # Creamos todas las tablas de la base de datos

app = FastAPI(title="SoluDent 2.0 API") # Creamos la aplicacion de FastAPI

# Configurar CORS para permitir que Angular se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción poner la URL de Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   # Configurar CORS para permitir que Angular se conecte  

# Montar carpeta estática
app.mount("/static", StaticFiles(directory="uploads"), name="static") # Montar carpeta estática

from app.routers import pacientes, upload, empresas, citas # Importamos los routers
app.include_router(pacientes.router)
app.include_router(upload.router)
app.include_router(empresas.router)
app.include_router(citas.router)


@app.get("/")
def root(): # Ruta raiz de la api
    return {"message": "Bienvenido a la API de SoluDent 2.0"}

@app.post("/api/auth/login", response_model=schemas.Token) # Ruta de login
def login(request: schemas.LoginRequest, db: Session = Depends(database.get_db)): # Login
    user = auth.get_user_by_username(db, username=request.username) # Obtenemos el usuario
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not auth.verify_password(request.password, user.ClaveAcceso):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES) # Expiración del token
    access_token = auth.create_access_token(
        data={"sub": user.CodigoUsuario}, expires_delta=access_token_expires
    ) # Creación del token
    return {"access_token": access_token, "token_type": "bearer", "usuario": {"CodigoUsuario": user.CodigoUsuario, "NombreUsuario": user.NombreUsuario}} # Retorno del token
