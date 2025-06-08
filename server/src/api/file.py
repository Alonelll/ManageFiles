from typing import Collection
from .router import apiRouter
from db.ConnectDb import ConnectDb
from fastapi import File, Path, UploadFile
from fastapi.responses import FileResponse, PlainTextResponse, StreamingResponse
from pathlib import Path
from util.b64_util import b64strEncode
from .shared import get_file, dir_id_resolve, get_filepath_args
import base64
import io
import sys

@apiRouter.get("/file/{path:path}")
async def fileGet(path:str):
# Retrieve the file at the given remainder of the path after /file/

    # deconstruct path
    dirpath, filename, mountpath = get_filepath_args(path)

    # return file if it is mounted
    if mountpath.exists():
        return FileResponse(
            path=mountpath,
            media_type="application/octet-stream",
            filename=filename
        )
    
    # retrieve file data from db
    conn = ConnectDb()
    dir_id = dir_id_resolve(conn, dirpath)
    filedata = get_file(conn, dir_id, filename, "data")

    # open buffer from b64 string
    data = base64.b64decode(filedata)
    buffer = io.BytesIO(data)
    buffer.seek(0)
    
    # return stream
    return StreamingResponse(
        buffer,
        media_type="application/octet-stream",
        headers={ "Content-Disposition": f"attachment; filename=\"{filename}\"" }
    )

@apiRouter.post("/file/{path:path}")
async def file_post(path:str, file:UploadFile=File(...)):
# Upload a file to the given remainder of the path after /file/

    # deconstruct path
    dirpath, filename, mountpath = get_filepath_args(path)

    # retrieve uploaded data
    content = await file.read()
    contentSize = sys.getsizeof(content)

    # get db params
    conn = ConnectDb()
    dir_id = dir_id_resolve(conn, dirpath)

    # save file to fs if larger than 1MB
    if (contentSize > 1_000_000):
        Path(dirpath).mkdir(
            parents=True, 
            exist_ok=True
        )
        with open(mountpath, "wb") as f:
            f.write(content)
        b64 = None
    else:
        # encode content for db
        b64 = b64strEncode(content)

    # delete old file
    if dir_id:
        conn.execute("DELETE FROM Files WHERE name=? AND dir_id=?", filename, dir_id)
    else:
        conn.execute("DELETE FROM Files WHERE name=? AND dir_id IS NULL", filename)

    # insert new file
    conn.execute("INSERT INTO Files (name, data, dir_id) VALUES (?, ?, ?)", filename, b64, dir_id)
    conn.commit()

    return PlainTextResponse(f"Successfully uploaded file at {path}. Size: {contentSize}")
