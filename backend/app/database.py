from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Configuramos la conexión a SOLUDENT_20
SERVER = r'localhost\SQLEXPRESS2022'
DATABASE = 'SOLUDENT_20'
USERNAME = 'sa'
PASSWORD = 'clasified'
DRIVER = 'ODBC Driver 17 for SQL Server'

# Usamos urllib.parse para escapar el string de conexión si es necesario
import urllib.parse
params = urllib.parse.quote_plus(
    f"DRIVER={{{DRIVER}}};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD};TrustServerCertificate=yes"
)

SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
