# Install dependencies: pip install -r requirements.txt
# Run backend: fastapi dev main.py

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from paths import calculate_paths

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = False,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.post("/")
async def submit_data(req:Request):
    try:
        graph = await req.json()
        table_data, best_paths = calculate_paths(graph)
        return {'solution': table_data, 'paths': best_paths}
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error: {str(e)}")