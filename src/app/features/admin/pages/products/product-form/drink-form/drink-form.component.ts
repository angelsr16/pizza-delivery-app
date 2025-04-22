import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-drink-form',
  imports: [ReactiveFormsModule, InputTextModule],
  templateUrl: './drink-form.component.html',
  styleUrl: './drink-form.component.scss',
})
export class DrinkFormComponent {
  @Input() formGroup!: FormGroup;
}
