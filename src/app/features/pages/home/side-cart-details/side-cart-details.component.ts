import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cart, CartDB, CartItem } from '../../../../core/models/db/Cart';
import { CartService } from '../../../../core/services/cart.service';
import { ProductsService } from '../../../../core/services/products.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-side-cart-details',
  imports: [ButtonModule],
  templateUrl: './side-cart-details.component.html',
  styleUrl: './side-cart-details.component.scss',
})
export class SideCartDetailsComponent implements OnInit {
  @Input() userId!: string;
  @Output() onLoadingChange: EventEmitter<boolean> = new EventEmitter(false);

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

  async onRemoveQuantityClick(item: CartItem, itemIndex: number) {
    this.onLoadingChange.emit(true);
    await this.cartService.removeItemQuantity(item, itemIndex);
    this.onLoadingChange.emit(false);
  }

  async onAddQuantityClick(item: CartItem, itemIndex: number) {
    this.onLoadingChange.emit(true);
    await this.cartService.addItemQuantity(item, itemIndex);
    this.onLoadingChange.emit(false);
  }

  async onRemoveItemClick(itemIndex: number) {
    this.onLoadingChange.emit(true);
    await this.cartService.removeItem(itemIndex);
    this.onLoadingChange.emit(false);
  }
}
