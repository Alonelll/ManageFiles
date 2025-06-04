
import os
from db.ConnectDb import ConnectDb


class ConnectDbRoot (ConnectDb):

    def __init__(self):
        super().__init__("root", os.environ('MARIADB_ROOT_PASSWORD'))
