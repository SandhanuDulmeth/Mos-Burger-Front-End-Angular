import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}
@Component({
  selector: 'app-customer',
  imports: [FormsModule,CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];
  // This object holds the form data
  customerForm: Customer = { name: '', email: '', phone: '', address: '' };
  // Track whether we're editing an existing customer (by index) or adding a new one
  editingIndex: number = -1;
  // Model for search input
  searchInput: string = '';

  ngOnInit(): void {
    this.loadCustomersFromLocalStorage();
  }

  // Called when the form is submitted
  onSubmit(): void {
    if (!this.customerForm.name || !this.customerForm.email || !this.customerForm.phone || !this.customerForm.address) {
      alert('Please fill in all fields');
      return;
    }

    if (this.editingIndex === -1) {
      this.addCustomer({ ...this.customerForm });
    } else {
      this.updateCustomer(this.editingIndex, { ...this.customerForm });
      this.editingIndex = -1;
    }
    // Reset the form
    this.customerForm = { name: '', email: '', phone: '', address: '' };
  }

  addCustomer(customer: Customer): void {
    this.customers.push(customer);
    this.saveCustomersToLocalStorage();
  }

  updateCustomer(index: number, updatedCustomer: Customer): void {
    this.customers[index] = updatedCustomer;
    this.saveCustomersToLocalStorage();
  }

  deleteCustomer(index: number): void {
    this.customers.splice(index, 1);
    this.saveCustomersToLocalStorage();
  }

  editCustomer(index: number): void {
    const customer = this.customers[index];
    this.customerForm = { ...customer };
    this.editingIndex = index;
  }

  saveCustomersToLocalStorage(): void {
    localStorage.setItem('customers', JSON.stringify(this.customers));
  }

  loadCustomersFromLocalStorage(): void {
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      this.customers = JSON.parse(storedCustomers);
    }
  }

  // A computed property to filter customers based on the search input
  get filteredCustomers(): Customer[] {
    if (!this.searchInput) {
      return this.customers;
    }
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }
}
