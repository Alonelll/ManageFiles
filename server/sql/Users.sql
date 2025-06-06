CREATE TABLE IF NOT EXISTS Users (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL,
    secret varchar(255) NOT NULL
) ENGINE = InnoDB;
