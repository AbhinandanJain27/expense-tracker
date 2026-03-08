import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExpenseService, Expense } from './expense.service';
import { startOfMonth, endOfMonth, format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class PdfReportService {
  constructor(private expenseService: ExpenseService) {}

  generateMonthlyReport(): void {
    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);
    const monthYear = format(today, 'MMMM yyyy');

    const expenses = this.expenseService
      .getExpensesByDateRange(startDate, endDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // ============================================
    // HEADER
    // ============================================
    pdf.setFontSize(24);
    pdf.setTextColor(75, 104, 255); // Primary color
    pdf.text('Expense Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    pdf.setFontSize(13);
    pdf.setTextColor(120, 120, 120);
    pdf.text(monthYear, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;

    // Decorative line
    pdf.setDrawColor(75, 104, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // ============================================
    // SUMMARY SECTION
    // ============================================
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // ✅ FIX: Use 'helvetica' instead of undefined
    pdf.setTextColor(0, 0, 0);
    pdf.text('Summary', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal'); // ✅ FIX: Use 'helvetica' instead of undefined

    const summaryData = [
      ['Total Expenses', `₹${totalExpense.toFixed(2)}`],
      ['Number of Entries', `${expenses.length}`],
      ['Average per Entry', `₹${averageExpense.toFixed(2)}`],
      ['Period', monthYear]
    ];

    let summaryX = margin;
    summaryData.forEach(([label, value], index) => {
      if (index === 2) {
        summaryX = pageWidth / 2 + 5;
        yPosition -= 30;
      }

      pdf.setTextColor(120, 120, 120);
      pdf.text(label + ':', summaryX, yPosition);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold'); // ✅ FIX
      pdf.text(value, summaryX + 45, yPosition);
      pdf.setFont('helvetica', 'normal'); // ✅ FIX
      yPosition += 8;
    });

    yPosition += 8;

    // ============================================
    // CATEGORY BREAKDOWN
    // ============================================
    const categoryTotals = this.expenseService.getTotalByCategory(expenses);
    const categories = Object.entries(categoryTotals);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // ✅ FIX
    pdf.setTextColor(0, 0, 0);
    pdf.text('Category Breakdown', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal'); // ✅ FIX
    pdf.setTextColor(80, 80, 80);

    categories.forEach(([category, amount]) => {
      const percentage = ((amount / totalExpense) * 100).toFixed(1);
      pdf.text(`• ${category}: ₹${amount.toFixed(2)} (${percentage}%)`, margin + 5, yPosition);
      yPosition += 6;
    });

    yPosition += 6;

    // ============================================
    // EXPENSES TABLE
    // ============================================
    const tableData = expenses.map(e => [
      format(e.date, 'dd/MM/yyyy'),
      e.category,
      e.description ? e.description.substring(0, 30) : '—',
      `₹${e.amount.toFixed(2)}`
    ]);

    // Check if we need a new page for the table
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // ✅ FIX
    pdf.setTextColor(0, 0, 0);
    pdf.text('Detailed Transactions', margin, yPosition);
    yPosition += 6;

    autoTable(pdf, {
      head: [['Date', 'Category', 'Description', 'Amount']],
      body: tableData,
      startY: yPosition,
      margin: margin,
      theme: 'grid',
      headStyles: {
        fillColor: [75, 104, 255],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'left',
        cellPadding: 4
      },
      bodyStyles: {
        textColor: [40, 40, 40],
        fontSize: 9,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 247, 252]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 25 },
        1: { halign: 'center', cellWidth: 30 },
        2: { halign: 'left', cellWidth: 60 },
        3: { halign: 'right', cellWidth: 25 }
      },
      didDrawPage: (data: any) => {
        // Custom footer
        const pageCount = pdf.internal.pages.length - 1;
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);

          // Page number
          pdf.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: 'center' }
          );

          // Generated date
          pdf.text(
            `Generated: ${format(new Date(), 'dd MMM yyyy HH:mm')}`,
            margin,
            pageHeight - 8
          );
        }
      }
    });

    // ============================================
    // FOOTER WITH TOTALS
    // ============================================
    const finalY = (pdf as any).lastAutoTable.finalY + 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // ✅ FIX
    pdf.setTextColor(75, 104, 255);

    // Total line
    pdf.setDrawColor(75, 104, 255);
    pdf.setLineWidth(1);
    pdf.line(pageWidth - margin - 60, finalY - 2, pageWidth - margin, finalY - 2);

    pdf.text(
      `Total: ₹${totalExpense.toFixed(2)}`,
      pageWidth - margin,
      finalY + 5,
      { align: 'right' }
    );

    // Save PDF
    const filename = `Expense_Report_${monthYear.replace(/ /g, '_')}.pdf`;
    pdf.save(filename);
  }
}