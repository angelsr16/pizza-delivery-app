import { Component, Input } from '@angular/core';
import { CartDB } from '../../../../core/models/db/Cart';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-side-cart-details',
  imports: [],
  templateUrl: './side-cart-details.component.html',
  styleUrl: './side-cart-details.component.scss',
})
export class SideCartDetailsComponent {
  @Input() cart!: CartDB;

  constructor(private cartService: CartService) {
    
  }
}
