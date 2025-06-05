export interface Comment {
  id: number;
  author: string;
  content: string;
  date: string; // ISO-String oder Datum, je nach Backend
  materialId: number; // Referenz auf das zugehörige Material
}
