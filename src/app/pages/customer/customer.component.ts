// customer.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-customer',
  imports: [FormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  customerForm: Customer = { name: '', email: '', phone: '', address: '' };
  editingIndex: number = -1;
  searchInput: string = '';

  ngOnInit(): void {
    this.loadCustomersFromLocalStorage();
  }

  private saveCustomersToLocalStorage(): void {
    localStorage.setItem('customers', JSON.stringify(this.customers));
  }

  private loadCustomersFromLocalStorage(): void {
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      try {
        this.customers = JSON.parse(storedCustomers);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.customerForm.name || !this.customerForm.email || 
      !this.customerForm.phone || !this.customerForm.address) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    try {
      if (this.editingIndex === -1) {
        // Add new customer
        this.customers.push({...this.customerForm});
      } else {
        // Update existing customer
        this.customers[this.editingIndex] = {...this.customerForm};
      }

      this.saveCustomersToLocalStorage();
      Swal.fire({
        icon: 'success',
        title: this.editingIndex === -1 ? 'Customer added!' : 'Customer updated!',
        showConfirmButton: false,
        timer: 1500
      });
      
      this.cancelEdit();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Operation failed', 'error');
    }
  }

  deleteCustomer(index: number): void {
    this.customers.splice(index, 1);
    this.saveCustomersToLocalStorage();
    Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
  }

  editCustomer(index: number): void {
    this.customerForm = { ...this.customers[index] };
    this.editingIndex = index;
  }

  cancelEdit(): void {
    this.editingIndex = -1;
    this.customerForm = { name: '', email: '', phone: '', address: '' };
  }

  get filteredCustomers(): Customer[] {
    if (!this.searchInput) return this.customers;
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }
}