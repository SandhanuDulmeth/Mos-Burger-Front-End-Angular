// cart.component.ts
import { Component } from '@angular/core';
import { CartService, CartItem } from './cart.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cart',
  standalone: true,  // Add this if using standalone components
  imports: [CommonModule],  // Add this line
  template: `
    <div class="cart-container">
      <h2>Your Cart</h2>
      <div *ngFor="let cartItem of cartItems" class="cart-item">
        <div class="item-info">
          <h5>{{ cartItem.item.name }}</h5>
          <p>Rs.{{ cartItem.item.price | number:'1.2-2' }}</p>
        </div>
        <div class="quantity-controls">
          <input type="number" [value]="cartItem.quantity" min="1" 
          (change)="updateQuantity(cartItem.item.id, $event)">
          <button class="btn btn-danger" (click)="removeItem(cartItem.item.id)">
            Remove
          </button>
        </div>
        <div class="item-total">
          Rs.{{ (cartItem.item.price * cartItem.quantity) | number:'1.2-2' }}
        </div>
      </div>
      <div class="total-section">
        <h4>Total: Rs.{{ total | number:'1.2-2' }}</h4>
        <button class="btn btn-primary" (click)="checkout()">Checkout</button>
      </div>
    </div>
  `,
  styles: [`
    .cart-container { padding: 20px; }
    .cart-item { display: flex; justify-content: space-between; margin-bottom: 15px; }
    .quantity-controls input { width: 60px; margin-right: 10px; }
    .total-section { margin-top: 20px; text-align: right; }20px; text-align: right; }
  `]
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