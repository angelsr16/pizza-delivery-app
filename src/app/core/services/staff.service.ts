import { Injectable } from '@angular/core';
import { RawStaffData, Staff } from '../models/db/Staff';
import {
  collection,
  CollectionReference,
  doc,
  Firestore,
  runTransaction,
  Timestamp,
} from '@angular/fire/firestore';
import { Counter } from '../models/db/Counter';
import { LoginForm } from '../models/LoginForm';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  collectionName: string = 'pd_staff';
  collectionReference!: CollectionReference;

  counterCollectionName: string = 'pd_counters';
  staffDocumentName: string = 'employees';

  constructor(private db: Firestore, private authService: AuthService) {
    this.collectionReference = collection(this.db, this.collectionName);
  }

  async registerEmployee(staffRawData: RawStaffData, loginForm: LoginForm) {
    const counterRef = doc(
      this.db,
      this.counterCollectionName,
      this.staffDocumentName
    );

    const newUserUid = await this.authService.registerNewUser(
      loginForm.email,
      loginForm.password
    );

    if (newUserUid === '') {
      return;
    }

    try {
      await runTransaction(this.db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) {
          throw new Error('Counter document does not exist!');
        }

        const lastId = (counterDoc.data() as Counter).lastId || 0;
        const newId = lastId + 1;

        const newEmployeeRef = doc(this.collectionReference, newId.toString());

        const staffData: Staff = {
          ...staffRawData,
          uid: newUserUid,
          id: newEmployeeRef.id,
          employeeId: String(newId).padStart(3, '0'),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        transaction.set(newEmployeeRef, {
          ...staffData,
        });

        transaction.update(counterRef, { lastId: newId });
      });

      console.log('Employee registered successfully.');
    } catch (e) {
      console.error('Transaction failed: ', e);
    }
  }
}
