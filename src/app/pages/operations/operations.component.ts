import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export interface Item {
  itemNo: string;
  itemType: string;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-operations',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent implements OnInit {
  itemForm: FormGroup;
  items: Item[] = [];
  filteredItems: Item[] = [];
  searchTerm: string = '';
  isEditing: boolean = false;
  categories = ['Burger', 'Submarine', 'Fries', 'Pasta', 'Chicken', 'Beverage'];

  constructor(private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      id: ['', Validators.required],         
      category: ['', Validators.required],    
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required]     
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    try {
      const response = await fetch("http://localhost:8080/itemController/get-Items");
      if (!response.ok) throw new Error('Failed to load items');
      this.items = await response.json();
      this.filteredItems = [...this.items];
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to load items', 'error');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.itemForm.invalid) return;

    const formData = this.itemForm.value;
    const url = this.isEditing 
      ? "http://localhost:8080/itemController/update-Item"
      : "http://localhost:8080/itemController/add-Item";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemNo: formData.id,
          itemType: formData.category,
          name: formData.name,
          price: formData.price,
          imageUrl: formData.image
        }),
      });

      const result = await response.text();
      if (result === "true") {
        Swal.fire({
          icon: 'success',
          title: this.isEditing ? 'Item updated!' : 'Item added!',
          showConfirmButton: false,
          timer: 1500
        });
        await this.loadItems();
        this.cancelEdit();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Operation failed', 'error');
    }
  }



  filterItems(): void {
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  editItem(item: Item): void {
    this.isEditing = true;
    this.itemForm.patchValue({
      id: item.itemNo,        
      name: item.name,
      price: item.price,
      image: item.imageUrl    
    });
  }

  async deleteItem(itemNo: string): Promise<void> { 
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/itemController/delete-Item/${itemNo}`, {
          method: "DELETE"
        });

        const result = await response.text();
        if (result === "true") {
          Swal.fire('Deleted!', 'Item has been deleted.', 'success');
          await this.loadItems();
        } else {
          throw new Error('Deletion failed');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Deletion failed', 'error');
      }
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.itemForm.reset();
  }
}