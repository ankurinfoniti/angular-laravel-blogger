export interface Page {
  id: number;
  title: string;
  description: string;
  slug: string;
  is_active?: number;
  created_at?: Date;
}
