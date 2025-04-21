import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  filterData = {
    search: '',
    categoryIndex: 0,
  };

  constructor() {
    console.log('TEST');
  }
}
