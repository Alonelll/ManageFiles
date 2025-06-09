import FileUpload from "#src/components/FileUpload";
import MaterialCard from "#src/components/MaterialCard";
import { Badge } from "#src/components/ui/badge";
import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import { Input } from "#src/components/ui/input";
import type { Comment } from "#src/types/Comment";
import { FileText, Search, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const navigate = useNavigate();

  useEffect(() => {
    // Lade Materialien aus der API
    fetch("http://localhost:8000/api/materials")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Materialien");
        return res.json();
      })
      .then((data) => setMaterials(data))
      .catch(() => setMaterials([]));

    fetch("http://localhost:8000/api/comments")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Kommentare");
        return res.json();
      })
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, []);

  const filtered = materials.filter(
    (m) =>
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.author?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            StudyHub
          </h1>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "browse" ? "default" : "outline"}
              onClick={() => setActiveTab("browse")}
            >
              <Search className="h-4 w-4 mr-2" />
              Durchsuchen
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Hochladen
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === "browse" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Materialien suchen</CardTitle>
                <Input
                  placeholder="Suche nach Titel, Autor oder Thema..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {filtered.map((material) => (
                  <div
                    key={material.id}
                    className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/comments/${material.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                        <p className="text-sm text-gray-600">
                          {material.author}
                        </p>
                      </div>
                      <Badge variant="outline">{material.subject}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vorschau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-12">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Material auswählen für Vorschau</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "upload" && <FileUpload />}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Kürzlich hinzugefügt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.slice(0, 3).map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onComment={() => navigate(`/comments/${material.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
