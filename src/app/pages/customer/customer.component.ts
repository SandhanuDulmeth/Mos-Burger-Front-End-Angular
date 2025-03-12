// customer.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Customer {
  id?: string;
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
  editingCustomerId: string | null = null;
  searchInput: string = '';

  async ngOnInit(): Promise<void> {
    await this.loadCustomers();
    this.loadCustomersFromLocalStorage();
  }

  async loadCustomers(): Promise<void> {
    try {
      const response = await fetch('http://localhost:8080/customerController/get-Customers');
      if (!response.ok) throw new Error('Failed to load customers');
      this.customers = await response.json();
      this.saveCustomersToLocalStorage();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to load customers', 'error');
    }
  }

  private saveCustomersToLocalStorage(): void {
    localStorage.setItem('customers', JSON.stringify(this.customers));
  }
  
  private loadCustomersFromLocalStorage(): void {
    const storedData = localStorage.getItem('customers');
    if (storedData) {
      try {
        this.customers = JSON.parse(storedData);
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

    const url = this.editingCustomerId 
      ? 'http://localhost:8080/customerController/update-Customers'
      : 'http://localhost:8080/customerController/add-Customers';

    try {
      const body = this.editingCustomerId
        ? { ...this.customerForm, id: this.editingCustomerId }
        : this.customerForm;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.text();
      if (result === "true") {
        // Update local data
        if (this.editingCustomerId) {
          this.customers = this.customers.map(c => 
            c.id === this.editingCustomerId ? {...body, id: this.editingCustomerId} : c
          );
        } else {
          const tempId = Date.now().toString();
          this.customers = [...this.customers, {...body, id: tempId}];
        }

        this.saveCustomersToLocalStorage();
        Swal.fire({
          icon: 'success',
          title: this.editingCustomerId ? 'Customer updated!' : 'Customer added!',
          showConfirmButton: false,
          timer: 1500
        });
        await this.loadCustomers(); // Refresh from server
        this.cancelEdit();
      } else {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Operation failed', 'error');
    }
  }

  async deleteCustomer(customerId: string): Promise<void> {
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
        const response = await fetch(
          `http://localhost:8080/customerController/delete-Customers/${customerId}`,
          { method: 'DELETE' }
        );

        const result = await response.text();
        if (result === "true") {
          this.customers = this.customers.filter(c => c.id !== customerId);
          this.saveCustomersToLocalStorage();
          Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
          await this.loadCustomers(); // Refresh from server
        } else {
          throw new Error('Deletion failed');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Deletion failed', 'error');
      }
    }
  }

  editCustomer(customer: Customer): void {
    this.customerForm = { ...customer };
    this.editingCustomerId = customer.id || null;
  }

  cancelEdit(): void {
    this.editingCustomerId = null;
    this.customerForm = { name: '', email: '', phone: '', address: '' };
  }

  get filteredCustomers(): Customer[] {
    if (!this.searchInput) return this.customers;
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchInput.toLowerCase())
    );
  }
}