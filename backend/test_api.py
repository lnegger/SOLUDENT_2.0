import requests

url = "http://127.0.0.1:8000/api/pacientes/"
data = {
  "Cedula": "V20123456",
  "Nombre": "Test Paciente",
  "FechaNacimiento": "1990-01-01",
  "Sexo": 1,
  "Activo": 1,
  "DireccionHabitacion": "Test",
  "TelefCelular": "123",
  "CorreoElectronico": "test@test.com",
  "TipoPaciente": 1,
  "CodCia": "01",
  "Representado": "0"
}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
