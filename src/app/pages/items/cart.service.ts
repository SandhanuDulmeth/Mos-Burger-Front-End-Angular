// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from './items.component'; 
export interface CartItem {
  item: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addItem(item: MenuItem) {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(ci => ci.item.id === item.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({ item, quantity: 1 });
    }
    
    this.cartItems.next(currentCart);
  }

  updateQuantity(itemId: string, quantity: number) {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(ci => ci.item.id === itemId);
    
    if (item) {
      item.quantity = quantity;
      this.cartItems.next(currentCart);
    }
  }

  removeItem(itemId: string) {
    const currentCart = this.cartItems.value.filter(ci => ci.item.id !== itemId);
    this.cartItems.next(currentCart);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, ci) => 
      total + (ci.item.price * ci.quantity), 0);
  }
}