# Iniciar con uvicorn app:app --reload
import json
from calc import solver
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

"""
CONFIGURACION PARA ENVIO DE RESPUESTAS Y SOLICITUDES AL FRONTEND.
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
METODO POST
    Recibe:
        - JSON con conexiones de los nodos.
        - JSON con etapas de los nodo.
    Responde:
        - JSON con la solución del problema y los caminos optimos
        - Error si
            - No se puede enviar o recibir los datos.
"""


@app.post('/data')
async def send(request: Request):
    try:
        data = await request.json()
        conexiones = json.loads(data.get("conexiones"))
        etapas = json.loads(data.get("etapas"))
        # Llama a la funcion que soluciona el problema en calc.py
        solucion, camino = solver(conexiones, etapas)
        print(solucion, camino)
        response_data = {"solucion": solucion, "camino": camino}
        return response_data
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al procesar los datos: {str(e)}")
