
from api import apiRouter as router
from src.db.database import MariaDb
from fastapi import FastAPI

app = FastAPI()

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    
    try:
        conn = MariaDb.connect("test", "password")
        return {"message": "Database connection successful"}
    except Exception as e:
        return {"error": str(e)}
