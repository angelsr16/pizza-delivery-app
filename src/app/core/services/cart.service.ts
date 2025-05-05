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
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartDB, CartItem, CartItemDB } from '../models/db/Cart';
import { UsersService } from './users.service';
import { Product } from '../models/db/Product';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject: BehaviorSubject<Cart | null> =
    new BehaviorSubject<Cart | null>(null);

  public cart$: Observable<Cart | null> = this.cartSubject.asObservable();

  cartData!: Cart;

  collectionName: string = 'pd_carts';
  collectionReference!: CollectionReference;

  constructor(
    private db: Firestore,
    private usersSerivice: UsersService,
    private productsService: ProductsService
  ) {
    this.collectionReference = collection(this.db, this.collectionName);

    this.usersSerivice.currentUserDB$.subscribe(async (user) => {
      if (user && user.roles.includes('customer')) {
        this.getCartByUserId(user.id).subscribe((cart) => {
          if (cart) {
            this.loadCartData(cart);
          }
        });
      }
    });
  }

  async loadCartData(cartDB: CartDB) {
    var cartData: Cart;

    var cartItems: CartItem[] = [];

    cartDB.items.forEach(async (cartItem) => {
      const productData: Product | undefined =
        await this.productsService.getProductById(cartItem.productId);

      if (productData) {
        cartItems.push({
          quantity: cartItem.quantity,
          extraInfo: cartItem.extraInfo,
          product: productData,
        });
      }
    });

    cartData = {
      id: cartDB.id,
      userId: cartDB.userId,
      items: cartItems,
    };

    this.cartSubject.next(cartData);
  }

  async addProductToCart(product: Product) {
    const cart: Cart | null = this.cartSubject.getValue();
    if (cart) {
      var foundProduct: boolean = false;

      const cartItemsDB: CartItemDB[] = [];
      cart.items.forEach((cartItem) => {
        var currentQuantity = cartItem.quantity;
        if (cartItem.product.id === product.id) {
          foundProduct = true;
          currentQuantity += 1;
        }

        cartItemsDB.push({
          productId: cartItem.product.id,
          quantity: currentQuantity,
          extraInfo: cartItem.extraInfo,
        });
      });

      if (!foundProduct) {
        cartItemsDB.push({
          productId: product.id,
          quantity: 1,
          extraInfo: '',
        });
      }

      const cartDocumentRef = doc(this.db, this.collectionName, cart.id);

      updateDoc(cartDocumentRef, {
        items: cartItemsDB,
      });
    }
  }

  removeItemQuantity(item: CartItem, itemIndex: number) {
    const cart: Cart | null = this.cartSubject.getValue();
    if (cart) {
      const cartItemsDB: CartItemDB[] = [];
      cart.items.forEach((cartItem) => {
        cartItemsDB.push({
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
          extraInfo: cartItem.extraInfo,
        });
      });

      cartItemsDB[itemIndex].quantity -= 1;
      if (cartItemsDB[itemIndex].quantity === 0) {
        cartItemsDB.splice(itemIndex, 1);
      }

      const cartDocumentRef = doc(this.db, this.collectionName, cart.id);

      updateDoc(cartDocumentRef, {
        items: cartItemsDB,
      });
    }
  }

  addItemQuantity(item: CartItem, itemIndex: number) {
    const cart: Cart | null = this.cartSubject.getValue();
    if (cart) {
      const cartItemsDB: CartItemDB[] = [];
      cart.items.forEach((cartItem) => {
        cartItemsDB.push({
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
          extraInfo: cartItem.extraInfo,
        });
      });

      cartItemsDB[itemIndex].quantity += 1;

      const cartDocumentRef = doc(this.db, this.collectionName, cart.id);

      updateDoc(cartDocumentRef, {
        items: cartItemsDB,
      });
    }
  }

  removeItem(itemIndex: number) {
    const cart: Cart | null = this.cartSubject.getValue();
    if (cart) {
      const cartItemsDB: CartItemDB[] = [];
      cart.items.forEach((cartItem) => {
        cartItemsDB.push({
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
          extraInfo: cartItem.extraInfo,
        });
      });

      cartItemsDB.splice(itemIndex, 1);

      const cartDocumentRef = doc(this.db, this.collectionName, cart.id);

      updateDoc(cartDocumentRef, {
        items: cartItemsDB,
      });
    }
  }

  async registerCart(userId: string) {
    const cartDocumentRef = doc(this.collectionReference, userId);

    const cart: CartDB = {
      id: cartDocumentRef.id,
      userId,
      items: [],
      createdAt: Timestamp.now(),
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
