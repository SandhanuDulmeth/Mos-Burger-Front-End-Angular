import { Component } from '@angular/core';
import { CartService, CartItem } from '../cart/cart.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
cartItems!: CartItem[];
    total = 0;

  constructor(private cartService: CartService) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotalPrice();
    });
  }
  updateQuantity(itemId: string, event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    const quantity = parseInt(event.target.value, 10);
    
    if (!isNaN(quantity)) {
      const safeQuantity = Math.max(1, quantity);
      this.cartService.updateQuantity(itemId, safeQuantity);
    }
  }
  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  checkout() {
    // Implement checkout logic
    console.log('Checkout clicked');
    
  }
}
