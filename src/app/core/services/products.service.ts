import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  collectionName: string = 'pd_products';

  constructor() {}
}
