export interface Blog {
  id: number;
  title: string;
  user_id: number;
  category_id: number;
  description: string;
  image: string;
  is_featured: number;
  is_active: number;
  created_at: Date | null;
  updated_at: Date | null;
}
