
import os
from api import apiRouter as router
from fastapi.responses import HTMLResponse
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(router, prefix="/api")

app.mount(
    "/", 
    StaticFiles(directory = os.environ["PUBLICPATH"], html=False), 
    name = "static"
)

@app.get("/")
async def root(request:Request):
    with open(os.environ["INDEXPATH"], "r") as f:
        htmlContent = f.read()
    return HTMLResponse(content=htmlContent)
