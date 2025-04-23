import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { UserDB } from '../models/UserDB';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private currentUserDBSubject: BehaviorSubject<UserDB | null> =
    new BehaviorSubject<UserDB | null>(null);

  public currentUserDB$: Observable<UserDB | null> =
    this.currentUserDBSubject.asObservable();

  collectionName: string = 'pd_users';
  collectionReference!: CollectionReference;

  constructor(
    private db: Firestore,
    private authService: AuthService,
    private router: Router
  ) {
    this.collectionReference = collection(this.db, this.collectionName);

    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.fetchUserDBData(user.uid);
      } else {
        this.currentUserDBSubject.next(null);
      }
    });
  }

  private fetchUserDBData(uid: string) {
    const userDocRef: DocumentReference = doc(this.collectionReference, uid);

    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData: UserDB = docSnapshot.data() as UserDB;
          this.currentUserDBSubject.next(userData);
          console.log('Correctly fetch user data');
        } else {
          console.log('User has no permissions');
          alert(
            "You don't have user permissions to enter the system. Contact admin"
          );
          this.authService.logout();
          this.currentUserDBSubject.next(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        alert('There has been an error fetching user data');
        this.currentUserDBSubject.next(null);
      });
  }

  async registerUser(user: UserDB) {
    const newUserDocReference = doc(this.collectionReference);

    user.id = newUserDocReference.id;

    await setDoc(newUserDocReference, user);
  }

  // async getUserRoles(uidUserToGet: string): Promise<string[]> {
  //   const queryUser = query(
  //     this.collectionReference,
  //     where('uid', '==', uidUserToGet),
  //     limit(1)
  //   );

  //   var usersSnapshot = await getDocs(queryUser);

  //   if (
  //     usersSnapshot.docs.length === 1 &&
  //     usersSnapshot.docs[0] !== undefined
  //   ) {
  //     var user: CustomUser = usersSnapshot.docs[0].data() as CustomUser;

  //     this.permisosService.permisosSource.next(user.roles);

  //     return user.roles;
  //   }

  //   return [];
  // }
}
