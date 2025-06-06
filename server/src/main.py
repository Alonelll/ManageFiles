from api import apiRouter
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from db import db_init
from util.env_util import env
import os

PUBLICPATH = env("PUBLICPATH")
INDEXPATH = env("INDEXPATH")

db_init()

app = FastAPI()

app.mount(
    "/public",
    StaticFiles(directory = PUBLICPATH, html=False),
    name = "static"
)

@app.get('/')
async def root():
    return RedirectResponse("/view")

@app.get("/view")
async def view():
    with open(INDEXPATH, "r") as f:
        htmlContent = f.read()
    return HTMLResponse(content=htmlContent)

app.include_router(apiRouter, prefix="/api")
