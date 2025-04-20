import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import { LoginForm } from '../../core/models/LoginForm';
import { UserCredential } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../core/services/users.service';

interface LoginFormGroup {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-auth',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  currentUser: any;
  loginFormGroup!: FormGroup<LoginFormGroup>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private usersService: UsersService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        console.log('User is logged in:', user);
      }
    });

    this.resetLoginFormGroup();
  }

  resetLoginFormGroup() {
    this.loginFormGroup = this.fb.group<LoginFormGroup>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  redirectLoggedUser(userCredential: UserCredential) {}

  onLoginSubmit() {
    const loginFormData: LoginForm = this.loginFormGroup.getRawValue();
    this.authService.login(loginFormData).catch((error) => {
      console.log(error.message);

      this.resetLoginFormGroup();

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Incorrect email or password',
      });
    });
  }
}
