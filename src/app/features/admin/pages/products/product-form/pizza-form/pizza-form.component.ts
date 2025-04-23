import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-pizza-form',
  imports: [
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './pizza-form.component.html',
  styleUrl: './pizza-form.component.scss',
})
export class PizzaFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  @Input() sizes!: FormArray;
  @Input() toppings!: FormArray;

  toppingToAdd: string = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.sizes);
  }

  addSize() {
    this.sizes.push(
      this.formBuilder.group({
        size: ['', Validators.required],
        price: [0, Validators.required],
      })
    );
  }

  removeSize(index: number) {
    this.sizes.removeAt(index);
  }

  addTopping() {
    this.toppings.push(
      this.formBuilder.group({
        name: [this.toppingToAdd, Validators.required],
      })
    );

    this.toppingToAdd = '';
  }

  removeTopping(index: number) {
    this.toppings.removeAt(index);
  }
}
