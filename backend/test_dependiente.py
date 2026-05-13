import requests

url = "http://127.0.0.1:8000/api/pacientes/"
data = {
  "Cedula": "V20123456",
  "Nombre": "Hijo Dependiente",
  "es_dependiente": True,
  "CodCia": "01",
  "Representado": "0"
}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
