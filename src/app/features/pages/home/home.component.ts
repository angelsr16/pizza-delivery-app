import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/db/Product';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ButtonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  productsList: Product[] = [];
  productsListToShow: Product[] = [];

  filterData = {
    type: 'pizza',
  };

  displayOrderDetails: boolean = false;

  constructor(private productsService: ProductsService) {
    this.productsService.products$.subscribe((products) => {
      this.productsList = products as Product[];
      this.productsListToShow = products as Product[];
      this.handleFilterData('pizza');
    });
  }

  handleFilterData(type: string) {
    this.filterData.type = type;
    this.productsListToShow = this.productsList.filter((product) => {
      return product.type === this.filterData.type;
    });
  }
}
