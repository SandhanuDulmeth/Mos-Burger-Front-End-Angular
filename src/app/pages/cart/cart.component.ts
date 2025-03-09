import { Component } from '@angular/core';
import { CartService, CartItem } from '../cart/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  customers: Customer[] = [];
  selectedCustomer: Customer = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
cartItems!: CartItem[];
    total = 0;

  constructor(private cartService: CartService ,  private dialogRef: MatDialogRef<CartComponent>) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotalPrice();
      this.loadCustomers();
    });
  }

  loadCustomers() {
    const customersData = localStorage.getItem('customers');
    this.customers = customersData ? JSON.parse(customersData) : [];
  }

  selectCustomer(event: Event) {
    const phone = (event.target as HTMLSelectElement).value;
    const customer = this.customers.find(c => c.phone === phone);
    
    if (customer) {
      this.selectedCustomer = { ...customer };
    } else {
      this.selectedCustomer = {
        name: '',
        email: '',
        phone: '',
        address: ''
      };
    }
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

clearCart() { 
  this.cartItems = [];

}
clearCustomer() {
  this.selectedCustomer = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
}

closeCart() {
  this.dialogRef.close();
}
  checkout() {
    if (!this.selectedCustomer.name || !this.selectedCustomer.phone) {
      alert('Please provide at least name and phone number!');
      return;
    }
  
    const order = {
      customer: { ...this.selectedCustomer },
      items: this.cartItems,
      total: this.total,
      timestamp: new Date().toISOString()
    };
  
   
    const ordersData = localStorage.getItem('order');
    const existingOrders: any[] = ordersData ? JSON.parse(ordersData) : [];
 
    existingOrders.push(order);
  
   
    localStorage.setItem('order', JSON.stringify(existingOrders));
  
    console.log('Order placed:', order);
    

    this.clearCart();
 this.clearCustomer();
  }
}
