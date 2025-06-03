from fastapi import FastAPI
from api.endpoints import router as material_router
from src.db.database import connect_db

app = FastAPI()

app.include_router(material_router, prefix="/api")

@app.get("/")
async def root():
    
    try:
        conn = connect_db("admin", "admin")
        return {"message": "Database connection successful"}
    except Exception as e:
        return {"error": str(e)}
