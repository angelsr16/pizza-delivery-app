import { Timestamp } from '@angular/fire/firestore';
import { Product } from './Product';

export interface CartDB {
  userId: string;
  items: CartItemDB[];
  updatedAt: Timestamp;
}

export interface CartItemDB {
  productId: string;
  quantity: string;
  extraInfo: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

export interface CartItem {
  product: Product;
  quantity: string;
  extraInfo: string;
}
