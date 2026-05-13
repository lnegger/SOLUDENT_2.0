import urllib.parse
from sqlalchemy import create_engine, text
DRIVER = 'ODBC Driver 17 for SQL Server'
SERVER = r'localhost\SQLEXPRESS2022'
DATABASE = 'SOLUDENT_20'
USERNAME = 'sa'
PASSWORD = 'clasified'
params = urllib.parse.quote_plus(f'DRIVER={{{DRIVER}}};SERVER={SERVER};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD};TrustServerCertificate=yes')
engine = create_engine(f'mssql+pyodbc:///?odbc_connect={params}')
with engine.connect() as conn:
    result = conn.execute(text("EXEC sp_helptext 'SP_Edicion_Pacientes'"))
    for row in result:
        print(row[0], end='')
