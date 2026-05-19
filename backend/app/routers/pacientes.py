from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from .. import schemas, database
from ..dependencies import get_cod_cia
import datetime

router = APIRouter(
    prefix="/api/pacientes",
    tags=["pacientes"],
    responses={404: {"description": "No encontrado"}},
)

@router.get("/", response_model=List[schemas.Paciente])
def get_pacientes(db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    sql = text("EXEC SP_Edicion_Pacientes @Accion='COT', @CodCia=:codcia, @PorcentajeDescuento=0")
    result = db.execute(sql, {"codcia": cod_cia}).fetchall()
    
    pacientes = []
    for row in result:
        row_dict = dict(row._mapping)
        row_dict["CodCia"] = cod_cia
        row_dict["Saldo"] = float(row_dict.get("Saldo") or 0.0)
        row_dict["CuentaTotal"] = float(row_dict.get("CuentaTotal") or 0.0)
        row_dict["Abonos"] = float(row_dict.get("Abonos") or 0.0)
        row_dict["Activo"] = int(row_dict.get("Activo") if row_dict.get("Activo") is not None else 1)
        
        # Mapear correctamente los nombres de columnas
        row_dict["DireccionHabitacion"] = row_dict.get("DireccionHaBITacion")
        row_dict["TelefHabita1"] = row_dict.get("TelefHaBITa1")
        row_dict["TelefHabita2"] = row_dict.get("TelefHaBITa2")
        
        # Corregir formato de fechas si traen hora
        if row_dict.get("FechaIngreso") and hasattr(row_dict["FechaIngreso"], "date"):
            row_dict["FechaIngreso"] = row_dict["FechaIngreso"].date()
        if row_dict.get("FechaNacimiento") and hasattr(row_dict["FechaNacimiento"], "date"):
            row_dict["FechaNacimiento"] = row_dict["FechaNacimiento"].date()
            
        pacientes.append(row_dict)
    return pacientes

@router.get("/{cedula}/{representado}", response_model=schemas.Paciente)
def get_paciente(cedula: str, representado: str, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    sql = text("EXEC SP_Edicion_Pacientes @Accion='COU', @CodCia=:codcia, @Cedula=:cedula, @Representado=:repres, @PorcentajeDescuento=0")
    result = db.execute(sql, {"codcia": cod_cia, "cedula": cedula, "repres": representado}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    row_dict = dict(result._mapping)
    row_dict["CodCia"] = cod_cia
    row_dict["CuentaTotal"] = float(row_dict.get("CuentaTotal") or 0.0)
    row_dict["Abonos"] = float(row_dict.get("Abonos") or 0.0)
    row_dict["Saldo"] = float(row_dict.get("Saldo") or 0.0)
    
    # Mapear correctamente los nombres de columnas
    row_dict["DireccionHabitacion"] = row_dict.get("DireccionHaBITacion")
    row_dict["TelefHabita1"] = row_dict.get("TelefHaBITa1")
    row_dict["TelefHabita2"] = row_dict.get("TelefHaBITa2")
    
    # Corregir formato de fechas si traen hora
    if row_dict.get("FechaIngreso") and hasattr(row_dict["FechaIngreso"], "date"):
        row_dict["FechaIngreso"] = row_dict["FechaIngreso"].date()
    if row_dict.get("FechaNacimiento") and hasattr(row_dict["FechaNacimiento"], "date"):
        row_dict["FechaNacimiento"] = row_dict["FechaNacimiento"].date()
    
    return row_dict

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_paciente(paciente: schemas.PacienteCreate, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    # SP espera fecha por defecto si viene None
    fecha_nac = paciente.FechaNacimiento.strftime('%Y%m%d') if paciente.FechaNacimiento else '19000101'
    
    repres = '00'
    if paciente.es_dependiente:
        # Calcular siguiente numero de representado
        # Primero verificamos si existe el representante principal (o algun registro)
        check_sql = text("SELECT MAX(CAST(Representado AS INT)) FROM Pacientes WHERE CodCia = :codcia AND Cedula = :cedula")
        max_rep = db.execute(check_sql, {"codcia": cod_cia, "cedula": paciente.Cedula}).scalar()
        
        if max_rep is None:
            # Significa que no existe esa cédula en la base de datos
            raise HTTPException(status_code=400, detail="El paciente representante no existe en el sistema. Registre al titular primero.")
        else:
            repres = f"{max_rep + 1:02d}"
    
    sql = text("""
        EXEC SP_Edicion_Pacientes 
            @Accion='INC', 
            @CodCia=:codcia, 
            @Cedula=:cedula,
            @Representado=:repres,
            @Nombre=:nombre,
            @NombreRepresentante=:nombre_rep,
            @FechaNacimiento=:fecha_nac,
            @NivelEducativo=:nivel_ed,
            @ArchivoFoto=:archivo_foto,
            @Sexo=:sexo,
            @GrupoSanguineo=:grupo_sang,
            @FactorRH=:factor_rh,
            @Activo=:activo,
            @EstadoCivil=:estado_civil,
            @Trato=:trato,
            @DireccionHaBITacion=:direccion_hab,
            @DireccionOficina=:direccion_ofi,
            @TelefHaBITa1=:telef_hab1,
            @TelefHaBITa2=:telef_hab2,
            @TelefOficina1=:telef_ofi1,
            @TelefOficina2=:telef_ofi2,
            @TelefCelular=:celular,
            @CorreoElectronico=:correo,
            @Recomendado=:recomendado,
            @HistoriaClinica=:historia,
            @Ocupacion=:ocupacion,
            @TipoPaciente=:tipo,
            @ObservacionPresupuesto=:obs_presupuesto,
            @PorcentajeDescuento=0
    """)
    db.execute(sql, {
        "codcia": cod_cia,
        "cedula": paciente.Cedula,
        "repres": repres,
        "nombre": paciente.Nombre,
        "nombre_rep": paciente.NombreRepresentante or '',
        "archivo_foto": paciente.ArchivoFoto or '',
        "fecha_nac": fecha_nac,
        "nivel_ed": paciente.NivelEducativo or 0,
        "sexo": paciente.Sexo or 0,
        "grupo_sang": paciente.GrupoSanguineo or 0,
        "factor_rh": paciente.FactorRH or 0,
        "activo": paciente.Activo or 1,
        "estado_civil": paciente.EstadoCivil or 0,
        "trato": paciente.Trato or '',
        "direccion_hab": paciente.DireccionHabitacion or '',
        "direccion_ofi": paciente.DireccionOficina or '',
        "telef_hab1": paciente.TelefHabita1 or '',
        "telef_hab2": paciente.TelefHabita2 or '',
        "telef_ofi1": paciente.TelefOficina1 or '',
        "telef_ofi2": paciente.TelefOficina2 or '',
        "celular": paciente.TelefCelular or '',
        "correo": paciente.CorreoElectronico or '',
        "recomendado": paciente.Recomendado or '',
        "historia": paciente.HistoriaClinica or '',
        "ocupacion": paciente.Ocupacion or '',
        "tipo": paciente.TipoPaciente or 1,
        "obs_presupuesto": paciente.ObservacionPresupuesto or ''
    })
    db.commit()
    return {"message": "Paciente creado exitosamente", "cedula": paciente.Cedula, "representado": repres}

@router.put("/{cedula}/{representado}")
def update_paciente(cedula: str, representado: str, paciente: schemas.PacienteCreate, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    # Verificar si el paciente está inactivo (eliminado)
    check_sql = text("SELECT Activo FROM Pacientes WHERE CodCia = :codcia AND Cedula = :cedula AND Representado = :repres")
    check_result = db.execute(check_sql, {"codcia": cod_cia, "cedula": cedula, "repres": representado}).fetchone()
    
    if check_result:
        current_activo = int(check_result._mapping.get("Activo", 1))
        if current_activo == 0 and paciente.Activo != 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No se puede editar un paciente eliminado. Solo se permite reactivarlo."
            )
    
    fecha_nac = paciente.FechaNacimiento.strftime('%Y%m%d') if paciente.FechaNacimiento else '19000101'
    
    sql = text("""
        EXEC SP_Edicion_Pacientes 
            @Accion='MOD', 
            @CodCia=:codcia, 
            @Cedula=:cedula,
            @Representado=:repres,
            @Nombre=:nombre,
            @NombreRepresentante=:nombre_rep,
            @FechaNacimiento=:fecha_nac,
            @NivelEducativo=:nivel_ed,
            @ArchivoFoto=:archivo_foto,
            @Sexo=:sexo,
            @GrupoSanguineo=:grupo_sang,
            @FactorRH=:factor_rh,
            @Activo=:activo,
            @EstadoCivil=:estado_civil,
            @Trato=:trato,
            @DireccionHaBITacion=:direccion_hab,
            @DireccionOficina=:direccion_ofi,
            @TelefHaBITa1=:telef_hab1,
            @TelefHaBITa2=:telef_hab2,
            @TelefOficina1=:telef_ofi1,
            @TelefOficina2=:telef_ofi2,
            @TelefCelular=:celular,
            @CorreoElectronico=:correo,
            @Recomendado=:recomendado,
            @HistoriaClinica=:historia,
            @Ocupacion=:ocupacion,
            @TipoPaciente=:tipo,
            @ObservacionPresupuesto=:obs_presupuesto,
            @PorcentajeDescuento=0
    """)
    db.execute(sql, {
        "codcia": cod_cia,
        "cedula": cedula,
        "repres": representado,
        "nombre": paciente.Nombre,
        "nombre_rep": paciente.NombreRepresentante or '',
        "archivo_foto": paciente.ArchivoFoto or '',
        "fecha_nac": fecha_nac,
        "nivel_ed": paciente.NivelEducativo or 0,
        "sexo": paciente.Sexo or 0,
        "grupo_sang": paciente.GrupoSanguineo or 0,
        "factor_rh": paciente.FactorRH or 0,
        "activo": paciente.Activo or 1,
        "estado_civil": paciente.EstadoCivil or 0,
        "trato": paciente.Trato or '',
        "direccion_hab": paciente.DireccionHabitacion or '',
        "direccion_ofi": paciente.DireccionOficina or '',
        "telef_hab1": paciente.TelefHabita1 or '',
        "telef_hab2": paciente.TelefHabita2 or '',
        "telef_ofi1": paciente.TelefOficina1 or '',
        "telef_ofi2": paciente.TelefOficina2 or '',
        "celular": paciente.TelefCelular or '',
        "correo": paciente.CorreoElectronico or '',
        "recomendado": paciente.Recomendado or '',
        "historia": paciente.HistoriaClinica or '',
        "ocupacion": paciente.Ocupacion or '',
        "tipo": paciente.TipoPaciente or 1,
        "obs_presupuesto": paciente.ObservacionPresupuesto or ''
    })
    db.commit()
    return {"message": "Paciente actualizado exitosamente"}

@router.put("/{cedula}/{representado}/reactivar")
def reactivar_paciente(cedula: str, representado: str, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    sql = text("EXEC SP_Edicion_Pacientes @Accion='REC', @CodCia=:codcia, @Cedula=:cedula, @Representado=:repres, @PorcentajeDescuento=0")
    db.execute(sql, {"codcia": cod_cia, "cedula": cedula, "repres": representado})
    db.commit()
    return {"message": "Paciente reactivado exitosamente"}

@router.delete("/{cedula}/{representado}")
def delete_paciente(cedula: str, representado: str, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    sql = text("EXEC SP_Edicion_Pacientes @Accion='ELI', @CodCia=:codcia, @Cedula=:cedula, @Representado=:repres, @PorcentajeDescuento=0")
    db.execute(sql, {"codcia": cod_cia, "cedula": cedula, "repres": representado})
    db.commit()
    return {"message": "Paciente eliminado (inactivado) exitosamente"}
