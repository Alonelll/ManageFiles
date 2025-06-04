# ManageFiles

Implementierung für Gruppenarbeit in Klasse FI-23
Problem: Dateien werden unstrukturiert in verschiedenen Verzeichnissen abgelegt

# Requirements

### Problem

Dateien werden unstrukturiert in verschiedenen Verzeichnissen abgelegt.

### Auftrag

<<<<<<< HEAD
Erstellen Anwendung die es ermöglicht Lernmaterialien systematisch zu speichern, gezielt zu durchsuchen, zu kommentieren und revisionssicher abzulegen.

- Dateien bis 1 MB: Direkt in der Datenbank speichern
- Dateien über 1 MB: Zu einem definierten Speicherort speichern

### Unterstützte Dateiformate:

- PDF
- DOCX
- JPEG
- Python-Dateien

# Dependencies

### Techstack

- Python3 @3.13
- FastAPI @0.115.25
- Uvicorn @0.34.2
- ReactJS @19.1
- TailwindCSS @3.4.17
- Typescript @4.9.5

### Zusätzliche Libraries

- PyTest @8.3.5

# Setup

    cd client && npm install && cd ../server && python3 -m venv ./.venv && ./.venv/bin/pip install -r requirements.txt

# Lehrkräfte können folgende Requests an die Database machen

- hinzufügen (hochladen)
- suchen und öffnen (herunterladen).

Die Materialien können z. B. PDFs, Office-Dokumente oder Quellcodedateien sein. Für die Suche sollen dem Benutzer mindestens sieben Standardsuchbefehle zur Verfü-
gung stehen. Vorgabe für die Suchbefehle sind:

- Zwei Aggregationen
- Zwei Joins (Inner)
- Ein Join, plus eine Aggregation
- Zwei Joins (Inner) über mehrere Tabellen

# Docker setup

Wenn alles funktioniert solltest du mit einem `docker compose up` den webserver Starten und die API ansprechen können
Aktuell läuft auf Docker nur der die API die mit einem uvicorn Webserver gehostet wird
Uvicorn verwendet den `uv` als dependency manager mehr dazu unter [uv instruction](https://docs.astral.sh/uv/#projects)

# Client ReadME by kassim [Readme](./client/README_CLIENT_ANALYSE.md)
