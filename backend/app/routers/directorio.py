from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas
from app.database import get_db
from sqlalchemy import text

router = APIRouter(
    prefix="/directorio",
    tags=["directorio"],
    responses={404: {"description": "No encontrado"}},
)

# --- COLEGAS ---

@router.get("/colegas", response_model=list[schemas.ColegaResponse])
def get_colegas(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("EXEC sp_edicion_colegas @Accion='COT', @CodCia='01', @CodigoColega='', @NombreColega='', @DireccionHabitacion='', @DireccionOficina='', @TelefonoHabitacion1='', @TelefonoHabitacion2='', @TelefonoOficina1='', @TelefonoOficina2='', @Fax='', @CorreoElectronico='', @TelefonoCelular='', @Especialidad='', @Observacion=''")).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error consultando colegas: {str(e)}")

@router.post("/colegas", response_model=dict)
def create_colega(colega: schemas.ColegaCreate, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            EXEC sp_edicion_colegas 
                @Accion='INC', 
                @CodCia='01', 
                @CodigoColega=:CodigoColega, 
                @NombreColega=:NombreColega, 
                @DireccionHabitacion=:DireccionHabitacion, 
                @DireccionOficina=:DireccionOficina, 
                @TelefonoHabitacion1=:TelefonoHabitacion1, 
                @TelefonoHabitacion2=:TelefonoHabitacion2, 
                @TelefonoOficina1=:TelefonoOficina1, 
                @TelefonoOficina2=:TelefonoOficina2, 
                @Fax=:Fax, 
                @CorreoElectronico=:CorreoElectronico, 
                @TelefonoCelular=:TelefonoCelular, 
                @Especialidad=:Especialidad, 
                @Observacion=:Observacion
        """), {
            "CodigoColega": colega.CodigoColega,
            "NombreColega": colega.NombreColega,
            "DireccionHabitacion": colega.DireccionHabitacion or '',
            "DireccionOficina": colega.DireccionOficina or '',
            "TelefonoHabitacion1": colega.TelefonoHabitacion1 or '',
            "TelefonoHabitacion2": colega.TelefonoHabitacion2 or '',
            "TelefonoOficina1": colega.TelefonoOficina1 or '',
            "TelefonoOficina2": colega.TelefonoOficina2 or '',
            "Fax": colega.Fax or '',
            "CorreoElectronico": colega.CorreoElectronico or '',
            "TelefonoCelular": colega.TelefonoCelular or '',
            "Especialidad": colega.Especialidad or '',
            "Observacion": colega.Observacion or ''
        })
        db.commit()
        return {"message": "Colega creado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creando colega: {str(e)}")

@router.put("/colegas/{codigo}", response_model=dict)
def update_colega(codigo: str, colega: schemas.ColegaCreate, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            EXEC sp_edicion_colegas 
                @Accion='MOD', 
                @CodCia='01', 
                @CodigoColega=:CodigoColega, 
                @NombreColega=:NombreColega, 
                @DireccionHabitacion=:DireccionHabitacion, 
                @DireccionOficina=:DireccionOficina, 
                @TelefonoHabitacion1=:TelefonoHabitacion1, 
                @TelefonoHabitacion2=:TelefonoHabitacion2, 
                @TelefonoOficina1=:TelefonoOficina1, 
                @TelefonoOficina2=:TelefonoOficina2, 
                @Fax=:Fax, 
                @CorreoElectronico=:CorreoElectronico, 
                @TelefonoCelular=:TelefonoCelular, 
                @Especialidad=:Especialidad, 
                @Observacion=:Observacion
        """), {
            "CodigoColega": codigo,
            "NombreColega": colega.NombreColega,
            "DireccionHabitacion": colega.DireccionHabitacion or '',
            "DireccionOficina": colega.DireccionOficina or '',
            "TelefonoHabitacion1": colega.TelefonoHabitacion1 or '',
            "TelefonoHabitacion2": colega.TelefonoHabitacion2 or '',
            "TelefonoOficina1": colega.TelefonoOficina1 or '',
            "TelefonoOficina2": colega.TelefonoOficina2 or '',
            "Fax": colega.Fax or '',
            "CorreoElectronico": colega.CorreoElectronico or '',
            "TelefonoCelular": colega.TelefonoCelular or '',
            "Especialidad": colega.Especialidad or '',
            "Observacion": colega.Observacion or ''
        })
        db.commit()
        return {"message": "Colega actualizado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error actualizando colega: {str(e)}")

@router.delete("/colegas/{codigo}", response_model=dict)
def delete_colega(codigo: str, db: Session = Depends(get_db)):
    try:
        db.execute(text("EXEC sp_edicion_colegas @Accion='ELI', @CodCia='01', @CodigoColega=:CodigoColega, @NombreColega='', @DireccionHabitacion='', @DireccionOficina='', @TelefonoHabitacion1='', @TelefonoHabitacion2='', @TelefonoOficina1='', @TelefonoOficina2='', @Fax='', @CorreoElectronico='', @TelefonoCelular='', @Especialidad='', @Observacion=''"), {"CodigoColega": codigo})
        db.commit()
        return {"message": "Colega eliminado lógicamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error eliminando colega: {str(e)}")

# --- LABORATORIOS ---

@router.get("/laboratorios", response_model=list[schemas.LaboratorioResponse])
def get_laboratorios(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("EXEC sp_edicion_Laboratorios @Accion='COT', @CodCia='01', @CodigoLaboratorio='', @NombreLaboratorio='', @Contacto='', @DireccionOficina='', @TelefonoOficina1='', @TelefonoOficina2='', @Fax='', @CorreoElectronico='', @TelefonoCelular='', @Especialidad='', @Observacion=''")).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error consultando laboratorios: {str(e)}")

@router.post("/laboratorios", response_model=dict)
def create_laboratorio(lab: schemas.LaboratorioCreate, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            EXEC sp_edicion_Laboratorios 
                @Accion='INC', 
                @CodCia='01', 
                @CodigoLaboratorio=:CodigoLaboratorio, 
                @NombreLaboratorio=:NombreLaboratorio, 
                @Contacto=:Contacto, 
                @DireccionOficina=:DireccionOficina, 
                @TelefonoOficina1=:TelefonoOficina1, 
                @TelefonoOficina2=:TelefonoOficina2, 
                @Fax=:Fax, 
                @CorreoElectronico=:CorreoElectronico, 
                @TelefonoCelular=:TelefonoCelular, 
                @Especialidad=:Especialidad, 
                @Observacion=:Observacion
        """), {
            "CodigoLaboratorio": lab.CodigoLaboratorio,
            "NombreLaboratorio": lab.NombreLaboratorio,
            "Contacto": lab.Contacto or '',
            "DireccionOficina": lab.DireccionOficina or '',
            "TelefonoOficina1": lab.TelefonoOficina1 or '',
            "TelefonoOficina2": lab.TelefonoOficina2 or '',
            "Fax": lab.Fax or '',
            "CorreoElectronico": lab.CorreoElectronico or '',
            "TelefonoCelular": lab.TelefonoCelular or '',
            "Especialidad": lab.Especialidad or '',
            "Observacion": lab.Observacion or ''
        })
        db.commit()
        return {"message": "Laboratorio creado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creando laboratorio: {str(e)}")

@router.put("/laboratorios/{codigo}", response_model=dict)
def update_laboratorio(codigo: str, lab: schemas.LaboratorioCreate, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            EXEC sp_edicion_Laboratorios 
                @Accion='MOD', 
                @CodCia='01', 
                @CodigoLaboratorio=:CodigoLaboratorio, 
                @NombreLaboratorio=:NombreLaboratorio, 
                @Contacto=:Contacto, 
                @DireccionOficina=:DireccionOficina, 
                @TelefonoOficina1=:TelefonoOficina1, 
                @TelefonoOficina2=:TelefonoOficina2, 
                @Fax=:Fax, 
                @CorreoElectronico=:CorreoElectronico, 
                @TelefonoCelular=:TelefonoCelular, 
                @Especialidad=:Especialidad, 
                @Observacion=:Observacion
        """), {
            "CodigoLaboratorio": codigo,
            "NombreLaboratorio": lab.NombreLaboratorio,
            "Contacto": lab.Contacto or '',
            "DireccionOficina": lab.DireccionOficina or '',
            "TelefonoOficina1": lab.TelefonoOficina1 or '',
            "TelefonoOficina2": lab.TelefonoOficina2 or '',
            "Fax": lab.Fax or '',
            "CorreoElectronico": lab.CorreoElectronico or '',
            "TelefonoCelular": lab.TelefonoCelular or '',
            "Especialidad": lab.Especialidad or '',
            "Observacion": lab.Observacion or ''
        })
        db.commit()
        return {"message": "Laboratorio actualizado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error actualizando laboratorio: {str(e)}")

@router.delete("/laboratorios/{codigo}", response_model=dict)
def delete_laboratorio(codigo: str, db: Session = Depends(get_db)):
    try:
        db.execute(text("EXEC sp_edicion_Laboratorios @Accion='ELI', @CodCia='01', @CodigoLaboratorio=:CodigoLaboratorio, @NombreLaboratorio='', @Contacto='', @DireccionOficina='', @TelefonoOficina1='', @TelefonoOficina2='', @Fax='', @CorreoElectronico='', @TelefonoCelular='', @Especialidad='', @Observacion=''"), {"CodigoLaboratorio": codigo})
        db.commit()
        return {"message": "Laboratorio eliminado lógicamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error eliminando laboratorio: {str(e)}")

# --- PROVEEDORES ---

@router.get("/proveedores", response_model=list[schemas.ProveedorResponse])
def get_proveedores(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("EXEC sp_edicion_proveedores @Accion='COT', @CodCia='01', @CodigoProveedor='', @NombreProveedor='', @Contacto='', @DireccionOficina='', @TelefonoOficina1='', @TelefonoOficina2='', @Fax='', @CorreoElectronico='', @TelefonoCelular='', @Especialidad='', @Observacion=''")).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error consultando proveedores: {str(e)}")

@router.post("/proveedores", response_model=dict)
def create_proveedor(prov: schemas.ProveedorCreate, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            EXEC sp_edicion_proveedores 
                @Accion='INC', 
                @CodCia='01', 
                @CodigoProveedor=:CodigoProveedor, 
                @NombreProveedor=:NombreProveedor, 
                @Contacto=:Contacto, 
                @DireccionOficina=:DireccionOficina, 
                @TelefonoOficina1=:TelefonoOficina1, 
                @TelefonoOficina2=:TelefonoOficina2, 
                @Fax=:Fax, 
                @CorreoElectronico=:CorreoElectronico, 
                @TelefonoCelular=:TelefonoCelular, 
                @Especialidad=:Especialidad, 
                @Observacion=:Observacion
        """), {
            "CodigoProveedor": prov.CodigoProveedor,
            "NombreProveedor": prov.NombreProveedor,
            "Contacto": prov.Contacto or '',
            "DireccionOficina": prov.DireccionOficina or '',
            "TelefonoOficina1": prov.TelefonoOficina1 or '',
            "TelefonoOficina2": prov.TelefonoOficina2 or '',
            "Fax": prov.Fax or '',
            "CorreoElectronico": prov.CorreoElectronico or '',
            "TelefonoCelular": prov.TelefonoCelular or '',
            "Especialidad": prov.Especialidad or '',
            "Observacion": prov.Observacion or ''
        })
        db.commit()
        return {"message": "Proveedor creado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creando proveedor: {str(e)}")

@router.put("/proveedores/{codigo}", response_model=dict)
def update_proveedor(codigo: str, prov: schemas.ProveedorCreate, db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            EXEC sp_edicion_proveedores 
                @Accion='MOD', 
                @CodCia='01', 
                @CodigoProveedor=:CodigoProveedor, 
                @NombreProveedor=:NombreProveedor, 
                @Contacto=:Contacto, 
                @DireccionOficina=:DireccionOficina, 
                @TelefonoOficina1=:TelefonoOficina1, 
                @TelefonoOficina2=:TelefonoOficina2, 
                @Fax=:Fax, 
                @CorreoElectronico=:CorreoElectronico, 
                @TelefonoCelular=:TelefonoCelular, 
                @Especialidad=:Especialidad, 
                @Observacion=:Observacion
        """), {
            "CodigoProveedor": codigo,
            "NombreProveedor": prov.NombreProveedor,
            "Contacto": prov.Contacto or '',
            "DireccionOficina": prov.DireccionOficina or '',
            "TelefonoOficina1": prov.TelefonoOficina1 or '',
            "TelefonoOficina2": prov.TelefonoOficina2 or '',
            "Fax": prov.Fax or '',
            "CorreoElectronico": prov.CorreoElectronico or '',
            "TelefonoCelular": prov.TelefonoCelular or '',
            "Especialidad": prov.Especialidad or '',
            "Observacion": prov.Observacion or ''
        })
        db.commit()
        return {"message": "Proveedor actualizado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error actualizando proveedor: {str(e)}")

@router.delete("/proveedores/{codigo}", response_model=dict)
def delete_proveedor(codigo: str, db: Session = Depends(get_db)):
    try:
        db.execute(text("EXEC sp_edicion_proveedores @Accion='ELI', @CodCia='01', @CodigoProveedor=:CodigoProveedor, @NombreProveedor='', @Contacto='', @DireccionOficina='', @TelefonoOficina1='', @TelefonoOficina2='', @Fax='', @CorreoElectronico='', @TelefonoCelular='', @Especialidad='', @Observacion=''"), {"CodigoProveedor": codigo})
        db.commit()
        return {"message": "Proveedor eliminado lógicamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error eliminando proveedor: {str(e)}")
