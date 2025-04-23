import { CustomFile } from '../CustomFile';
import { DocumentBase } from './DocumentBase';

export type Product = Pizza | Drink;
export type RawProduct = RawPizzaData | RawDrinkData;

export interface BaseProduct extends DocumentBase {
  name: string;
  description?: string;
  type: 'pizza' | 'drink';
  imageFile: CustomFile;
  price?: number;
}

export interface Pizza extends BaseProduct {
  sizes: {
    size: string;
    price: number;
  }[];
  toppings: {
    name: string;
  }[];
  customizable: boolean;
}

export interface RawPizzaData {
  name: string;
  type: 'pizza';
  description?: string;
  customizable: boolean;
  sizes: {
    size: string;
    price: number;
  }[];
  toppings: {
    name: string;
  }[];
}

export interface Drink extends BaseProduct {
  volume: string;
}

export interface RawDrinkData {
  name: string;
  type: 'drink';
  description?: string;
  price: number;
  volume: string;
}
