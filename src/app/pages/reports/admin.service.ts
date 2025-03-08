// admin.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getOrders() {
    const rawData = localStorage.getItem('order'); 
    try {
      const orders = JSON.parse(rawData || '[]');
      
      // Add validation for order structure
      return orders.map((order: any) => ({
        customer: order.customer || { name: 'Unknown Customer' },
        items: order.items || [],
        total: order.total || 0,
        timestamp: order.timestamp || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error parsing orders:', error);
      return [];
    }
  }

  processData(orders: any[]) {
    const customerOrderCount: { [key: string]: number } = {};
    const itemCount: { [key: string]: number } = {};
    const transactions: any[] = [];

    orders.forEach(order => {
      const customerName = order.customer.name || 'Unknown Customer';
      customerOrderCount[customerName] = (customerOrderCount[customerName] || 0) + 1;

      order.items.forEach((item: any) => {
        const itemName = item.item?.name || 'Unknown Item';
        const quantity = parseInt(item.quantity) || 0;
        itemCount[itemName] = (itemCount[itemName] || 0) + quantity;
      });

      transactions.push(order);
    });

    return {
      sortedCustomers: Object.entries(customerOrderCount).sort((a, b) => b[1] - a[1]),
      sortedItems: Object.entries(itemCount).sort((a, b) => b[1] - a[1]),
      transactions: transactions
    };
  }
}