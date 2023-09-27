# Iniciar con uvicorn app:app --reload
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configura las cabeceras CORS para permitir solicitudes desde tu origen React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Reemplaza esto con el origen de tu aplicación React
    allow_credentials=True,
    allow_methods=["*"],  # Puedes especificar los métodos HTTP permitidos
    allow_headers=["*"],  # Puedes especificar las cabeceras permitidas
)

@app.get('/')
def get():
    ...

@app.post('/data')
async def send(request: Request):
    try:
        data = await request.json()
        conexiones = data.get("conexiones")
        etapas = data.get("etapas")

        # Realiza aquí el procesamiento de los datos, por ejemplo:
        # Calcula algo con conexiones y etapas
        

        # Devuelve una respuesta JSON apropiada
        response_data = {"message": "UwU"}
        return response_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar los datos: {str(e)}")
