import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/db/Product';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../../core/services/cart.service';
import { UsersService } from '../../../core/services/users.service';
import { Cart, CartDB } from '../../../core/models/db/Cart';
import { RouterLink } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService } from '../../../core/services/auth.service';
import { UserDB } from '../../../core/models/UserDB';
import { Timestamp } from '@angular/fire/firestore';
import { SideCartDetailsComponent } from './side-cart-details/side-cart-details.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    RouterLink,
    OverlayPanelModule,
    SideCartDetailsComponent,
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  productsList: Product[] = [];
  productsListToShow: Product[] = [];

  isCartLoading: boolean = false;

  currentCart!: Cart | undefined;
  currentUser: UserDB | undefined;

  filterData = {
    type: 'pizza',
  };

  displayOrderDetails: boolean = false;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private userService: UsersService,
    private authService: AuthService
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
      this.currentUser = undefined;
      if (user && user.roles.includes('customer')) {
        this.currentUser = user;
      }
    });

    this.cartService.cart$.subscribe((cart) => {
      if (cart) {
        this.currentCart = cart;
      }
    });
  }

  addProductToCart(product: Product) {
    this.displayOrderDetails = true;
    this.cartService.addProductToCart(product);
  }

  onSignOutClick() {
    this.authService.logout();
  }

  handleFilterData(type: string) {
    this.filterData.type = type;
    this.productsListToShow = this.productsList.filter((product) => {
      return product.type === this.filterData.type;
    });
  }
}
