import base64
import io
import os
import sys
from fastapi import File, HTTPException, Path, Request, UploadFile
from fastapi.responses import FileResponse, PlainTextResponse, StreamingResponse
from pathlib import Path

from db.ConnectDb import ConnectDb
from util.b64_util import b64strEncode
from .router import apiRouter

MOUNT = os.environ["FILEMOUNT"]

@apiRouter.get("/file/{filepath:path}")
async def fileGet(request:Request, filepath:str):

    filepath = os.path.normpath(filepath)
    
    folderName, fileName = os.path.split(filepath)

    mountedPath = os.path.join(MOUNT, filepath)

    # file exists in mounted directory
    if os.path.exists(mountedPath):
        return FileResponse(
            path=mountedPath,
            media_type="application/octet-stream",
            filename=fileName
        )

    conn = ConnectDb()
    
    result = conn.query(f"SELECT Files.data AS data FROM Files INNER JOIN Folders ON Files.FolderID=Folders.ID WHERE Folders.path='{folderName}' AND Files.name='{fileName}'")

    # file does not exist in database
    if not result:
        return HTTPException(
            status_code=404,
            detail="This file does not exist."
        )
    
    # file does exist in database
    data = base64.b64decode(result[0]["data"])

    buffer = io.BytesIO(data)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/octet-stream",
        headers={ "Content-Disposition": f"attachment; filename=\"{fileName}\"" }
    )

@apiRouter.post("/file/{filepath:path}")
async def filePost(request:Request, filepath:str, file:UploadFile = File(...)):

    filepath = os.path.normpath(filepath)

    folderName, fileName = os.path.split(filepath)

    content = await file.read()

    contentSize = sys.getsizeof(content)


    # file is larger than 1MB
    if (contentSize > 1_000_000):
        
        mountedPath = os.path.join(MOUNT, filepath)

        # create all needed dirs
        Path(folderName).mkdir(
            parents=True, 
            exist_ok=True
        )

        with open(mountedPath, "wb") as f:
            f.write(content)

        return PlainTextResponse(f"Successfully uploaded file at {filepath}. Size: {contentSize}")
    
    # file is smaller than 1MB

    conn = ConnectDb("test", "test")

    folderIdResult = conn.criteria_select("Folders", "id", {"path", filepath})

    if not folderIdResult:
        conn.query(f"INSERT INTO Folders (path) VALUES ({folderName})")

    b64 = b64strEncode(content)
    conn.query(f"INSERT INTO Files (name, data) VALUES ({fileName}, '{b64}')")
