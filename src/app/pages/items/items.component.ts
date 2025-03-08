import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

@Component({
  selector: 'app-items',
  imports: [FormsModule,CommonModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {

public categories: any ;
  constructor(){
    this.categories =['All', 'Burger', 'Submarine', 'Fries', 'Pasta', 'Chicken', 'Beverage'];
  }

   menuItems: MenuItem[] = [];

  ngOnInit(): void {
     }

  filterItems(cat: any) {
    console.log(cat);
    
  }
  addToCart(item:any){
    console.log(item);
    
  }


}
