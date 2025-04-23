import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-product-base-form',
  imports: [SelectModule, FormsModule],
  templateUrl: './product-base-form.component.html',
  styleUrl: './product-base-form.component.scss',
})
export class ProductBaseFormComponent {
  @Input() productForm!: FormGroup;
  @Input() typeOptions!: any[];
  @Input() type!: string;

  @Output() typeChange: EventEmitter<any> = new EventEmitter();
}
