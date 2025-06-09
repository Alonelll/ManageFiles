import { Badge } from "#src/components/ui/badge";
import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import { Textarea } from "#src/components/ui/textarea";
import type { Comment } from "#src/types/Comment";
import type { Metadata as Material } from "#src/types/Metadata";
import { ArrowLeft, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CommentPage = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  // Hier später: Material und Kommentare per API laden
  // const [material, setMaterial] = useState<Material | null>(null);
  // const [materialComments, setMaterialComments] = useState<Comment[]>([]);

  // Temporärer Fallback bis API implementiert ist:
  const material: Material | null = {
    id: 1,
    title: "Beispielmaterial",
    author: "Max Mustermann",
    subject: "Mathematik",
    file_name: "",
    file_type: "",
    file_size: 0,
    storage_strategy: "LOCAL",
  };
  const materialComments: Comment[] = [];

  const handleSubmit = () => {
    if (newComment.trim()) {
      // Hier später: Kommentar per API speichern
      setNewComment("");
      alert("Kommentar hinzugefügt!");
    }
  };

  if (!material) {
    return <div>Material nicht gefunden</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black shadow-sm border-b border-black p-4 text-white">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-neutral-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-xl font-bold">Kommentare</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-black">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-black">{material.title}</CardTitle>
                <p className="text-gray-600 mt-1">{material.author}</p>
              </div>
              <Badge variant="outline" className="border-black text-black">
                {material.subject}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-black">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black">
              <MessageSquare className="h-5 w-5" />
              Kommentare ({materialComments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {materialComments.map((comment: Comment, index: number) => (
              <div key={comment.id}>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-black">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                </div>
                {index < materialComments.length - 1 && <hr className="mt-4" />}
              </div>
            ))}

            <hr />

            <div className="space-y-3">
              <h4 className="font-medium text-black">Kommentar hinzufügen</h4>
              <Textarea
                placeholder="Ihr Kommentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="bg-black text-white hover:bg-neutral-900"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Kommentar hinzufügen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommentPage;
