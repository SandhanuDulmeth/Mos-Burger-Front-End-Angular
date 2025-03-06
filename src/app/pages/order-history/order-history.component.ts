import { Component } from '@angular/core';

interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  orders: Order[] = [
    // Sample data - replace with actual data from service
    {
      id: 'ORD12345',
      date: '2024-03-15',
      items: [
        { name: 'Product 1', quantity: 2, price: 25 },
        { name: 'Product 2', quantity: 1, price: 40 }
      ],
      total: 90,
      status: 'Delivered'
    }
  ];

  constructor() { }

  downloadInvoice(orderId: string): void {
    // Implement PDF generation logic here
    console.log(`Downloading invoice for order ${orderId}`);
    // You can use jsPDF here to generate the PDF
  }

  repeatOrder(orderId: string): void {
    // Implement repeat order logic here
    console.log(`Repeating order ${orderId}`);
  }
}