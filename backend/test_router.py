import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db
from app.routers.pacientes import get_pacientes

db_gen = get_db()
db = next(db_gen)

try:
    print("Testing get_pacientes directly...")
    result = get_pacientes(db)
    print("Success. Found", len(result), "pacientes.")
    print("First item:", result[0])
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
