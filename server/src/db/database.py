import os
import typing
import mariadb
import sys

class MariaDb ():

    CONFIG = {
        "host": os.environ["DB_HOST"],
        "port": 3306,
        "database": os.environ['DB_NAME']
    }

    @classmethod
    def connect(cls, user:str, password:str):
        return mariadb.connect(
        user=user,
        password=password,
        **cls.CONFIG
    )
