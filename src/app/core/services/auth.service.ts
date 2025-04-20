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
import { LoginForm } from '../models/LoginForm';
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

  constructor() {
    authState(this.auth).subscribe((user) => {
      this.currentUserSubject.next(user);
    });
  }

  get currentUser() {
    return this.currentUserSubject.value;
  }

  async createNewUser(email: string, password: string, onComplete: Function) {
    var currentAuthenticatedUser = this.auth.currentUser;
    var userAuth = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await updateCurrentUser(this.auth, currentAuthenticatedUser);
    onComplete(userAuth.user.uid);
  }

  async login(loginForm: LoginForm) {
    const email = loginForm.email.trim();
    const password = loginForm.password.trim();

    await setPersistence(this.auth, browserLocalPersistence);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}
