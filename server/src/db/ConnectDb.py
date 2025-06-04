import os
import typing
import mariadb
import sys

class ConnectDb ():

    CONFIG = {
        "host": os.environ["DB_HOST"],
        "port": 3306,
        "database": os.environ['DB_NAME']
    }

    _connection:mariadb.Connection

    @property
    def _getCursor(self) -> mariadb.Cursor:
        return self._connection.cursor()

    def __init__(self, user:str, password:str):
        self._connection = mariadb.connect(
            user=user,
            password=password,
            **self.CONFIG
        )

    def __del__(self):
        self._connection.close()

    def select(self, table:str, cols:list[str] = ["*"], crit:dict = None) -> list[dict]:
        cursor = self._getCursor()

        if not crit:
            cursor.execute(f"SELECT {cols.join(',')} FROM {table}")
        else:
            cursor.execute(f"SELECT {cols.join(',')} FROM {table} WHERE {[f"{k}={v}" for k, v in crit.items()].join(' AND ')}")

        return cursor.fetchall()
