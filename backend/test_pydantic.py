import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db
from app.routers.pacientes import get_pacientes
from app.schemas import Paciente
from typing import List

db_gen = get_db()
db = next(db_gen)

try:
    result = get_pacientes(db)
    print("Testing pydantic...")
    validated = [Paciente.model_validate(p) for p in result]
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
