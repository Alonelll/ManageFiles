
import os
from api import apiRouter
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount(
    "/public",
    StaticFiles(directory = os.environ["PUBLICPATH"], html=False),
    name = "static"
)

@app.get('/')
async def root():
    return RedirectResponse("/view")

@app.get("/view")
async def view():
    with open(os.environ["INDEXPATH"], "r") as f:
        htmlContent = f.read()
    return HTMLResponse(content=htmlContent)

app.include_router(apiRouter, prefix="/api")
