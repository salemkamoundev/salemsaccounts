export interface Product {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  category: string;
  priceUSDT: number;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
}
