from fastapi import Header, HTTPException
from typing import Optional


def get_cod_cia(x_codcia: Optional[str] = Header(None, alias="X-CodCia")) -> str:
    if not x_codcia:
        raise HTTPException(status_code=400, detail="Header X-CodCia es requerido")
    return x_codcia
