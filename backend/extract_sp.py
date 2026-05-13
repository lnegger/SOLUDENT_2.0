import pyodbc

conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost\\SQLEXPRESS2022;DATABASE=SOLUDENT_20;UID=sa;PWD=clasified')
cursor = conn.cursor()
cursor.execute("SELECT definition FROM sys.sql_modules WHERE object_id = OBJECT_ID('SP_Edicion_Citas_Agenda');")
row = cursor.fetchone()
if row:
    with open('sp_citas.sql', 'w', encoding='utf-8') as f:
        f.write(row[0])
