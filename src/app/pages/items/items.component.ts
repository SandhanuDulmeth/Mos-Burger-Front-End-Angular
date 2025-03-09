import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../cart/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
export interface MenuItem {
  id: string;  
  name: string;
  price: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-items',
  imports: [FormsModule, CommonModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  private allItems: MenuItem[] = [];
  public categories: string[] = [];
  menuItems: MenuItem[] = [];
  selectedCategory = 'All';
  cartItemCount = 0;

  constructor(
    private cartService: CartService,
    public dialog: MatDialog
  ) {
    this.categories = ['All', 'Burger', 'Submarine', 'Fries', 'Pasta', 'Chicken', 'Beverage'];
  }

  ngOnInit(): void {
    this.loadItemsFromJSON();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((sum, ci) => sum + ci.quantity, 0);
    });
  }

  normalizeItems(rawItems: any[]): MenuItem[] {
    return rawItems.map(item => ({
      id: item.itemNo,
      name: item.name,
      price: Number(item.price),
      category: item.itemType,  
      image: item.imageUrl   
    }));
  }

  async loadItemsFromJSON() {
    try {
      const response = await fetch("http://localhost:8080/itemController/get-Items");
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
    
        localStorage.setItem('items', JSON.stringify(data));
       
        const storedItems = localStorage.getItem('items');
        if (storedItems) {
          this.allItems = this.normalizeItems(JSON.parse(storedItems)); 
        }

      this.filterItems(this.selectedCategory);  
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

filterItems(category: string) {
    this.selectedCategory = category;
    
    if (category === 'All') {
      this.menuItems = [...this.allItems];
    } else {
      this.menuItems = this.allItems.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
      );
    }
  }
  addToCart(item: MenuItem) {
    this.cartService.addItem(item);
  }

    openCart() {
      
    this.dialog.open(CartComponent, {
      width: '600px',
      position: { right: '0', top: '0' },
      height: '100vh',
      panelClass: 'cart-modal'
    });
  }
}