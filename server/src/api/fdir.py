import json
from errors.PathError import PathError
from fastapi.responses import PlainTextResponse
from .router import apiRouter
from db.ConnectDb import ConnectDb
from fastapi import HTTPException, Request
from pathlib import Path
from util.env_util import env
from .shared import MOUNT, dir_id_resolve

def get_path_args(path:str):
    dirpath = Path(path)
    mountpath = MOUNT / dirpath

    return dirpath, mountpath

@apiRouter.get("/dir/{path:path}")
def dir_get(path:str):

    dirpath, mountpath = get_path_args(path)

    # check if directory exists in file system
    if not mountpath.exists():
        raise HTTPException(
            status_code=404,
            detail="This directory does not exist."
        )
    
    # check if directory exists in database
    conn = ConnectDb()
    par_id = dir_id_resolve(conn, dirpath)
    
    children = []

    # get subdirectories from database
    if not par_id:
        db_subdir_results = conn.query("SELECT name FROM Dirs WHERE pardir_id IS NULL")
        db_file_results = conn.query("SELECT name FROM Files WHERE dir_id IS NULL")
    else:
        db_subdir_results = conn.query("SELECT name FROM Dirs WHERE pardir_id=?", par_id)
        db_file_results = conn.query("SELECT name FROM Files WHERE dir_id=?", par_id)

    # add subdirectories to children
    for _subdir in db_subdir_results:
        children.append({
            "name": _subdir[0],
            "type": "dir"
        })

    for _file in db_file_results:
        children.append({
            "name": _file[0],
            "type": "file"
        })

    for _file in mountpath.iterdir():
        if _file.is_file():
            children.append({
                "name": _file.name,
                "type": "file"
            })

    return json.dumps(children)

@apiRouter.post("/dir/{path:path}")
def dir_post(path:str):

    dirpath, mountpath = get_path_args(path)

    mountpath.mkdir(parents=True, exist_ok=True)

    conn = ConnectDb()
    parts = list(dirpath.parts)
    par_id = None

    while parts:
        part = parts[0]
        if par_id:
            db_res = conn.query("SELECT id FROM Dirs WHERE pardir_id=? AND name=?", par_id, part)
        else:
            db_res = conn.query("SELECT id FROM Dirs where pardir_id IS NULL AND name=?", part)

        if not db_res:
            break;

        parts.pop(0)
        par_id = db_res[0][0]

    if not parts:
        raise HTTPException(
            status_code=400,
            detail="This directory already exists."
        )

    while parts:
        part = parts.pop(0)

        conn.execute("INSERT INTO Dirs (name, pardir_id) VALUES (?, ?)", part, par_id)

        if par_id:
            par_id = conn.query("SELECT id FROM Dirs WHERE name=? AND pardir_id=?", part, par_id)[0][0]
        else:
            par_id = conn.query("SELECT id FROM Dirs WHERE name=? AND pardir_id IS NULL", part)[0][0]

    conn.commit()

    return PlainTextResponse(f"Successfully created directory at {dirpath}.")
    