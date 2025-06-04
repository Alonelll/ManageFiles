import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
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
import { FileText, Upload } from "lucide-react";
import { useState } from "react";

const subjects = ["Informatik", "Mathematik", "Pflege", "Technik", "Sprachen"];

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !subject) {
      alert("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    console.log("Upload:", { file, title, subject, description });
    alert("Material erfolgreich hochgeladen!");

    // Reset
    setFile(null);
    setTitle("");
    setSubject("");
    setDescription("");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Material hochladen
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Datei *</Label>
            <div
              className={`border-2 border-dashed rounded p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div>
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round(file.size / 1024)} KB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setFile(null)}
                  >
                    Andere Datei
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>
                    Datei hierhin ziehen oder{" "}
                    <label className="text-blue-600 cursor-pointer underline">
                      durchsuchen
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files && setFile(e.target.files[0])
                        }
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.py,.java,.txt,.jpg,.png"
                      />
                    </label>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Material Titel"
              />
            </div>
            <div>
              <Label htmlFor="subject">Themengebiet *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Material hochladen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
