import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../core/services/users.service';
import { Router, RouterLink } from '@angular/router';
import { LoginFormGroup } from '../../core/models/ui/LoginFromGroup';
import { LoginForm } from '../../core/models/ui/LoginForm';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DeliveryMapComponent } from '../../shared/components/delivery-map/delivery-map.component';
import { CustomerRegistrationFormGroup } from '../../core/models/ui/CustomerRegistrationFormGroup';
import { CustomerRegistrationForm } from '../../core/models/ui/CustomerRegistrationForm';
import { CustomersService } from '../../core/services/customers.service';
import { DeliveryLocation } from '../../core/models/db/DeliveryLocation';

@Component({
  selector: 'app-customer-registration',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    RouterLink,
    DeliveryMapComponent,
  ],
  providers: [MessageService],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.scss',
})
export class CustomerRegistrationComponent {
  registrationFormGroup!: FormGroup<CustomerRegistrationFormGroup>;
  deliveryLocation: DeliveryLocation = {
    lat: 40.7128,
    lng: -74.006,
  };

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private customersService: CustomersService,
    private router: Router
  ) {
    this.resetLoginFormGroup();
  }

  resetLoginFormGroup() {
    this.registrationFormGroup = this.fb.group<CustomerRegistrationFormGroup>({
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  passwordMatchValidator() {
    const passwordControl = this.registrationFormGroup.get('password');
    const confirmPasswordControl =
      this.registrationFormGroup.get('confirmPassword');

    if (passwordControl?.value === confirmPasswordControl?.value) {
      return true;
    }

    confirmPasswordControl?.setErrors({ mismatch: true });
    return false;
  }

  async onRegisterSubmit() {
    if (this.passwordMatchValidator()) {
      this.isLoading = true;
      const { firstName, lastName, password, email } =
        this.registrationFormGroup.getRawValue();

      var registrationFormData: CustomerRegistrationForm = {
        firstName,
        lastName,
        password,
        email,
        deliveryLocation: this.deliveryLocation,
      };

      await this.customersService.registerCustomer(registrationFormData);
      this.isLoading = false;
    }
  }
}
