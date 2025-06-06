from pathlib import Path
from typing import Any
from errors import PathError
from util.env_util import env
import mariadb

DB_HOST = env("DB_HOST")
DB_NAME = env("DB_NAME")

class ConnectDb ():

    USERNAME="test"
    PASSWORD="password"

    CONFIG = {
        "host": DB_HOST,
        "port": 3306,
        "database": DB_NAME
    }

    _conn:mariadb.Connection

    def __init__(self):
        self._conn = mariadb.connect(
            user=self.USERNAME,
            password=self.PASSWORD,
            **self.CONFIG
        )

    def __del__(self):
        self._conn.close()

    def query(self, query:str, *args) -> list[dict[str,Any]]:
    # Execute a query to the database.
        cursor:mariadb.Cursor = self._conn.cursor()
        cursor.execute(query, args)
        result = cursor.fetchall()
        cursor.close()
        return result
    
    def execute(self, statement:str, *args) -> None:
        cursor:mariadb.Cursor = self._conn.cursor()
        cursor.execute(statement, args)
        cursor.close()

    def commit(self):
    # Commit all pending changes

        self._conn.commit()

    def create_tables(self, schema:dict[str,list[str]]):
    # Create tables from a schema.

        for _name in schema.keys():
            self.execute(f"CREATE TABLE IF NOT EXISTS {_name} (\n\t{",\n\t".join(schema[_name])}) ENGINE = InnoDB;\n\n")

    def resolve_dir(self, dirpath:str) -> int | None:

        id_buffer = None

        for _dir in Path(dirpath).parts:
            rows = self.query(f"SELECT id FROM Dirs WHERE name='{_dir}' AND pardir_id={id_buffer or "NULL"};")
            if not rows:
                raise PathError()
            id_buffer = rows[0][0]

        return id_buffer

