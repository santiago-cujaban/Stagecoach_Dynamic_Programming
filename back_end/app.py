# Iniciar con uvicorn app:app --reload
import json
from calc import solver_walker
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/data')
async def send(request: Request):
    try:
        data = await request.json()
        conexiones = json.loads(data.get("conexiones"))
        etapas = json.loads(data.get("etapas"))
        solucion, camino = solver_walker(conexiones, etapas)        
        response_data = {"solucion": solucion, "camino":camino}
        return response_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar los datos: {str(e)}")
