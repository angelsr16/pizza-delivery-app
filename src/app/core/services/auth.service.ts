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
import { authState } from 'rxfire/auth'; // Usar rxfire para integrarlo bien con Angular
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs'; // Convierte el observable a promesa

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  currentUser$: Observable<any> = this._currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    authState(this.auth).subscribe((user) => {
      this._currentUserSubject.next(user);
    });
  }

  get currentUser() {
    return this._currentUserSubject.value;
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

  async login(email: string, password: string) {
    email = email.trim();
    password = password.trim();

    return setPersistence(this.auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(this.auth, email, password);
    });
  }

  logout() {
    return signOut(this.auth);
  }
}
