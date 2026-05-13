from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import date

from .. import schemas, database
from ..dependencies import get_cod_cia

router = APIRouter(
    prefix="/api/citas",
    tags=["citas"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.CitaResponse])
def get_todas_las_citas(
    fecha_inicio: Optional[date] = None, 
    fecha_fin: Optional[date] = None, 
    db: Session = Depends(database.get_db), 
    cod_cia: str = Depends(get_cod_cia)
):
    query = "SELECT * FROM VW_CitasPorPaciente WHERE CodCia = :codcia"
    params = {"codcia": cod_cia}
    
    if fecha_inicio:
        query += " AND FechaCita >= :fecha_inicio"
        params["fecha_inicio"] = fecha_inicio
    if fecha_fin:
        query += " AND FechaCita <= :fecha_fin"
        params["fecha_fin"] = fecha_fin
        
    result = db.execute(text(query), params).fetchall()
    
    citas = []
    for r in result:
        row = r._mapping
        citas.append({
            "CodCia": row.get("CodCia"),
            "FechaCita": row.get("FechaCita"),
            "HoraCita": row.get("HoraCita"),
            "HoraFin": row.get("HoraFin"),
            "HoraReal": row.get("HoraReal"),
            "Turno": row.get("Turno"),
            "CedulaPaciente": row.get("CedulaPaciente"),
            "Representado": row.get("Representado"),
            "NombrePaciente": row.get("Nombre"),
            "StatusCita": row.get("StatusCita"),
            "Confirmada": bool(row.get("Confirmada", 0)),
            "Silla": row.get("Silla"),
            "Motivo": row.get("Motivo"),
            "StatusDesc": row.get("Status"),
            "EstaConfirmadaDesc": row.get("EstaConfirmada")
        })
    return citas

@router.get("/{cedula}/{representado}", response_model=List[schemas.CitaResponse])
def get_citas_paciente(
    cedula: str, 
    representado: str, 
    fecha_inicio: Optional[date] = None,
    fecha_fin: Optional[date] = None,
    db: Session = Depends(database.get_db), 
    cod_cia: str = Depends(get_cod_cia)
):
    query = """
        SELECT * FROM VW_CitasPorPaciente 
        WHERE CodCia = :codcia AND CedulaPaciente = :cedula AND Representado = :representado
    """
    params = {"codcia": cod_cia, "cedula": cedula, "representado": representado}
    
    if fecha_inicio:
        query += " AND FechaCita >= :fecha_inicio"
        params["fecha_inicio"] = fecha_inicio
    if fecha_fin:
        query += " AND FechaCita <= :fecha_fin"
        params["fecha_fin"] = fecha_fin
        
    result = db.execute(text(query), params).fetchall()
    
    citas = []
    for r in result:
        row = r._mapping
        citas.append({
            "CodCia": row.get("CodCia"),
            "FechaCita": row.get("FechaCita"),
            "HoraCita": row.get("HoraCita"),
            "HoraFin": row.get("HoraFin"),
            "HoraReal": row.get("HoraReal"),
            "Turno": row.get("Turno"),
            "CedulaPaciente": row.get("CedulaPaciente"),
            "Representado": row.get("Representado"),
            "NombrePaciente": row.get("Nombre"),
            "StatusCita": row.get("StatusCita"),
            "Confirmada": bool(row.get("Confirmada", 0)),
            "Silla": row.get("Silla"),
            "Motivo": row.get("Motivo"),
            "StatusDesc": row.get("Status"),
            "EstaConfirmadaDesc": row.get("EstaConfirmada")
        })
    return citas

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_cita(cita: schemas.CitaCreate, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    # Verificar conflicto de silla
    conflicto_sql = text("""
        SELECT COUNT(*) as count FROM VW_CitasPorPaciente 
        WHERE CodCia = :codcia AND FechaCita = :fecha AND HoraCita = :hora AND Silla = :silla
    """)
    conflicto_result = db.execute(conflicto_sql, {
        "codcia": cod_cia,
        "fecha": cita.FechaCita,
        "hora": cita.HoraCita,
        "silla": cita.Silla
    }).fetchone()
    if conflicto_result and conflicto_result._mapping.get("count", 0) > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La silla {cita.Silla} ya está ocupada en la fecha {cita.FechaCita} a las {cita.HoraCita}. Seleccione otra silla o cambie la hora."
        )
    
    # Verificar que el paciente esté activo antes de crear la cita
    check_sql = text("SELECT Activo FROM Pacientes WHERE CodCia = :codcia AND Cedula = :cedula AND Representado = :repres")
    check_result = db.execute(check_sql, {"codcia": cod_cia, "cedula": cita.CedulaPaciente, "repres": cita.Representado}).fetchone()
    if check_result:
        activo = int(check_result._mapping.get("Activo", 1))
        if activo == 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No se pueden asignar citas a un paciente eliminado. Debe reactivarlo primero."
            )
    sql = text("""
        EXEC SP_Edicion_Citas_Agenda 
            @Accion='INC', 
            @CodCia=:codcia, 
            @CedulaPaciente=:cedula, 
            @Representado=:representado, 
            @FechaCita=:fecha, 
            @HoraCita=:hora, 
            @Confirmada=:confirmada, 
            @Silla=:silla,
            @Motivo=:motivo,
            @HoraFin=:horafin
    """)
    db.execute(sql, {
        "codcia": cod_cia,
        "cedula": cita.CedulaPaciente,
        "representado": cita.Representado,
        "fecha": cita.FechaCita,
        "hora": cita.HoraCita,
        "confirmada": 1 if cita.Confirmada else 0,
        "silla": cita.Silla,
        "motivo": cita.Motivo,
        "horafin": cita.HoraFin
    })
    db.commit()
    return {"message": "Cita creada exitosamente"}

@router.put("/modificar", status_code=status.HTTP_200_OK)
def update_cita(cita: schemas.CitaCreate, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    # Verificar conflicto de silla (excluyendo la cita actual si es la misma)
    conflicto_sql = text("""
        SELECT COUNT(*) as count FROM VW_CitasPorPaciente 
        WHERE CodCia = :codcia AND FechaCita = :fecha AND HoraCita = :hora AND Silla = :silla
        AND NOT (CedulaPaciente = :cedula AND Representado = :representado)
    """)
    conflicto_result = db.execute(conflicto_sql, {
        "codcia": cod_cia,
        "fecha": cita.FechaCita,
        "hora": cita.HoraCita,
        "silla": cita.Silla,
        "cedula": cita.CedulaPaciente,
        "representado": cita.Representado
    }).fetchone()
    if conflicto_result and conflicto_result._mapping.get("count", 0) > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"La silla {cita.Silla} ya está ocupada en la fecha {cita.FechaCita} a las {cita.HoraCita}. Seleccione otra silla o cambie la hora."
        )
    
    # Verificar que el paciente esté activo antes de modificar la cita
    check_sql = text("SELECT Activo FROM Pacientes WHERE CodCia = :codcia AND Cedula = :cedula AND Representado = :repres")
    check_result = db.execute(check_sql, {"codcia": cod_cia, "cedula": cita.CedulaPaciente, "repres": cita.Representado}).fetchone()
    if check_result:
        activo = int(check_result._mapping.get("Activo", 1))
        if activo == 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No se pueden modificar citas de un paciente eliminado. Debe reactivarlo primero."
            )
    sql = text("""
        EXEC SP_Edicion_Citas_Agenda 
            @Accion='MOD', 
            @CodCia=:codcia, 
            @CedulaPaciente=:cedula, 
            @Representado=:representado, 
            @FechaCita=:fecha, 
            @HoraCita=:hora, 
            @Confirmada=:confirmada, 
            @Silla=:silla,
            @Motivo=:motivo,
            @HoraFin=:horafin
    """)
    db.execute(sql, {
        "codcia": cod_cia,
        "cedula": cita.CedulaPaciente,
        "representado": cita.Representado,
        "fecha": cita.FechaCita,
        "hora": cita.HoraCita,
        "confirmada": 1 if cita.Confirmada else 0,
        "silla": cita.Silla,
        "motivo": cita.Motivo,
        "horafin": cita.HoraFin
    })
    db.commit()
    return {"message": "Cita actualizada exitosamente"}

@router.delete("/{fecha}/{hora}/{silla}")
def delete_cita(fecha: date, hora: str, silla: int, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    sql = text("""
        EXEC SP_Edicion_Citas_Agenda 
            @Accion='ELI', 
            @CodCia=:codcia, 
            @CedulaPaciente='', 
            @Representado='', 
            @FechaCita=:fecha, 
            @HoraCita=:hora, 
            @Confirmada=0, 
            @Silla=:silla,
            @Motivo=NULL
    """)
    db.execute(sql, {"codcia": cod_cia, "fecha": fecha, "hora": hora, "silla": silla})
    db.commit()
    return {"message": "Cita eliminada exitosamente"}

@router.put("/estado/{fecha}/{hora}/{silla}")
def toggle_status(fecha: date, hora: str, silla: int, db: Session = Depends(database.get_db), cod_cia: str = Depends(get_cod_cia)):
    sql = text("""
        EXEC SP_Edicion_Citas_Agenda 
            @Accion='STA', 
            @CodCia=:codcia, 
            @CedulaPaciente='', 
            @Representado='', 
            @FechaCita=:fecha, 
            @HoraCita=:hora, 
            @Confirmada=0, 
            @Silla=:silla,
            @Motivo=NULL
    """)
    db.execute(sql, {"codcia": cod_cia, "fecha": fecha, "hora": hora, "silla": silla})
    db.commit()
    return {"message": "Estado de cita modificado"}
