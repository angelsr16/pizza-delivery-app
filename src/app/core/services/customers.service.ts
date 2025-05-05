import { Injectable } from '@angular/core';
import { Customer } from '../models/db/Customer';
import { AuthService } from './auth.service';
import { UserDB } from '../models/UserDB';
import { CustomerRegistrationForm } from '../models/ui/CustomerRegistrationForm';
import { UsersService } from './users.service';
import {
  collection,
  CollectionReference,
  doc,
  Firestore,
  Timestamp,
} from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  collectionName: string = 'pd_customers';
  collectionReference!: CollectionReference;

  constructor(
    private db: Firestore,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.collectionReference = collection(this.db, this.collectionName);
  }

  async registerCustomer(customerForm: CustomerRegistrationForm) {
    const newUserUid = await this.authService.registerNewCustomerUser(
      customerForm.email,
      customerForm.password
    );

    if (newUserUid === '' || newUserUid === undefined) {
      return;
    }

    const userDB: UserDB = {
      id: newUserUid,
      email: customerForm.email,
      roles: ['customer'],
    };

    await this.usersService.registerUser(userDB);

    const { firstName, lastName, email } = customerForm;

    const customerDoc = doc(this.collectionReference);
    const customerData: Customer = {
      firstName,
      lastName,
      email,
      deliveryLocation: customerForm.deliveryLocation,
      id: customerDoc.id,
      uid: newUserUid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(customerDoc, customerData);
  }
}
