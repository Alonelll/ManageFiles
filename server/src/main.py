from fastapi import FastAPI
from api.endpoints import router as material_router

app = FastAPI()


app.include_router(material_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Hello World test mit Docker refresh"}