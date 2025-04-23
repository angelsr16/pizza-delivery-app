import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  setDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Drink,
  Pizza,
  BaseProduct,
  Product,
  RawProduct,
} from '../models/db/Product';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  collectionName: string = 'pd_products';
  collectionReference!: CollectionReference;

  private readonly productSubject: BehaviorSubject<Product[]> =
    new BehaviorSubject<Product[]>([]);

  readonly products$: Observable<Product[]> =
    this.productSubject.asObservable();

  constructor(private db: Firestore, private storageService: StorageService) {
    this.collectionReference = collection(this.db, this.collectionName);

    collectionData(this.collectionReference).subscribe((data) => {
      this.productSubject.next(data as Product[]);
    });

    // this.registerPizza();
  }

  async registerProduct(rawProductData: RawProduct, imageFile: File) {
    const newProductDoc = doc(this.collectionReference);

    const uploadedImageFile = await this.storageService.uploadFile(
      imageFile,
      `products/${newProductDoc.id}/${rawProductData.name}`
    );

    const newProductData: Product = {
      ...rawProductData,
      id: newProductDoc.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      imageFile: uploadedImageFile,
    };

    await setDoc(newProductDoc, newProductData);
  }

  // registerPizza() {
  //   const pizzaDocReference = doc(this.collectionReference);

  //   const pizzaData: Drink = {
  //     id: pizzaDocReference.id,
  //     name: 'Hawaiana',
  //     type: 'pizza',
  //     price: 100,
  //     volume: '100ml',
  //     imageUrl:
  //       'https://firebasestorage.googleapis.com/v0/b/angelsanchezromeroportfolio.appspot.com/o/coke.png?alt=media&token=0c95ebe3-99b3-4eba-9c89-4815e30dba4a',
  //   };

  //   setDoc(pizzaDocReference, pizzaData);
  // }
}
