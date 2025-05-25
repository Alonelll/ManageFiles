import mariadb
import sys

def connect_db():
    try:
        conn = mariadb.connect(
            user="test",
            password="Test!1234",
            host="maradb",      # Docker Service Name
            port=3306,
            database="file_management"
        )
        print("✅ Verbindung erfolgreich!")
        return conn
    except mariadb.Error as e:
        print(f"❌ Fehler bei Verbindung zu MariaDB: {e}")
        sys.exit(1)

if __name__ == "__main__":
    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT DATABASE();")
    db = cur.fetchone()
    print(f"Verbunden mit DB: {db[0]}")

# Select script um benutzer abzu fragen
# SELECT user, host, plugin FROM mysql.user WHERE user = 'test';

# Prompt um in den container rein zu gehen
# docker exec -it mariadb-local mariadb -u root -proot
