# Study Hub - Project Demeter
**Project von Kassim und Lennart**

## 1. Zielsetzung

Die Client-Anwendung „StudyHub“ dient der effizienten Verwaltung, Darstellung und Interaktion mit digitalen Lernmaterialien für Schüler, Studierende und Lehrkräfte. Sie ermöglicht das Durchsuchen, Kommentieren und Organisieren von Lernressourcen in einer modernen, benutzerfreundlichen Weboberfläche.

### 1.1. Funktionen und UX

#### 1.1.1. Materialübersicht und -suche

- **Anzeige aller verfügbaren Lernmaterialien** in einer übersichtlichen Karten- oder Listenansicht.
- **Filter- und Suchfunktion** nach Fächern, Autoren, Dateitypen, etc.
- **Detailansicht** für jedes Material mit Metadaten (Titel, Autor, Fach, Datum, Typ, Größe).

#### 1.1.2. Materialübersicht und -suche

- **Anzeige aller verfügbaren Lernmaterialien** in einer übersichtlichen Karten- oder Listenansicht.
- **Filter- und Suchfunktion** nach Fächern, Autoren, Dateitypen, etc.
- **Detailansicht** für jedes Material mit Metadaten (Titel, Autor, Fach, Datum, Typ, Größe).

#### 1.1.3. Kommentarfunktion

- **Kommentarsektion** für jedes Material, in der Nutzer Feedback, Fragen oder Anmerkungen hinterlassen können.
- **Anzeige aller Kommentare** zu einem Material, inkl. Autor, Datum und Inhalt.
- **Hinzufügen neuer Kommentare** mit Validierung und direkter Rückmeldung an den Nutzer.

#### 1.1.4. Navigation und Routing

- **Client-seitiges Routing** mit React Router (v6+), z.B. für Seiten wie „Durchsuchen“, „Materialdetails“, „Kommentare“.
- **Zurück-Navigation** und gezielte Weiterleitung (z.B. Klick auf Logo/Titel führt zur Materialübersicht).

#### 1.1.5. Responsive Design & UI

- **Responsives Layout** für Desktop und mobile Endgeräte.
- **Moderne UI-Komponenten** (Buttons, Cards, Badges, Textareas) auf Basis von Tailwind CSS.
- **Dark-Mode-Unterstützung** durch dynamische CSS-Variablen und Tailwind-Konfiguration.

## 2. Technische Rahmenbedingungen

### 2.1. Frontend

#### 2.1.1. Verwendete Technologien

- React (v18)
- TypeScript (v4)
- Tailwind CSS (v3/v4)
- Webpack 
- React Router (v6)
- PostCSS (v8)
- tailwindcss-animate (v1)

#### 2.1.2. Architektur

- **Single Page Application (SPA)** auf Basis von React.
- **Komponentenbasierte Struktur**: Wiederverwendbare UI-Komponenten für Karten, Buttons, Badges, etc.
- **State-Management**: Nutzung von React Hooks (`useState`, `useParams`, `useNavigate`).

#### 2.1.3. Styling

- **Tailwind CSS** für Utility-First Styling und schnelle Anpassbarkeit.
- **Custom Theme** via CSS-Variablen für Farben, Border-Radius etc.
- **Animationen** mit `tailwindcss-animate`.

#### 2.1.4. Build & Tooling

- **Webpack** als Build-Tool mit TypeScript- und CSS-Loadern.
- **PostCSS** mit Tailwind- und Autoprefixer-Integration.
- **Hot Module Replacement** im Entwicklungsmodus.

#### 2.1.5. Routing

- **React Router v6+** für deklaratives Routing und Navigation.
- **Dynamische Routen** für Material- und Kommentarseiten (`/material/:id`, `/kommentare/:materialId`).

### 2.2. Backend

#### 2.1.1. Verwendete Technologien

- **Python** für schnelle und stark abstrakte Entwicklung.
- **FastAPI** für eine lightweight Implementierung von Controller basierten API-Schnittstellen.
- **MariaDB** als effiziente SQL Datenbank
- **Docker** zum Containerisieren der Software aus Gründen der Sicherheit und Portabilität.

#### 2.1.2. Hosting

Das Projekt verwendet den *UV* Python Package Manager, welcher beim Erstellen des Docker Containers ein *Virtual Environment* erstellt und entsprechende Abhängigkeiten herunterlädt. Beim Starten des Docker Containers werden die Endpunkte über *uvcorn* gehostet. 

#### 2.1.2. Docker Container

Die Applikation wird in zwei Docker Container verpackt. Ein Docker Container beinhaltet den Webserver und ein weiterer die Datenbank. Das Verwenden von Docker Containern macht die Auslieferung des Projektes leichter, da die Umgebung standartisiert ist, wodurch keine Rücksicht auf Python Package Management oder unterschiedliche Betriebssysteme genommen werden muss (Auch wenn die Verwendung von Windows oder MacOS aufgrund der visualisierten Laufzeit zu Performance Einbüßen führt).

## 3. Technische Umsetzung

### 3.1. Dateibrowser

Über den `/view` Endpunkt ist der Dateibrowser zu erreichen. Der Rest des URL Paths wird vom Client verwendet, um die Position des Clients im Dateibaum festzustellen. Der Client spricht den `/api/folder GET` Endpunkt an, um den Inhalt des Ordners zu Erfahren, wobei bei jedem Element übergeben wird, ob es sich um eine Datei oder einen Ordner handelt. Wenn es sich um einen Ordner handelt, führt das Element den Nutzer zur entsprechenden View weiter. Sollte es sich um eine Datei Ändern, lädt der Client die Datei herunter. 

### 3.3. Datenbank Schema

Das Datenbankschema besteht aus vier Tabellen:
- Der **Users** Tabelle, welche neben einer id einen Nutzernamen und ein Secret speichert.
- Der **Folders** Tabelle, welche nur einen Path erfasst.
- Der **Files** Tabelle, welche einen Dateinamen, die Daten der Datei in base64 Encodierung, sowie einen Foreign Key zur entsprechenden Zeile in der `Folders` Tabelle beinhaltet.
- Der **Comments** Tabelle, welche Kommentare von Nutzern erfasst. Sie beinhaltet den Inhalt des Kommentars, einen Foreign Key zur entsprechenden Datei und einen Foreign Key zum entsprechenden Nutzer

### 3.3. Datei Up- und Download

Der Client spricht zum Up- und Downloaden von Dateien den */api/file* Endpunkt an. Dieser nimmt den Rest des URL Pfades als Dateipfad. 

Beim Download, also einer `GET` Anfrage, durchsucht der Endpunkt zunächst den lokalen Dateibrowser des *gemounteten* directories, welches über eine Umgebungsvariable beim Erstellen des Docker Containers festgelegt wird. Sollte die entsprechende Datei nicht vorliegen, baut er eine Verbindung zur Datenbank auf und durchsucht den *Files* Table nach einer Datei, dessen Ordner Path und Dateiname dem Dateipfad entsprechen. Sollte eine entsprechende Zeile vorliegen, wird der base64 encodierte Wert der *data* Spalte zurück zu Bytes decodiert. Anschließend werden die Binärdaten in einen Octet Stream übergeben, welcher die Datei im Client mit dem entsprechenden Namen herunterlädt. 

Beim Upload verläuft der Prozess umgekehrt. Zunächst wartet der Endpunkt den Dateiupload ab. Anschließend überprüft er, ob die Datei größer als 1MB ist. Wenn dies der Fall ist, erstellt der Endpunkt die benötigten Subdirectories im *gemounteten* Directory und speichert die Datei am entsprechenden Ort. Sollte es nicht der Fall sein, erstellt der Endpunkt, falls er noch nicht vorliegt, einen Eintrag für den Ordner im *Folders* Table. Anschließend verwendet er base64 Encodierung, um die Binärdaten der Datei zu einem String zu verarbeiten. Dieser String wird anschließend im *data* Feld in einer Zeile im *Files* Table gespeichert.

### 3.4. Authentisierung

Das Backend verwendet ein Session basiertes Authentifizierungssystem. Wenn ein Nutzer ohne Bearer Token das SPA Frontend aufruft, ruft dieses automatisch eine Login Seite auf. Diese Seite erlaubt es dem Nutzer, seine Credentials einzugeben. Diese werden im HTTP Basic Format an den `/api/login` Endpunkt übergeben werden. Dieser Endpunkt gibt dem Client ein *Bearer Token* zurück. Dieses ist ein AES-verschlüsselter String, welcher den Nutzernamen, das Passwort und die IP Adresse des Clients beinhaltet. Weitere Anfragen an die API werden vom Client mit einem `Authorization` Header versehen, welcher dem *Bearer* Format folgt und das Token aus Authentisierung an die API zurückgibt. Diese entschlüsselt das Token, vergleicht die IP Adressen und versucht den Nutzer mit dem gegebenen Namen und Passwort zu Authentifizieren.

### 3.5. Authentifizierung

Der Server speichert die Nutzer Credentials im `Users` Table der Datenbank. Dieser speichert den Nutzernamen und einen gesalteten *pbkdf2-hmac-sha256* Hash des Passworts. Bei Anmeldeversuchen werden der Nutzername und der Hash des Passworts abgeglichen, um den Nutzer zu authentifizieren.

## 4. Analyse und Bewertung

### 4.1. Benutzbarkeit
  Die Anwendung bietet eine intuitive Navigation, klare UI-Strukturen und unmittelbares Feedback bei Nutzeraktionen (z.B. Kommentar hinzufügen).
### 4.2. Erweiterbarkeit
  Durch die komponentenbasierte Architektur und Utility-First-Ansatz ist die Anwendung leicht erweiterbar (z.B. neue Materialtypen, weitere Filter).
### 4.3. Wartbarkeit
  Klare Trennung von Komponenten, Styles und Routing erleichtert die Wartung und Anpassung.
### 4.4. Barrierefreiheit
  Grundlegende Accessibility wird durch semantische HTML-Elemente und Tastatur-Navigation unterstützt.
### 4.5. Performance.
  SPA-Ansatz und optimiertes Bundling sorgen für schnelle Ladezeiten und flüssige Interaktion. Der Webserver wird durch Python zurückgehalten, aber die Performance von MariaDB gleicht dies aus.

## 5. Zusammenfassung

Die Client-Anwendung „StudyHub“ ist eine moderne, skalierbare und benutzerorientierte Plattform zur Verwaltung und Interaktion mit digitalen Lernmaterialien. Sie setzt auf aktuelle Webtechnologien und Best Practices, um eine optimale User Experience und eine solide technische Basis für zukünftige Erweiterungen zu gewährleisten.

Das Backend bietet eine stabile Grundlage, welche in Zukunft die Erweiterung um neue Funktionen und Sicherheitsmaßnahmen erlaubt. Das modulare Router Design und das verwenden von Controller-basierten Endpunkten erlaubt eine leichte Erweiterung der API und der Gesamtaufbau ist modular.
