import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/db/Product';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProductFormComponent } from "./product-form/product-form.component";

@Component({
  selector: 'app-products',
  imports: [
    ButtonModule,
    IconFieldModule,
    FormsModule,
    InputIconModule,
    InputTextModule,
    FloatLabelModule,
    CommonModule,
    TableModule,
    DialogModule,
    ProductFormComponent,
],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productsList: Product[] = [];
  productsListToShow: Product[] = [];

  expandedRows: { [key: string]: boolean } = {};

  categoryOptions = [
    { index: 0, label: 'All', icon: '' },
    { index: 1, label: 'Pizzas', icon: '🍕' },
    { index: 2, label: 'Drinks', icon: '🥤' },
  ];

  filterData = {
    search: '',
    categoryIndex: 0,
  };

  displayProductForm: boolean = false;

  constructor(private productsService: ProductsService) {
    this.productsService.products$.subscribe((data) => {
      this.productsList = data as Product[];
      this.productsListToShow = data as Product[];
    });
  }

  handleFilterData() {
    this.productsListToShow = this.productsList
      .filter((product) => {
        if (this.filterData.categoryIndex === 0) return true;

        return (
          (product.type === 'pizza' && this.filterData.categoryIndex === 1) ||
          (product.type === 'drink' && this.filterData.categoryIndex === 2)
        );
      })
      .filter((product) => {
        return product.name
          .toUpperCase()
          .trim()
          .includes(this.filterData.search.toUpperCase().toString().trim());
      });
  }

  toggleRow(product: Product) {
    this.expandedRows[product.id] = !this.expandedRows[product.id];
  }
}
