from fastapi import FastAPI
from api import apiRouter

app = FastAPI()

app.include_router(apiRouter, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Hello World test mit Docker refresh. Bazinga"}
