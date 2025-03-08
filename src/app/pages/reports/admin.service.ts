import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getOrders() {
    const rawData = sessionStorage.getItem('orders');
    try {
      return rawData ? JSON.parse(rawData) : [];
    } catch (error) {
      return [];
    }
  }

  processData(orders: any[]) {
    const todayString = new Date().toISOString().split('T')[0];
    const customerOrderCount: { [key: string]: number } = {};
    const itemCount: { [key: string]: number } = {};
    const todayTransactions: any[] = [];

    orders.forEach(order => {
      const customerName = order.customer?.name || 'Unknown Customer';
      customerOrderCount[customerName] = (customerOrderCount[customerName] || 0) + 1;

      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          const itemName = item.item?.name || 'Unknown Item';
          const quantity = parseInt(item.quantity) || 0;
          itemCount[itemName] = (itemCount[itemName] || 0) + quantity;
        });
      }

      todayTransactions.push(order);
    });

    return {
      sortedCustomers: Object.entries(customerOrderCount).sort((a, b) => b[1] - a[1]),
      sortedItems: Object.entries(itemCount).sort((a, b) => b[1] - a[1]),
      transactions: todayTransactions
    };
  }
}