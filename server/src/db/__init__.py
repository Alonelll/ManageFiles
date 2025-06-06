from util.env_util import env
from .ConnectDb import ConnectDb
from pathlib import Path

SQLPATH = env("SQLPATH")

def db_init():
    conn = ConnectDb()

    with open(Path(SQLPATH) / "manifest.txt", "r") as f:
        manifest = f.read().strip()

    for sql_path in manifest.split('\n'):
        with open(Path(SQLPATH) / sql_path, "r") as f:
            conn.execute(f.read())

    conn.commit()
    del conn


