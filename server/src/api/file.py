from .router import apiRouter
from db.ConnectDb import ConnectDb
from errors.PathError import PathError
from fastapi import File, HTTPException, Path, Request, UploadFile
from fastapi.responses import FileResponse, PlainTextResponse, StreamingResponse
from pathlib import Path
from util.b64_util import b64strEncode
from util.env_util import env
import base64
import io
import os
import sys

MOUNT = env("FILEMOUNT")

@apiRouter.get("/file/{filepath:path}")
async def fileGet(filepath:str):
# Retrieve the file at the given remainder of the path after /file/

    # deconstruct path
    fullpath = Path(filepath)
    dirpath = fullpath.parent
    filename = fullpath.name
    mountpath = MOUNT / fullpath

    # return file if it is mounted
    if os.path.exists(mountpath):
        return FileResponse(
            path=mountpath,
            media_type="application/octet-stream",
            filename=filename
        )
    
    conn = ConnectDb()
    
    # try to resolve the dir path
    try:
        dir_id = conn.resolve_dir(dirpath)
    except PathError:
        raise HTTPException(
            status_code=404,
            detail=f"This directory does not exist,"
        )
    
    if dir_id:
        result = conn.query("SELECT data FROM Files WHERE dir_id=? AND name=?", dir_id, filename)
    else:
        result = conn.query("SELECT data FROM Files WHERE dir_id IS NULL AND name=?", filename)

    # file does not exist in database
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"This file does not exist."
        )
    
    # open buffer from b64 string
    data = base64.b64decode(result[0][0])
    buffer = io.BytesIO(data)
    buffer.seek(0)
    
    # return stream
    return StreamingResponse(
        buffer,
        media_type="application/octet-stream",
        headers={ "Content-Disposition": f"attachment; filename=\"{filename}\"" }
    )

@apiRouter.post("/file/{filepath:path}")
async def file_post(filepath:str, file:UploadFile=File(...)):
# Upload a file to the given remainder of the path after /file/

    # deconstruct path
    fullpath = Path(filepath)
    dirpath = fullpath.parent
    filename = fullpath.name

    # retrieve uploaded data
    content = await file.read()
    contentSize = sys.getsizeof(content)

    # save file to fs if larger than 1MB
    if (contentSize > 1_000_000):
        mountpath = os.path.join(MOUNT, fullpath)
        Path(dirpath).mkdir(
            parents=True, 
            exist_ok=True
        )
        with open(mountpath, "wb") as f:
            f.write(content)
        return PlainTextResponse(f"Successfully uploaded file at {fullpath}. Size: {contentSize}")
    

    conn = ConnectDb()
    try: 
        dir_id = conn.resolve_dir(dirpath)
    except PathError:
        raise HTTPException(
            status_code=404,
            detail="Dieser directory does not exist."
        )

    b64 = b64strEncode(content)

    # delete old file
    if dir_id:
        conn.execute("DELETE FROM Files WHERE name=? AND dir_id=?", filename, dir_id)
    else:
        conn.execute("DELETE FROM Files WHERE name=? AND dir_id IS NULL", filename)

    # insert new file
    conn.execute("INSERT INTO Files (name, data, dir_id) VALUES (?, ?, ?)", filename, b64, dir_id)
    conn.commit()

    return PlainTextResponse(f"Successfully uploaded file at {fullpath}. Size: {contentSize}")
