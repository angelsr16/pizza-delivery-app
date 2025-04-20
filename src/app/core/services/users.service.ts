import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  doc,
  Firestore,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { PermissionsService } from './permissions.service';
import { CustomUser } from '../models/CustomUser';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  collectionName: string = 'pd_users';
  collectionReference!: CollectionReference;

  constructor(
    private db: Firestore,
    private permisosService: PermissionsService
  ) {
    this.collectionReference = collection(this.db, this.collectionName);
  }

  async registerUser(user: CustomUser) {
    const newUserDocReference = doc(this.collectionReference);

    user.id = newUserDocReference.id;

    await setDoc(newUserDocReference, user);
  }

  async getUserRoles(uidUserToGet: string): Promise<string[]> {
    const queryUser = query(
      this.collectionReference,
      where('uid', '==', uidUserToGet),
      limit(1)
    );

    var usersSnapshot = await getDocs(queryUser);

    if (
      usersSnapshot.docs.length === 1 &&
      usersSnapshot.docs[0] !== undefined
    ) {
      var user: CustomUser = usersSnapshot.docs[0].data() as CustomUser;

      this.permisosService.permisosSource.next(user.roles);

      return user.roles;
    }

    return [];
  }
}
