import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Order {
  id: string;
  date: Date;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: {
    item: {
      id: string;
      name: string;
      price: number;
      category: string;
      image: string;
    };
    quantity: number;
  }[];
  total: number;
  status: string;
}


@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    const storedOrders = localStorage.getItem('order');
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders);
        this.orders = parsedOrders.map((order: any, index: number) => ({
          id: `ORD${index + 1}`,
          date: new Date(order.timestamp),
          customer: order.customer,
          items: order.items,
          total: order.total,
          status: 'Delivered'
        }));
      } catch (error) {
        console.error('Error parsing orders:', error);
      }
    }
  }

  printOrderReport(index: number) {
    const storedOrders = localStorage.getItem('order') || '[]'; // Handle null
    const orders = JSON.parse(storedOrders);
    const order = orders[index];
  
    if (order) {
      // Access customer details correctly
      const customerName = order.customer?.name || 'No Name';
      const contactNo = order.customer?.phone || 'No Contact';
      const items = Array.isArray(order.items) ? order.items : [];
      const total = (Number(order.total) || 0) / 100; // Convert to currency
  
      const doc = new jsPDF();
  
      // Header
      doc.setFontSize(24);
      doc.setTextColor(255, 165, 0);
      doc.text("MOS BURGERS", 105, 20, { align: 'center' });
  
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("SALES INVOICE", 105, 30, { align: 'center' });
  
      // Customer and Date
      doc.setFontSize(12);
      doc.text(`Date: ${new Date(order.timestamp).toLocaleString()}`, 10, 40);
      doc.text(`Customer: ${customerName} (${contactNo})`, 10, 50);
  
      // Items Table Header
      doc.setFontSize(14);
      doc.text("Item", 10, 70);
      doc.text("Qty", 100, 70);
      doc.text("Price", 130, 70);
      doc.text("Total", 170, 70);
  
      // Items Table Rows
      doc.setFontSize(12);
      let yPosition = 80;
      items.forEach((item: any) => {
        const itemDetails = item.item || {};
        const quantity = Number(item.quantity) || 0;
        const price = (Number(itemDetails.price) || 0) / 100; // Convert to currency
        const total = quantity * price;
  
        doc.text(itemDetails.name || 'Unknown Item', 10, yPosition);
        doc.text(quantity.toString(), 100, yPosition);
        doc.text(`Rs.${price.toFixed(2)}`, 130, yPosition);
        doc.text(`Rs.${total.toFixed(2)}`, 170, yPosition);
  
        yPosition += 10;
      });
  
      // Total Amount
      doc.setFontSize(14);
      doc.setTextColor(255, 165, 0);
      doc.text(`Total Amount: Rs.${total.toFixed(2)}`, 170, yPosition + 10, { align: 'right' });
  
      // Footer
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Thank you for dining with us!", 105, yPosition + 30, { align: 'center' });
      doc.setFontSize(10);
      doc.text("MOS Burgers - Delicious burgers, happy customers!", 105, yPosition + 40, { align: 'center' });
      doc.text("www.mosburgers.lk", 105, yPosition + 50, { align: 'center' });
  
      doc.save(`MOS_BURGERS_Invoice_${index + 1}.pdf`);
    } else {
      alert('Order not found!');
    }
  }
}