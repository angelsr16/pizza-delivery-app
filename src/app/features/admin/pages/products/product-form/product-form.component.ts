import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Drink, Pizza, Product } from '../../../../../core/models/db/Product';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { PizzaFormComponent } from './pizza-form/pizza-form.component';
import { DrinkFormComponent } from './drink-form/drink-form.component';
import { ImageFileUploaderComponent } from '../../../../../shared/components/image-file-uploader/image-file-uploader.component';
import { ProductsService } from '../../../../../core/services/products.service';

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
    DrinkFormComponent,
    ImageFileUploaderComponent,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  @Output() onDismiss: EventEmitter<any> = new EventEmitter();
  @Input() product!: Product | undefined;

  productForm!: FormGroup;

  currentType: string = 'pizza';

  typeOptions = [
    { label: 'Pizza 🍕', value: 'pizza' },
    { label: 'Drink 🥤', value: 'drink' },
  ];

  productImageFile!: File | undefined;
  replaceCurrentImage: boolean = false;

  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    if (this.product) {
      this.currentType = this.product.type;
      this.productForm = this.buildForm(this.product.type, this.product);
    } else {
      this.currentType = 'pizza';
      this.productForm = this.buildForm('pizza');
    }
  }

  setImageFile(file: File | undefined) {
    this.productImageFile = file;

    if (this.product && !file) {
      this.replaceCurrentImage = false;
    }
  }

  buildForm(type: 'pizza' | 'drink', data?: any): FormGroup {
    if (type === 'pizza') {
      return this.formBuilder.group({
        name: [data?.name || '', Validators.required],
        description: [data?.description || ''],
        sizes: this.formBuilder.array(
          data
            ? this.buildSizeFormGroupFromList(data.sizes)
            : [this.buildSizeFormGroup()]
        ),
        toppings: this.formBuilder.array(
          data ? this.buildToppingsFormGroupFromList(data.toppings) : [],
          Validators.required
        ),
        customizable: [data?.customizable ?? false, Validators.required],
        type: ['pizza', Validators.required],
      });
    }

    return this.formBuilder.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || ''],
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      volume: [data?.volume || '', Validators.required],
      type: ['drink', Validators.required],
    });
  }

  get sizes(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  get toppings(): FormArray {
    return this.productForm.get('toppings') as FormArray;
  }

  resetFormGroup(type: 'pizza' | 'drink') {
    this.currentType = type;
    this.productForm = this.buildForm(type);
  }

  buildSizeFormGroup(): FormGroup {
    return this.formBuilder.group({
      size: ['small', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  buildSizeFormGroupFromList(sizes: any[]): FormGroup[] {
    const formList: any[] = [];
    sizes.forEach((size) => {
      formList.push(
        this.formBuilder.group({
          size: [size.size, Validators.required],
          price: [size.price, [Validators.required, Validators.min(0)]],
        })
      );
    });

    return formList;
  }

  buildToppingsFormGroupFromList(toppings: any[]): FormGroup[] {
    const formList: any[] = [];
    toppings.forEach((topping) => {
      formList.push(
        this.formBuilder.group({
          name: [topping.name, Validators.required],
        })
      );
    });

    return formList;
  }

  // isPizza(product: Product): product is Pizza {
  //   return product.type === 'pizza';
  // }

  // isDrink(product: Product): product is Drink {
  //   return product.type === 'drink';
  // }

  async handleRegisterProduct() {
    if (this.productImageFile) {
      this.isLoading = true;
      const rawProduct = this.productForm.getRawValue();
      await this.productsService.registerProduct(
        rawProduct,
        this.productImageFile
      );
      this.isLoading = false;
      this.onDismiss.emit();
    }
  }

  async handleUpdateProduct() {
    if (this.product) {
      this.isLoading = true;
      const rawProduct = this.productForm.getRawValue();
      await this.productsService.updateProduct(
        this.product,
        rawProduct,
        this.productImageFile
      );
      this.isLoading = false;
      this.onDismiss.emit();
    }
  }
}
