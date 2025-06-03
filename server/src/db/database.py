import mariadb
import sys

HOST = "mariadb-local"
PORT = 3306
DATABASE = "file_management"

def connect_db(user:str, password:str):
    return mariadb.connect(
        user=user,
        password=password,
        host=HOST,
        port=PORT,
        database=DATABASE
    )
