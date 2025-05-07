import { Timestamp } from '@angular/fire/firestore';
import { Product } from './Product';
import { DocumentBase } from './DocumentBase';

export interface CartDB extends DocumentBase {
  userId: string;
  items: CartItemDB[];
}

export interface CartItemDB {
  productId: string;
  size?: string;
  price: number;
  quantity: number;
  extraInfo: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface CartItem {
  product: Product;
  size?: string;
  price: number;
  quantity: number;
  extraInfo: string;
}
