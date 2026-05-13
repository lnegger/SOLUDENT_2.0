import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    print("Testing COB:")
    sql = text("EXEC SP_Edicion_Pacientes @Accion='COB', @CodCia='01', @PorcentajeDescuento=0")
    result = conn.execute(sql).fetchall()
    if result:
        print("COB columns:", result[0]._mapping.keys())
        print("COB row 1:", dict(result[0]._mapping))
    else:
        print("COB returned no results.")
    
    print("\nTesting COT:")
    sql = text("EXEC SP_Edicion_Pacientes @Accion='COT', @CodCia='01', @PorcentajeDescuento=0")
    result = conn.execute(sql).fetchall()
    if result:
        print("COT columns:", result[0]._mapping.keys())
        print("COT row 1:", dict(result[0]._mapping))
    else:
        print("COT returned no results.")
