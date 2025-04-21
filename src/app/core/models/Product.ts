export type Product = Pizza | Drink;

export interface BaseProduct {
  id: string;
  name: string;
  description?: string;
  type: 'pizza' | 'drink';
  imageUrl: string;
  price?: number;
}

export interface Pizza extends BaseProduct {
  sizes: {
    size: 'small' | 'medium' | 'large';
    price: number;
  }[];
  toppings: string[];
  customizable: boolean;
}

export interface Drink extends BaseProduct {
  volume: string;
}
