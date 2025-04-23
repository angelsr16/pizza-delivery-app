import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  setDoc,
  Timestamp,
  updateDoc,
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
  }

  async updateProduct(
    product: Product,
    rawProductData: RawProduct,
    imageFile: File | undefined
  ) {
    const productDoc = doc(this.db, this.collectionName, product.id);

    const newProduct: Product = {
      ...product,
      ...rawProductData,
      updatedAt: Timestamp.now(),
    };

    if (imageFile) {
      await this.storageService.deleteFile(product.imageFile.storagePath);

      const uploadedImageFile = await this.storageService.uploadFile(
        imageFile,
        `products/${product.id}/${rawProductData.name}`
      );

      newProduct.imageFile = uploadedImageFile;
    }

    await updateDoc(productDoc, { ...newProduct });
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
}
