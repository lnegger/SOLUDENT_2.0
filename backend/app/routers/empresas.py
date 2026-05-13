from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from .. import schemas, database

router = APIRouter(
    prefix="/api/empresas",
    tags=["empresas"],
    responses={404: {"description": "No encontrado"}},
)

@router.get("/", response_model=List[schemas.Empresa])
def get_empresas(db: Session = Depends(database.get_db)):
    sql = text("EXEC pGetEmpresas")
    result = db.execute(sql).fetchall()

    empresas = []
    for row in result:
        row_dict = dict(row._mapping)
        empresa_record = {
            "CodigoEmpresa": row_dict.get("CodigoEmpresa") or row_dict.get("CodCia") or row_dict.get("CodigoEmpresa"),
            "NombreEmpresa": row_dict.get("NombreEmpresa") or row_dict.get("Nombre") or row_dict.get("NombreEmpresa"),
            "Nombre": row_dict.get("Nombre") or row_dict.get("NombreEmpresa") or None,
            "Direccion": row_dict.get("Direccion"),
            "Telefono1": row_dict.get("Telefono1"),
            "Correo": row_dict.get("Correo"),
            "SimboloMoneda": row_dict.get("SimboloMoneda"),
            "NroSillas": row_dict.get("NroSillas") or row_dict.get("NroSilla") or None,
        }
        empresas.append(empresa_record)

    return empresas
