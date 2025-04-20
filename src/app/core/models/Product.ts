export interface Product {
  id: string;
  name: string;
  description?: string;
  type: 'pizza' | 'drink';
  imageUrl: string;
  available: string;
}

export interface Pizza extends Product {
  sizes: {
    size: 'small' | 'medium' | 'large';
    price: number;
  };
  toppings: string[];
  customizable: boolean;
}

export interface Drink extends Product {
  price: number;
}
