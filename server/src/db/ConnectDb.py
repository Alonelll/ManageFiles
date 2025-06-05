import os
import mariadb

from typing import Any

class ConnectDb ():

    USERNAME="test"
    PASSWORD="password"

    CONFIG = {
        "host": os.environ["DB_HOST"],
        "port": 3306,
        "database": os.environ['DB_NAME']
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

    def query(self, query:str) -> list[dict[str,Any]]:
    # Execute a query to the database.
        print(query, end='\n\n')
        cursor:mariadb.Cursor = self._conn.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result
    
    def execute(self, statement:str) -> None:
        print(statement, end='\n\n')
        self._commit_buffer.append(statement)
        cursor:mariadb.Cursor = self._conn.cursor()
        cursor.execute(statement)
        cursor.close()

    def commit(self):
    # Commit all pending changes

        self._conn.commit()

    def create_tables(self, schema:dict[str,list[str]]):
    # Create a table from a schema.

        for _name in schema.keys():
            self.execute(f"CREATE TABLE IF NOT EXISTS {_name} (\n\t{",\n\t".join(schema[_name])}) ENGINE = InnoDB;\n\n")

    def select(self, table:str, cols:list[str] = ["*"], where:list[str] = []) -> list[dict[str,Any]]:
    # Select rows based on a list of conditions.

        if not where:
            return self.query(f"SELECT {cols.join(',')} FROM {table}")
        
        return self.query(f"SELECT {cols.join(',')} FROM {table} WHERE ({where.join(") AND (")})")

    def criteria_select(self, cursor, table:str, cols:list[str] = ["*"], crit:dict = None) -> list[dict[str,Any]]:
    # Select rows based on a dict of criteria. Only works for exact matches.

        where = [f"{k} = '{v}'" for k, v in crit.items()] if crit else []
        return self.select(table, cols, where)
