import { Component, Input, OnInit } from '@angular/core';
import { Cart, CartDB, CartItem } from '../../../../core/models/db/Cart';
import { CartService } from '../../../../core/services/cart.service';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/db/Product';

@Component({
  selector: 'app-side-cart-details',
  imports: [],
  templateUrl: './side-cart-details.component.html',
  styleUrl: './side-cart-details.component.scss',
})
export class SideCartDetailsComponent implements OnInit {
  @Input() userId!: string;
  cartData!: Cart;

  constructor(
    private cartService: CartService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart) => {
      if (cart) {
        this.cartData = cart;
      }
    });
  }

  onRemoveQuantityClick(item: CartItem, itemIndex: number) {
    this.cartService.removeItemQuantity(item, itemIndex);
  }

  onAddQuantityClick(item: CartItem, itemIndex: number) {
    this.cartService.addItemQuantity(item, itemIndex);
  }
}
