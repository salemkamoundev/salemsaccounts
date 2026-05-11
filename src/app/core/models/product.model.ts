export interface Product {
  id?: string;
  title: string;
  description?: string;
  category: string;
  priceUSDT: number;
  imageUrl?: string;
  isActive?: boolean;
}
