import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/db/Product';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../../core/services/cart.service';
import { UsersService } from '../../../core/services/users.service';
import { CartDB } from '../../../core/models/db/Cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ButtonModule, RouterLink],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  productsList: Product[] = [];
  productsListToShow: Product[] = [];

  currentCart: CartDB | undefined;

  filterData = {
    type: 'pizza',
  };

  displayOrderDetails: boolean = false;
  isCustomerLoggedIn: boolean = false;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.productsService.products$.subscribe((products) => {
      this.productsList = products as Product[];
      this.productsListToShow = products as Product[];
      this.handleFilterData('pizza');
    });

    this.userService.currentUserDB$.subscribe((user) => {
      this.isCustomerLoggedIn = false;
      if (user && user.roles.includes('customer')) {
        this.isCustomerLoggedIn = true;

        this.cartService.getCartByUserId(user.id).subscribe((cart) => {
          this.currentCart = cart;
        });
      }
    });
  }

  handleFilterData(type: string) {
    this.filterData.type = type;
    this.productsListToShow = this.productsList.filter((product) => {
      return product.type === this.filterData.type;
    });
  }
}
