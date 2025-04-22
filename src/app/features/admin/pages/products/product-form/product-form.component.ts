import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Pizza, Product } from '../../../../../core/models/Product';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { PizzaFormComponent } from './pizza-form/pizza-form.component';
import { DrinkFormComponent } from "./drink-form/drink-form.component";

interface ProductFormGroup {
  name: string;
  description: string;
}

@Component({
  selector: 'app-product-form',
  imports: [
    FileUploadModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    FormsModule,
    InputNumberModule,
    AccordionModule,
    DialogModule,
    PizzaFormComponent,
    DrinkFormComponent
],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  @Output() onDismiss: EventEmitter<any> = new EventEmitter();
  @Input() product!: Product;

  pizzaProductFormGroup!: FormGroup;
  drinkProductFormGroup!: FormGroup;

  pizzaSizes!: FormArray;
  pizzaToppings!: FormArray;

  currentFormGroup!: FormGroup;

  currentType: string = 'pizza';

  typeOptions = [
    { label: 'Pizza 🍕', value: 'pizza' },
    { label: 'Drink 🥤', value: 'drink' },
  ];

  productImageFile!: File | undefined;

  constructor(private formBuilder: FormBuilder) {
    this.pizzaProductFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      sizes: this.formBuilder.array([this.createSizeFormGroup()]),
      toppings: this.formBuilder.array([], Validators.required),
      customizable: [false, Validators.required],
      type: ['pizza', Validators.required],
    });

    this.pizzaSizes = this.pizzaProductFormGroup.get('sizes') as FormArray;
    this.pizzaToppings = this.pizzaProductFormGroup.get(
      'toppings'
    ) as FormArray;

    this.drinkProductFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      volume: ['', Validators.required],
      type: ['drink', Validators.required],
    });

    this.currentFormGroup = this.pizzaProductFormGroup;
  }

  resetFormGroup(type: string) {
    switch (type) {
      case 'pizza':
        this.currentFormGroup = this.pizzaProductFormGroup;
        break;
      case 'drink':
        this.currentFormGroup = this.drinkProductFormGroup;
        break;
    }
  }

  ngOnInit(): void {}

  handleRegisterProduct() {
    console.log(this.currentFormGroup.getRawValue());
  }

  createSizeFormGroup(): FormGroup {
    return this.formBuilder.group({
      size: ['small', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  choose(event: any, callback: any) {
    callback();
  }

  onFilesSelected(event: any) {
    console.log("FILE")
    this.productImageFile = event.currentFiles[0];
  }

  onFileRemoved(event: any) {
    this.productImageFile = undefined;
  }
}
