import { Injectable } from '@angular/core';
import { RawStaffData, Staff } from '../models/db/Staff';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  runTransaction,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Counter } from '../models/db/Counter';
import { LoginForm } from '../models/ui/LoginForm';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { RawUserDB, UserDB } from '../models/UserDB';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  collectionName: string = 'pd_staff';
  collectionReference!: CollectionReference;

  counterCollectionName: string = 'pd_counters';
  staffDocumentName: string = 'employees';

  private readonly staffSubject: BehaviorSubject<Staff[]> = new BehaviorSubject<
    Staff[]
  >([]);

  readonly staff$: Observable<Staff[]> = this.staffSubject.asObservable();

  constructor(
    private db: Firestore,
    private authService: AuthService,
    private storageService: StorageService,
    private usersService: UsersService
  ) {
    this.collectionReference = collection(this.db, this.collectionName);

    collectionData(this.collectionReference).subscribe((data) => {
      this.staffSubject.next(data as Staff[]);
    });
  }

  async registerEmployee(
    rawStaffData: RawStaffData,
    file: File,
    loginForm: LoginForm
  ) {
    const counterRef = doc(
      this.db,
      this.counterCollectionName,
      this.staffDocumentName
    );

    const newUserUid = await this.authService.registerNewUserStaff(
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

        const newEmployeeRef = doc(this.collectionReference);

        const uploadedImageFile = await this.storageService.uploadFile(
          file,
          `staff/${newEmployeeRef.id}/${rawStaffData.name}`
        );

        const userDB: UserDB = {
          id: newUserUid,
          email: loginForm.email,
          roles: rawStaffData.roles,
        };

        await this.usersService.registerUser(userDB);

        const staffData: Staff = {
          ...rawStaffData,
          uid: newUserUid,
          id: newEmployeeRef.id,
          photoFile: uploadedImageFile,
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

  async updateStaff(
    staff: Staff,
    rawStaffData: RawStaffData,
    imageFile: File | undefined
  ) {
    const productDoc = doc(this.db, this.collectionName, staff.id);

    const newProduct: Staff = {
      ...staff,
      ...rawStaffData,
      updatedAt: Timestamp.now(),
    };

    if (imageFile) {
      await this.storageService.deleteFile(staff.photoFile.storagePath);

      const uploadedImageFile = await this.storageService.uploadFile(
        imageFile,
        `products/${staff.id}/${rawStaffData.name}`
      );

      newProduct.photoFile = uploadedImageFile;
    }

    await updateDoc(productDoc, { ...newProduct });
  }
}
