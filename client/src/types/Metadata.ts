// Frontend Model für die Metadaten eines Lernmaterials

export type StorageStrategy = "LOCAL" | "DATABASE"; // Passe an deine Auswahl im Frontend an

export interface Metadata {
  id?: number;
  path?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  subject: string;
  storage_strategy: StorageStrategy;
  title: string;
  author: string;
}
