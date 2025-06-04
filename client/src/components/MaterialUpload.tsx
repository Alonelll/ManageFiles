import { Alert, AlertDescription } from "#src/components/ui/alert";
import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import { Input } from "#src/components/ui/input";
import { Label } from "#src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#src/components/ui/select";
import { Textarea } from "#src/components/ui/textarea";
import { useToast } from "#src/hooks/use-toast";
import { AlertCircle, FileText, Upload } from "lucide-react";
import { useState } from "react";

export const MaterialUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    themengebiet: "",
    file: null as File | null,
    tags: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const themengebiete = [
    "Informatik",
    "Mathematik",
    "Pflege",
    "Betriebswirtschaft",
    "Technik",
    "Sprachen",
    "Naturwissenschaften",
    "Allgemeinbildung",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, file: e.dataTransfer.files[0] });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file || !formData.title || !formData.themengebiet) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      });
      return;
    }

    // Hier würde die tatsächliche Upload-Logik implementiert werden
    toast({
      title: "Upload erfolgreich",
      description: `Das Material "${formData.title}" wurde erfolgreich hochgeladen.`,
    });

    // Form zurücksetzen
    setFormData({
      title: "",
      description: "",
      themengebiet: "",
      file: null,
      tags: "",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Neues Lernmaterial hochladen</span>
        </CardTitle>
        <CardDescription>
          Laden Sie Dokumente, Präsentationen, Videos oder andere
          Lernmaterialien hoch
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datei Upload Bereich */}
          <div className="space-y-2">
            <Label htmlFor="file">Datei auswählen *</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-green-500" />
                  <p className="text-sm font-medium">{formData.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(formData.file.size)}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, file: null })}
                  >
                    Andere Datei wählen
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-sm">
                    Datei hier hineinziehen oder{" "}
                    <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                      durchsuchen
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.py,.java,.cpp,.txt,.jpg,.jpeg,.png,.mp4,.avi"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    Unterstützt: PDF, Office-Dokumente, Bilder, Videos,
                    Code-Dateien
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Speicherstrategie Info */}
          {formData.file && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {formData.file.size < 1024 * 1024
                  ? "Diese Datei wird direkt in der Datenbank gespeichert (< 1MB)"
                  : "Diese Datei wird als Dateipfad-Referenz gespeichert (> 1MB)"}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Titel */}
            <div className="space-y-2">
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="z.B. Python Grundlagen - Kapitel 1"
              />
            </div>

            {/* Themengebiet */}
            <div className="space-y-2">
              <Label htmlFor="themengebiet">Themengebiet *</Label>
              <Select
                value={formData.themengebiet}
                onValueChange={(value) =>
                  setFormData({ ...formData, themengebiet: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Themengebiet auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {themengebiete.map((gebiet) => (
                    <SelectItem key={gebiet} value={gebiet}>
                      {gebiet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Beschreibung */}
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Kurze Beschreibung des Lernmaterials..."
              rows={4}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="z.B. grundlagen, programmierung, anfänger (durch Komma getrennt)"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            <Upload className="h-4 w-4 mr-2" />
            Material hochladen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
