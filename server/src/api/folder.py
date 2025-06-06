from .router import apiRouter
from db import ConnectDb
from fastapi import Request
from pathlib import PurePath
from util.env_util import env
import os

MOUNT = env("FILEMOUNT")

@apiRouter.get("/folder/{folderpath:path}")
def folder_get(request:Request, folderpath:str):

    folderpath = os.path.normpath(folderpath)

    content = []
    absPath = os.path.join(MOUNT, folderpath)

    for (dirname, dirs, files) in os.walk(absPath):

        for _dir in dirs:
            content.append({
                "type": "folder",
                "name": _dir
            })

        for _file in files:
            content.append({
                "type": "file",
                "name": _file
            })

    conn = ConnectDb()
    
    fileResults = conn.query(f"SELECT Files.name FROM Files INNER JOIN Folders ON Folder.id=Files.folder_id WHERE Folders.path={folderpath}")

    folderResults = conn.query(f"SELECT path FROM Folders WHERE (path LIKE '{folderpath}')")

    for _file in fileResults:

        content.append({
            "type": "file",
            "name": _file["name"]
        })

    for _folder in folderResults:

        relpath = os.path.relpath(_folder["path"], folderpath)

        if relpath == "/":
            continue

        initialStep = list(PurePath(relpath))
    
        content.append({
            "type": "folder",
            "name": initialStep
        })

    return str(content)
