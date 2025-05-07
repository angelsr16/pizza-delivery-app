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
import { Drink, Pizza, Product } from '../models/db/Product';
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
  collectionReference: CollectionReference;

  constructor(
    private db: Firestore,
    private usersService: UsersService,
    private productsService: ProductsService
  ) {
    this.collectionReference = collection(this.db, this.collectionName);

    this.usersService.currentUserDB$.subscribe((user) => {
      if (user && user.roles.includes('customer')) {
        this.getCartByUserId(user.id).subscribe((cart) => {
          if (cart) {
            this.loadCartData(cart);
          }
        });
      }
    });
  }

  private isPizza(product: Product): product is Pizza {
    return product.type === 'pizza';
  }

  private isDrink(product: Product): product is Drink {
    return product.type === 'drink';
  }

  private mapCartItemToDB(item: CartItem): CartItemDB {
    const base: CartItemDB = {
      productId: item.product.id,
      quantity: item.quantity,
      extraInfo: item.extraInfo,
      price: item.price,
    };

    if (this.isPizza(item.product)) {
      return { ...base, size: item.size ?? item.product.sizes[0].size };
    }

    return base;
  }

  async loadCartData(cartDB: CartDB) {
    const cartItems: CartItem[] = await Promise.all(
      cartDB.items.map(async (cartItem) => {
        const productData = await this.productsService.getProductById(
          cartItem.productId
        );
        if (!productData) return null;

        const item: CartItem = {
          quantity: cartItem.quantity,
          extraInfo: cartItem.extraInfo,
          product: productData,
          price: cartItem.price,
        };

        if (this.isPizza(productData)) {
          item.size = cartItem.size ?? productData.sizes[0].size;
        }

        return item;
      })
    ).then((items) => items.filter((i): i is CartItem => i !== null));

    const cartData: Cart = {
      id: cartDB.id,
      userId: cartDB.userId,
      items: cartItems,
    };

    this.cartSubject.next(cartData);
  }

  async addProductToCart(product: Product) {
    const cart = this.cartSubject.getValue();
    if (!cart) return;

    const existingItemIndex = cart.items.findIndex(
      (i) => i.product.id === product.id
    );
    let updated = false;

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += 1;
      updated = true;
    } else {
      const newItem: CartItem = {
        quantity: 1,
        extraInfo: '',
        product,
        price: this.isPizza(product)
          ? product.sizes[0].price
          : product.price ?? 0,
        size: this.isPizza(product) ? product.sizes[0].size : undefined,
      };
      cart.items.push(newItem);
      updated = true;
    }

    if (updated) {
      const cartItemsDB = cart.items.map(this.mapCartItemToDB.bind(this));
      const cartRef = doc(this.db, this.collectionName, cart.id);
      await updateDoc(cartRef, { items: cartItemsDB });
    }
  }

  async addItemQuantity(index: number) {
    const cart = this.cartSubject.getValue();
    if (!cart) return;

    cart.items[index].quantity += 1;
    const cartItemsDB = cart.items.map(this.mapCartItemToDB.bind(this));
    await updateDoc(doc(this.db, this.collectionName, cart.id), {
      items: cartItemsDB,
    });
  }

  async removeItemQuantity(index: number) {
    const cart = this.cartSubject.getValue();
    if (!cart) return;

    cart.items[index].quantity -= 1;

    if (cart.items[index].quantity <= 0) {
      cart.items.splice(index, 1);
    }

    const cartItemsDB = cart.items.map(this.mapCartItemToDB.bind(this));
    await updateDoc(doc(this.db, this.collectionName, cart.id), {
      items: cartItemsDB,
    });
  }

  async removeItem(index: number) {
    const cart = this.cartSubject.getValue();
    if (!cart) return;

    cart.items.splice(index, 1);
    const cartItemsDB = cart.items.map(this.mapCartItemToDB.bind(this));
    await updateDoc(doc(this.db, this.collectionName, cart.id), {
      items: cartItemsDB,
    });
  }

  async registerCart(userId: string) {
    const cartRef = doc(this.collectionReference, userId);

    const cart: CartDB = {
      id: cartRef.id,
      userId,
      items: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(cartRef, cart);
  }

  getCartByUserId(userId: string): Observable<CartDB | undefined> {
    const cartRef = doc(this.collectionReference, userId);

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(
        cartRef,
        (docSnap) => {
          if (docSnap.exists()) {
            observer.next(docSnap.data() as CartDB);
          } else {
            observer.next(undefined);
          }
        },
        (error) => observer.error(error)
      );

      return () => unsubscribe();
    });
  }
}
