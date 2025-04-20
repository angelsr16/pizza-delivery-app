import { Injectable } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  permisosSource = new BehaviorSubject(['']);
  permisosObservable = this.permisosSource
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private db: Firestore) {}

  subscribeToCurrentPermisos(userId: string): Observable<any> {
    const currentPermisosRef = doc(this.db, 'pd_users', userId);

    return docData(currentPermisosRef);
  }
}
