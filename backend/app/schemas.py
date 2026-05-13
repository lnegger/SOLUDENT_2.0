from pydantic import BaseModel
from typing import Optional, Any

class Token(BaseModel):
    access_token: str
    token_type: str
    usuario: Optional[Any] = None

class TokenData(BaseModel):
    username: Optional[str] = None

class Empresa(BaseModel):
    CodigoEmpresa: str
    NombreEmpresa: Optional[str] = None
    Nombre: Optional[str] = None
    Direccion: Optional[str] = None
    Telefono1: Optional[str] = None
    Correo: Optional[str] = None
    SimboloMoneda: Optional[str] = None
    NroSillas: Optional[int] = None

    class Config:
        from_attributes = True

class UsuarioBase(BaseModel):
    CodigoUsuario: str
    NombreUsuario: str

class UsuarioCreate(UsuarioBase):
    ClaveAcceso: str

class Usuario(UsuarioBase):
    CodCia: str

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

# Esquemas para Pacientes
from datetime import date

class PacienteBase(BaseModel):
    Cedula: str
    Representado: Optional[str] = "00"
    Nombre: str
    NombreRepresentante: Optional[str] = None
    ArchivoFoto: Optional[str] = ''
    FechaNacimiento: Optional[date] = None
    NivelEducativo: Optional[int] = 0
    Sexo: Optional[int] = 0
    GrupoSanguineo: Optional[int] = 0
    FactorRH: Optional[int] = 0
    Activo: Optional[int] = 1
    EstadoCivil: Optional[int] = 0
    Trato: Optional[str] = None
    DireccionHabitacion: Optional[str] = None
    DireccionOficina: Optional[str] = None
    TelefHabita1: Optional[str] = None
    TelefHabita2: Optional[str] = None
    TelefOficina1: Optional[str] = None
    TelefOficina2: Optional[str] = None
    TelefCelular: Optional[str] = None
    CorreoElectronico: Optional[str] = None
    Recomendado: Optional[str] = None
    HistoriaClinica: Optional[str] = None
    Ocupacion: Optional[str] = None
    TipoPaciente: Optional[int] = 1
    ObservacionPresupuesto: Optional[str] = None

class PacienteCreate(PacienteBase):
    CodCia: str = "01"
    es_dependiente: Optional[bool] = False

class Paciente(PacienteBase):
    CodCia: str
    FechaIngreso: Optional[date] = None
    CuentaTotal: Optional[float] = 0.0
    Abonos: Optional[float] = 0.0
    Saldo: Optional[float] = 0.0
    CamposClave: Optional[str] = None

    class Config:
        from_attributes = True

class CitaBase(BaseModel):
    FechaCita: date
    HoraCita: str
    HoraFin: Optional[str] = None
    Silla: int
    CedulaPaciente: str
    Representado: str
    Confirmada: bool = False
    Motivo: Optional[str] = None

class CitaCreate(CitaBase):
    pass

class CitaResponse(CitaBase):
    CodCia: str
    NombrePaciente: Optional[str] = None
    StatusCita: Optional[str] = None
    StatusDesc: Optional[str] = None
    HoraReal: Optional[str] = None
    Turno: Optional[str] = None
    EstaConfirmadaDesc: Optional[str] = None

    class Config:
        from_attributes = True

