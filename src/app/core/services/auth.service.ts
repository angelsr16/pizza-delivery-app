import { inject, Injectable } from '@angular/core';
import {
  Auth,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
} from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginForm } from '../models/ui/LoginForm';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  private auth: Auth = inject(Auth);

  justCreateNewUser: boolean = false;

  constructor() {
    authState(this.auth).subscribe((user) => {
      if (this.justCreateNewUser) {
        this.justCreateNewUser = false;
      } else {
        this.currentUserSubject.next(user);
      }
    });
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  async login(loginForm: LoginForm) {
    const email = loginForm.email.trim();
    const password = loginForm.password.trim();

    await setPersistence(this.auth, browserLocalPersistence);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  async registerNewCustomerUser(
    email: string,
    password: string
  ): Promise<string> {
    var userAuth = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return userAuth.user.uid;
  }

  async registerNewUserStaff(email: string, password: string): Promise<string> {
    try {
      // Guarda usuario loggeado actualmente
      var currentAuthenticatedUser = this.auth.currentUser;

      // Se crea el nuevo usuario y se loggea automaticamente a la nueva sesión
      this.justCreateNewUser = true;

      var userAuth = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Regresamos al usuario inicial
      await updateCurrentUser(this.auth, currentAuthenticatedUser);
      return userAuth.user.uid;
    } catch (error) {
      this.justCreateNewUser = false;
      return '';
    }
  }
}
