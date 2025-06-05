from .ConnectDb import ConnectDb

DB_SCHEMA = {
    "Users": [
        "id int NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "name varchar(255) NOT NULL",
        "secret varchar(255) NOT NULL"
    ],
    "Folders": [
        "id int NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "path TEXT NOT NULL",
    ],
    "Files": [
        "id int NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "name TEXT NOT NULL",
        "folder_id int NOT NULL",
        "data LONGTEXT NOT NULL",
        "CONSTRAINT fk_folder FOREIGN KEY (folder_id) REFERENCES Folders (id) ON DELETE CASCADE ON UPDATE RESTRICT"
    ],
    "Comments": [
        "id int NOT NULL AUTO_INCREMENT PRIMARY KEY",
        "user_id int NOT NULL",
        "file_id int NOT NULL",
        "text TEXT NOT NULL",
        "CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE RESTRICT",
        "CONSTRAINT fk_file FOREIGN KEY (file_id) REFERENCES Files (id) ON DELETE CASCADE ON UPDATE RESTRICT"
    ]
}

conn = ConnectDb()
conn.create_tables(DB_SCHEMA)
conn.commit()
del conn


