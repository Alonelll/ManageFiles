from pathlib import Path
from typing import Collection
from util.env_util import env
from fastapi import HTTPException
from db.ConnectDb import ConnectDb
from errors.PathError import PathError

MOUNT = env("FILEMOUNT")

def get_file(conn:ConnectDb, dir_id:int|None, filename:str, *args) -> str:

    if dir_id:
        result = conn.query(f"SELECT {','.join(args)} FROM Files WHERE dir_id=? AND name=? LIMIT 1", dir_id, filename)
    else:
        result = conn.query(f"SELECT {','.join(args)} FROM Files WHERE dir_id IS NULL AND name=? LIMIT 1", filename)

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"This file does not exist."
        )
    
    return result[0][0]


def dir_id_resolve(conn:ConnectDb, dirpath:str) -> int|None:

    try:
        return conn.resolve_dir(dirpath)
    except PathError:
        raise HTTPException(
            status_code=404,
            detail=f"This directory does not exist,"
        )
    
def get_filepath_args(path:str) -> Collection[Path]:

    fullpath = Path(path)
    dirpath = fullpath.parent
    filename = fullpath.name
    mountpath = MOUNT / fullpath
    return dirpath, filename, mountpath


