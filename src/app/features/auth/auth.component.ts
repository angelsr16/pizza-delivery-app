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
import { ROLES } from '../../core/constants/roles';
import { Router, RouterLink } from '@angular/router';

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
    RouterLink,
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  loginFormGroup!: FormGroup<LoginFormGroup>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private usersService: UsersService,
    private router: Router
  ) {
    this.usersService.currentUserDB$.subscribe((userDB) => {
      if (userDB !== null) {
        if (userDB.roles.includes(ROLES.INTERNAL_USER)) {
          this.messageService.add({
            severity: 'success',
            summary: 'Greetings.',
            detail: `Welcome ${userDB.email}`,
          });
          this.router.navigate(['/admin']);
          return;
        }

        if (userDB.roles.includes(ROLES.CUSTOMER)) {
          this.router.navigate(['/']);
        }
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
    this.authService
      .login(loginFormData)
      .then((user) => {
        this.resetLoginFormGroup();
      })
      .catch((error) => {
        this.resetLoginFormGroup();

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Incorrect email or password',
        });
      });
  }
}
