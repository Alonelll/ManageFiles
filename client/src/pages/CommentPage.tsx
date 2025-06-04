import { Badge } from "#src/components/ui/badge";
import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import { Textarea } from "#src/components/ui/textarea";
import { ArrowLeft, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Material = {
  title: string;
  author: string;
  subject: string;
  date: string;
  type: string;
  size: string;
};

type Comment = {
  id: number;
  author: string;
  content: string;
  date: string;
};

const materials: Record<string, Material> = {
  "1": {
    title: "Python Grundlagen",
    author: "Prof. Schmidt",
    subject: "Informatik",
    date: "2024-06-01",
    type: "PDF",
    size: "850 KB",
  },
};

const comments: Record<string, Comment[]> = {
  "1": [
    {
      id: 1,
      author: "Anna Müller",
      content: "Sehr hilfreich! Die Beispiele sind gut erklärt.",
      date: "2024-06-02",
    },
    {
      id: 2,
      author: "Max Weber",
      content: "Könnte man mehr Beispiele für Schleifen hinzufügen?",
      date: "2024-06-03",
    },
  ],
};

const CommentPage = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  const material = materials[String(materialId)];
  const materialComments = comments[String(materialId)] || [];

  const handleSubmit = () => {
    if (newComment.trim()) {
      console.log("Neuer Kommentar:", newComment);
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
