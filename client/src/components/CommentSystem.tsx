import { Avatar, AvatarFallback, AvatarImage } from "#src/components/ui/avatar";
import { Badge } from "#src/components/ui/badge";
import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import { Textarea } from "#src/components/ui/textarea";
import { useToast } from "#src/hooks/use-toast";
import { Edit, MessageSquare, Send, Trash2, User } from "lucide-react";
import { useState } from "react";

interface Comment {
  id: number;
  author: string;
  authorRole: "Lehrkraft" | "Auszubildende";
  content: string;
  createdAt: string;
  lastModified: string;
  materialId: number;
}

interface CommentSystemProps {
  selectedMaterial: any;
}

export const CommentSystem = ({ selectedMaterial }: CommentSystemProps) => {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();

  // Beispiel-Kommentare
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Dr. Müller",
      authorRole: "Lehrkraft",
      content:
        "Sehr gutes Material! Die Beispiele sind sehr praxisnah und helfen beim Verständnis der Konzepte.",
      createdAt: "2024-06-01T10:30:00",
      lastModified: "2024-06-01T10:30:00",
      materialId: 1,
    },
    {
      id: 2,
      author: "Anna Schmidt",
      authorRole: "Auszubildende",
      content:
        "Hat mir sehr geholfen! Könnten Sie vielleicht noch ein Beispiel für rekursive Funktionen hinzufügen?",
      createdAt: "2024-06-01T14:15:00",
      lastModified: "2024-06-01T14:15:00",
      materialId: 1,
    },
    {
      id: 3,
      author: "Prof. Wagner",
      authorRole: "Lehrkraft",
      content:
        "Ich empfehle dieses Material auch für den fortgeschrittenen Kurs. Sehr strukturiert aufgebaut.",
      createdAt: "2024-06-02T09:20:00",
      lastModified: "2024-06-02T09:20:00",
      materialId: 1,
    },
  ]);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Leerer Kommentar",
        description: "Bitte geben Sie einen Kommentar ein.",
        variant: "destructive",
      });
      return;
    }

    const comment: Comment = {
      id: Date.now(),
      author: "Aktueller Benutzer", // In einer echten App würde das aus dem Auth-System kommen
      authorRole: "Lehrkraft",
      content: newComment,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      materialId: selectedMaterial?.id || 1,
    };

    setComments([comment, ...comments]);
    setNewComment("");

    toast({
      title: "Kommentar hinzugefügt",
      description: "Ihr Kommentar wurde erfolgreich gespeichert.",
    });
  };

  const handleEditComment = (commentId: number) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditContent(comment.content);
    }
  };

  const handleSaveEdit = (commentId: number) => {
    if (!editContent.trim()) return;

    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              content: editContent,
              lastModified: new Date().toISOString(),
            }
          : comment
      )
    );

    setEditingComment(null);
    setEditContent("");

    toast({
      title: "Kommentar aktualisiert",
      description: "Ihr Kommentar wurde erfolgreich bearbeitet.",
    });
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter((comment) => comment.id !== commentId));

    toast({
      title: "Kommentar gelöscht",
      description: "Der Kommentar wurde erfolgreich entfernt.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role: string) => {
    return role === "Lehrkraft"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Kommentarsystem</span>
          </CardTitle>
          <CardDescription>
            {selectedMaterial
              ? `Kommentare für: ${selectedMaterial.title}`
              : "Wählen Sie ein Lernmaterial aus, um Kommentare zu sehen"}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Neuen Kommentar hinzufügen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Neuen Kommentar hinzufügen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Schreiben Sie hier Ihren Kommentar, Ihre Frage oder Ihren Hinweis..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Ihr Kommentar wird mit Ihrem Namen und der aktuellen Zeit
              gespeichert.
            </p>
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Kommentar senden
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kommentarliste */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Kommentare ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine Kommentare vorhanden.</p>
              <p className="text-sm">
                Seien Sie der Erste, der einen Kommentar hinterlässt!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">
                            {comment.author}
                          </span>
                          <Badge className={getRoleColor(comment.authorRole)}>
                            {comment.authorRole}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.createdAt !== comment.lastModified && (
                            <span className="text-xs text-gray-400">
                              (bearbeitet: {formatDate(comment.lastModified)})
                            </span>
                          )}
                        </div>

                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                              className="resize-none"
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(comment.id)}
                              >
                                Speichern
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingComment(null)}
                              >
                                Abbrechen
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditComment(comment.id)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Bearbeiten
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Löschen
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
