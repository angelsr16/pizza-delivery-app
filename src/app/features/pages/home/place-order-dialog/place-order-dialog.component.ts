import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Cart } from '../../../../core/models/db/Cart';
import { CartService } from '../../../../core/services/cart.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Drink, Pizza, Product } from '../../../../core/models/db/Product';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-place-order-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    SelectButtonModule,
    FormsModule,
    SelectModule,
  ],
  templateUrl: './place-order-dialog.component.html',
  styleUrl: './place-order-dialog.component.scss',
})
export class PlaceOrderDialogComponent {
  @Input() cart!: Cart;
  @Output() onDismiss: EventEmitter<any> = new EventEmitter();

  currentDeliveryType: number = 0;

  deliveryTypes = [
    {
      label: 'Home',
      value: 0,
      icon: 'pi pi-map-marker',
    },
    {
      label: 'Restaurant',
      value: 1,
      icon: 'pi pi-warehouse',
    },
  ];

  isPizza(product: Product): product is Pizza {
    return product.type === 'pizza';
  }

  isDrink(product: Product): product is Drink {
    return product.type === 'drink';
  }

  constructor(private cartsService: CartService) {}

  handlePlaceOrder() {}
}
