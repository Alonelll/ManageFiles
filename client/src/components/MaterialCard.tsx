import { Badge } from "#src/components/ui/badge";
import { Button } from "#src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#src/components/ui/card";
import { Download, FileText, MessageSquare } from "lucide-react";

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

interface Props {
  material: Material;
  onComment: () => void;
}

const MaterialCard = ({ material, onComment }: Props) => {
  const colors = {
    Informatik: "bg-blue-100 text-blue-800",
    Mathematik: "bg-green-100 text-green-800",
    Pflege: "bg-purple-100 text-purple-800",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{material.title}</CardTitle>
            <p className="text-sm text-gray-600">{material.author}</p>
          </div>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            className={
              colors[material.subject as keyof typeof colors] ||
              "bg-gray-100 text-gray-800"
            }
          >
            {material.subject}
          </Badge>
          <span className="text-xs text-gray-500">{material.type}</span>
        </div>

        <div className="text-xs text-gray-500">
          <div>{new Date(material.date).toLocaleDateString()}</div>
          <div>{material.size}</div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" variant="default">
            <Download className="h-3 w-3 mr-1" />
            Öffnen
          </Button>
          <Button size="sm" variant="outline" onClick={onComment}>
            <MessageSquare className="h-3 w-3 mr-1" />
            {material.comments}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
