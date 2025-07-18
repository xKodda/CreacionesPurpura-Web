export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock?: boolean;
  stock?: number;
  tags?: string[];
  isNew?: boolean;
  isOnSale?: boolean;
} 