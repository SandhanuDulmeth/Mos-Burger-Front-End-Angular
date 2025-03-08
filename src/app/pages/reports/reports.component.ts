import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from './admin.service';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  @ViewChild('myChart') chartRef!: ElementRef;
  sortedCustomers: any[] = [];
  sortedItems: any[] = [];
  transactions: any[] = [];
  reportDate = new Date().toLocaleString();
  chart: any;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    const orders = this.adminService.getOrders();
    const processedData = this.adminService.processData(orders);
    this.sortedCustomers = processedData.sortedCustomers;
    this.sortedItems = processedData.sortedItems;
    this.transactions = processedData.transactions;
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.sortedItems.map(item => item[0]),
        datasets: [{
          label: 'Quantity Sold',
          data: this.sortedItems.map(item => item[1]),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  generatePDF() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
  
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPos = 35;
    let pageNumber = 1;
  

    const addHeader = () => {
      doc.setFontSize(18);
      doc.setTextColor(255, 165, 0);
      doc.text("MOS BURGERS", pageWidth / 2, 10, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Daily Order Report", pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Report generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 25, { align: 'center' });
    };
  
    const addFooter = (pageNumber: number) => {
      doc.setFontSize(10);
      doc.text("MOS Burgers - Delicious burgers, happy customers!", pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text(`Page ${pageNumber}`, pageWidth - 10, pageHeight - 10, { align: 'right' });
      doc.text("www.mosburgers.lk", 10, pageHeight - 10);
    };
  
  
    addHeader();
    addFooter(pageNumber);
  
  
    const addTable = (title: string, headers: string[], data: any[][]) => {
      
      if (yPos > pageHeight - 40) {
        doc.addPage();
        pageNumber++;
        yPos = 35;
        addHeader();
        addFooter(pageNumber);
      }
  
      
      doc.setFontSize(14);
      doc.text(title, 14, yPos);
      yPos += 10;
  
    
      const colWidths = [60, 30, 50]; 
      const rowHeight = 10;
      const cellPadding = 2;
  
    
      doc.setFontSize(12);
      doc.setFont('', 'bold');
      headers.forEach((header, i) => {
        doc.text(header, 14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), yPos);
      });
      yPos += rowHeight;
  
      
      doc.setFont('', 'normal');
      doc.setFontSize(10);
      data.forEach(row => {
       
        if (yPos > pageHeight - 20) {
          doc.addPage();
          pageNumber++;
          yPos = 35;
          addHeader();
          addFooter(pageNumber);
        }
  
        row.forEach((cell, i) => {
          doc.text(cell.toString(), 
            14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + cellPadding, 
            yPos + cellPadding
          );
        });
        yPos += rowHeight;
      });
  
      yPos += 10; 
    };
  
 
    const customerData = this.sortedCustomers.map(c => [c[0], c[1].toString()]);
    addTable("Customers with Most Orders", ["Customer Name", "Orders"], customerData);
  
 
    const itemData = this.sortedItems.map(i => [i[0], i[1].toString()]);
    addTable("Most Popular Items", ["Item Name", "Quantity"], itemData);
  
    
    const transactionData = this.transactions.map(t => [
      t.customer?.name || 'Unknown',
      t.items.map((i: any) => `${i.item?.name} (x${i.quantity})`).join(', ') || 'No items',
      `Rs. ${t.total?.toFixed(2) || '0.00'}`
    ]);
    addTable("Transactions", ["Customer", "Items", "Total"], transactionData);
  
    doc.save('MOS_BURGERS_DailyOrderReport.pdf');
  }
}
