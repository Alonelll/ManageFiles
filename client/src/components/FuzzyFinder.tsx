import { Badge } from "#src/components/ui/badge";
import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "#src/components/ui/command";
import { Input } from "#src/components/ui/input";
import { Separator } from "#src/components/ui/separator";
import {
  Calendar,
  Download,
  FileText,
  Folder,
  MessageSquare,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

interface Material {
  id: number;
  title: string;
  author: string;
  themengebiet: string;
  dateCreated: string;
  fileType: string;
  size: string;
  comments: number;
  content?: string;
  isDirectory?: boolean;
}

interface FuzzyFinderProps {
  materials: Material[];
  onCommentClick: (material: Material) => void;
}

export const FuzzyFinder = ({
  materials,
  onCommentClick,
}: FuzzyFinderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  // Fuzzy search implementation
  const filteredMaterials = useMemo(() => {
    if (!searchQuery) return materials;

    return materials.filter((material) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        material.title.toLowerCase().includes(searchLower) ||
        material.author.toLowerCase().includes(searchLower) ||
        material.themengebiet.toLowerCase().includes(searchLower) ||
        material.fileType.toLowerCase().includes(searchLower)
      );
    });
  }, [materials, searchQuery]);

  const getFileIcon = (material: Material) => {
    if (material.isDirectory) {
      return <Folder className="h-5 w-5 text-blue-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const getThemeColor = (themengebiet: string) => {
    const colors = {
      Informatik: "bg-blue-100 text-blue-800",
      Mathematik: "bg-green-100 text-green-800",
      Pflege: "bg-purple-100 text-purple-800",
      Default: "bg-gray-100 text-gray-800",
    };
    return (colors as Record<string, string>)[themengebiet] || colors.Default;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
      {/* Left Panel - File/Directory List */}
      <Card className="flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lernmaterialien</CardTitle>
          <CardDescription>
            Durchsuchen Sie verfügbare Materialien
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4">
          <Command className="border rounded-lg">
            <CommandInput
              placeholder="Suche nach Materialien, Autoren, Themen..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>Keine Materialien gefunden.</CommandEmpty>
              <CommandGroup>
                {filteredMaterials.map((material) => (
                  <CommandItem
                    key={material.id}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                    onSelect={() => setSelectedMaterial(material)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {getFileIcon(material)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {material.title}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{material.author}</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>
                            {new Date(material.dateCreated).toLocaleDateString(
                              "de-DE"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={getThemeColor(material.themengebiet)}
                        variant="secondary"
                      >
                        {material.themengebiet}
                      </Badge>
                      {!material.isDirectory && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCommentClick(material);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CardContent>
      </Card>

      {/* Right Panel - Preview/Content */}
      <Card className="flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {selectedMaterial ? "Material-Vorschau" : "Vorschau"}
          </CardTitle>
          <CardDescription>
            {selectedMaterial
              ? `${selectedMaterial.title} - ${selectedMaterial.fileType}`
              : "Wählen Sie ein Material aus der Liste"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {selectedMaterial ? (
            <div className="space-y-4 h-full">
              {/* Material Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Autor:</span>
                  <p className="text-muted-foreground">
                    {selectedMaterial.author}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Dateigröße:</span>
                  <p className="text-muted-foreground">
                    {selectedMaterial.size}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Erstellt:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedMaterial.dateCreated).toLocaleDateString(
                      "de-DE"
                    )}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Kommentare:</span>
                  <p className="text-muted-foreground">
                    {selectedMaterial.comments}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Content Preview */}
              <div className="flex-1 bg-muted/50 rounded-lg p-4 min-h-[200px]">
                {selectedMaterial.isDirectory ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Folder className="h-12 w-12 mx-auto mb-2" />
                      <p>Verzeichnis</p>
                      <p className="text-sm">Doppelklicken zum Öffnen</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-medium">Inhalt-Vorschau:</h4>
                    <div className="bg-background rounded border p-3 text-sm">
                      {selectedMaterial.content || (
                        <div className="text-muted-foreground italic">
                          Vorschau nicht verfügbar für{" "}
                          {selectedMaterial.fileType}-Dateien.
                          <br />
                          Verwenden Sie die Download-Funktion, um die Datei zu
                          öffnen.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                {!selectedMaterial.isDirectory && (
                  <>
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Herunterladen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onCommentClick(selectedMaterial)}
                      className="flex-1"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Kommentare ({selectedMaterial.comments})
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Kein Material ausgewählt</p>
                <p className="text-sm">
                  Wählen Sie ein Material aus der Liste, um eine Vorschau zu
                  sehen
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
