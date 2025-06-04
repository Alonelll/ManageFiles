import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import {
  ChevronDown,
  Database,
  Filter,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import MaterialCard from "./MaterialCard";

interface StandardQuery {
  id: string;
  name: string;
  description: string;
  sql: string;
  type: string;
}

interface Material {
  id: number;
  title: string;
  author: string;
  subject: string;
  date: string;
  type: string;
  size: string;
  comments: number;
}

export const MaterialSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedThema, setSelectedThema] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [selectedFileType, setSelectedFileType] = useState<string>("");

  // Standardsuchbefehle gemäß Anforderung
  const standardQueries: StandardQuery[] = [
    {
      id: "agg1",
      name: "Materialien pro Themengebiet (Aggregation)",
      description: "Anzahl der Materialien gruppiert nach Themengebiet",
      sql: "SELECT themengebiet, COUNT(*) as anzahl FROM lernmaterialien GROUP BY themengebiet",
      type: "Aggregation",
    },
    {
      id: "agg2",
      name: "Durchschnittliche Dateigröße pro Autor (Aggregation)",
      description: "Berechnet die durchschnittliche Dateigröße pro Autor",
      sql: "SELECT autor, AVG(dateigroesse) as avg_groesse FROM lernmaterialien GROUP BY autor",
      type: "Aggregation",
    },
    {
      id: "join1",
      name: "Materialien mit Kommentaren (Inner Join)",
      description: "Alle Materialien die mindestens einen Kommentar haben",
      sql: "SELECT m.titel, m.autor, k.kommentartext FROM lernmaterialien m INNER JOIN kommentare k ON m.id = k.material_id",
      type: "Inner Join",
    },
    {
      id: "join2",
      name: "Autoren und Themengebiete (Inner Join)",
      description: "Verknüpfung von Autoren mit ihren Themengebieten",
      sql: "SELECT a.name, t.bezeichnung FROM autoren a INNER JOIN themengebiete t ON a.themengebiet_id = t.id",
      type: "Inner Join",
    },
    {
      id: "join_agg",
      name: "Kommentare pro Material (Join + Aggregation)",
      description: "Anzahl Kommentare pro Lernmaterial",
      sql: "SELECT m.titel, COUNT(k.id) as kommentar_anzahl FROM lernmaterialien m INNER JOIN kommentare k ON m.id = k.material_id GROUP BY m.id, m.titel",
      type: "Join + Aggregation",
    },
    {
      id: "multi_join1",
      name: "Vollständige Materialübersicht (Multiple Joins)",
      description: "Materialien mit Autor, Themengebiet und Kommentaranzahl",
      sql: "SELECT m.titel, a.name as autor, t.bezeichnung as thema, COUNT(k.id) as kommentare FROM lernmaterialien m INNER JOIN autoren a ON m.autor_id = a.id INNER JOIN themengebiete t ON m.themengebiet_id = t.id LEFT JOIN kommentare k ON m.id = k.material_id GROUP BY m.id",
      type: "Multiple Joins",
    },
    {
      id: "multi_join2",
      name: "Aktive Benutzer mit Materialien (Multiple Joins)",
      description:
        "Benutzer die sowohl Materialien hochgeladen als auch kommentiert haben",
      sql: "SELECT DISTINCT u.name FROM benutzer u INNER JOIN lernmaterialien m ON u.id = m.autor_id INNER JOIN kommentare k ON u.id = k.autor_id",
      type: "Multiple Joins",
    },
  ];

  // Updated search results to match Material interface
  const searchResults: Material[] = [
    {
      id: 1,
      title: "Python Algorithmen",
      author: "Prof. Dr. Schmidt",
      subject: "Informatik",
      date: "2024-05-15",
      type: "PDF",
      size: "2.1 MB",
      comments: 7,
    },
    {
      id: 2,
      title: "Datenstrukturen Übung",
      author: "Dr. Weber",
      subject: "Informatik",
      date: "2024-05-10",
      type: "DOCX",
      size: "856 KB",
      comments: 3,
    },
  ];

  const themengebiete: string[] = [
    "Informatik",
    "Mathematik",
    "Pflege",
    "Betriebswirtschaft",
    "Technik",
  ];
  const fileTypes: string[] = [
    "PDF",
    "DOCX",
    "PPTX",
    "XLSX",
    "PY",
    "JAVA",
    "JPG",
    "MP4",
  ];

  const executeStandardQuery = (query: StandardQuery): void => {
    console.log(`Executing query: ${query.name}`);
    console.log(`SQL: ${query.sql}`);
  };

  const handleMaterialComment = (material: Material): void => {
    console.log("Opening comments for:", material);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Material Management System
        </h1>
        <p className="text-gray-600">
          Erweiterte Suchfunktionen und Standardsuchbefehle
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Search className="inline-block w-5 h-5 mr-2" />
            Materialsuche
          </CardTitle>
          <CardDescription>
            Suchen Sie nach Materialien mit erweiterten Filteroptionen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Basic Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nach Materialien suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Themengebiet Filter */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                  Themengebiet
                </label>
                <Select.Root
                  value={selectedThema}
                  onValueChange={setSelectedThema}
                >
                  <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                    <Select.Value placeholder="Alle Themengebiete" />
                    <Select.Icon asChild>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value=""
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                        >
                          <Select.ItemText>Alle</Select.ItemText>
                        </Select.Item>
                        {themengebiete.map((thema) => (
                          <Select.Item
                            key={thema}
                            value={thema}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                          >
                            <Select.ItemText>{thema}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                  Zeitraum
                </label>
                <Select.Root
                  value={selectedDateRange}
                  onValueChange={setSelectedDateRange}
                >
                  <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                    <Select.Value placeholder="Alle Zeiträume" />
                    <Select.Icon asChild>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value=""
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                        >
                          <Select.ItemText>Alle</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="last-week"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                        >
                          <Select.ItemText>Letzte Woche</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="last-month"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                        >
                          <Select.ItemText>Letzter Monat</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="last-year"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                        >
                          <Select.ItemText>Letztes Jahr</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              {/* File Type Filter */}
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                  Dateityp
                </label>
                <Select.Root
                  value={selectedFileType}
                  onValueChange={setSelectedFileType}
                >
                  <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                    <Select.Value placeholder="Alle Dateitypen" />
                    <Select.Icon asChild>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value=""
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                        >
                          <Select.ItemText>Alle</Select.ItemText>
                        </Select.Item>
                        {fileTypes.map((type) => (
                          <Select.Item
                            key={type}
                            value={type}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                          >
                            <Select.ItemText>{type}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </div>

            {/* Search Button */}
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
              <Search className="w-4 h-4" />
              Suchen
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Standard Queries Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Database className="inline-block w-5 h-5 mr-2" />
            Standard-Datenbankabfragen
          </CardTitle>
          <CardDescription>
            Vordefinierte SQL-Abfragen für häufige Analysen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {standardQueries.map((query) => (
              <Card key={query.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{query.name}</CardTitle>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {query.type}
                    </span>
                  </div>
                  <CardDescription>{query.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-gray-50 p-3 rounded-md mb-3">
                    <code className="text-sm text-gray-700">{query.sql}</code>
                  </div>
                  <button
                    onClick={() => executeStandardQuery(query)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Abfrage ausführen
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results Section */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suchergebnisse ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onComment={() => handleMaterialComment(material)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
