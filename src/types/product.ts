export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'firewood' | 'stoves' | 'accessories';
  subcategory: string;
  images: string[];
  rating: number;
  reviews: number;
  seller: {
    name: string;
    location: string;
    verified: boolean;
  };
  specifications: Record<string, string>;
  stock: number;
  unit: string;
  minOrder: number;
  deliveryEstimate: string;
  certifications?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  email: string;
  name?: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  total: number;
  createdAt: Date;
}
