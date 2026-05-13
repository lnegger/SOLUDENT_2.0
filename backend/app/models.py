from sqlalchemy import Column, String, Integer, Date, Float
from .database import Base

class Usuario(Base):
    __tablename__ = "Usuarios"

    CodCia = Column(String(2), primary_key=True)
    CodigoUsuario = Column(String(20), primary_key=True)
    NombreUsuario = Column(String(50))
    ClaveAcceso = Column(String(100)) # Aumentado a 100 para soportar hashes bcrypt
    CamposClave = Column(String(22))

class Paciente(Base):
    __tablename__ = "Pacientes"

    CodCia = Column(String(2), primary_key=True)
    Cedula = Column(String(15), primary_key=True)
    Representado = Column(String(15))
    CamposClave = Column(String(30))
    Nombre = Column(String(100))
    FechaNacimiento = Column(Date)
    Sexo = Column(Integer)
    Activo = Column(Integer)
    DireccionHabitacion = Column(String(200))
    TelefCelular = Column(String(20))
    CorreoElectronico = Column(String(100))
    FechaIngreso = Column(Date)
    CuentaTotal = Column(Float)
    Abonos = Column(Float)
    Saldo = Column(Float)
    TipoPaciente = Column(Integer)

