# ManageFiles

Problem: Dateien werden unstrukturiert in verschiedenen Verzeichnissen abgelegt

Auftrag: Erstellen Anwendung die es ermöglicht Lernmaterialien systematisch zu speichern, gezielt zu durchsuchen, zu kommentieren und revisionssicher abzulegen

# File types

PDF, DOCX, JPEG, Python files

Files bis 1 MB direkt in der DB Speichern

Files >1MB zu einem definierten Speicherort gespeichert werden

# Techstack

Python3 version @3.13
ReactJS version @19.1
TailwindCSS version @3.4.17
Typescript
FastAPI
Docker

# Lehrkräfte können folgende Requests an die Database machen

hinzufügen (hochladen)
• suchen und öffnen (herunterladen).
Die Materialien können z. B. PDFs, Office-Dokumente oder Quellcodedateien sein.
Suche: Für die Suche sollen dem Benutzer mindestens sieben Standardsuchbefehle zur Verfü-
gung stehen. Vorgabe für die Suchbefehle sind:
• Zwei Aggregationen
• Zwei Joins (Inner)
• Ein Join, plus eine Aggregation
• Zwei Joins (Inner) über mehrere Tabellen

# Docker setup
Wenn alles funktioniert solltest du mit einem `docker compose up` den webserver Starten und die API ansprechen können
Aktuell läuft auf Docker nur der die API die mit einem uvicorn Webserver gehostet wird
Uvicorn verwendet den `uv` als  dependency manager mehr dazu unter [uv instruction](https://docs.astral.sh/uv/#projects)