import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Cart, CartDB } from '../models/db/Cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  collectionName: string = 'pd_carts';
  collectionReference!: CollectionReference;

  constructor(private db: Firestore) {
    this.collectionReference = collection(this.db, this.collectionName);
  }

  addProductToCartdId(cartId: string) {}

  async registerCart(userId: string) {
    const cartDocumentRef = doc(this.collectionReference, userId);

    const cart: CartDB = {
      userId,
      items: [],
      updatedAt: Timestamp.now(),
    };

    await setDoc(cartDocumentRef, cart);
  }

  getCartByUserId(userId: string): Observable<CartDB | undefined> {
    const cartDocumentRef = doc(this.collectionReference, userId);

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        cartDocumentRef,
        (docSnap) => {
          if (docSnap.exists()) {
            observer.next(docSnap.data() as CartDB);
          } else {
            observer.next(undefined);
          }
        },
        (error) => {
          observer.error(error);
        }
      );
      return () => unsubscribe();
    });
  }
}
