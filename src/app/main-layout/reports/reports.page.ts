import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ExpenseService } from '../expense/expense.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ReportsPage implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @ViewChild('monthlyChart') monthlyChart!: ElementRef;
  monthlyChartRef!: Chart;
  chart!: Chart;

  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  months = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Apr', value: 3 },
    { label: 'May', value: 4 },
    { label: 'Jun', value: 5 },
    { label: 'Jul', value: 6 },
    { label: 'Aug', value: 7 },
    { label: 'Sep', value: 8 },
    { label: 'Oct', value: 9 },
    { label: 'Nov', value: 10 },
    { label: 'Dec', value: 11 },
  ];

  years = [2024, 2025, 2026];

  constructor(private expenseService: ExpenseService) {}

  ngAfterViewInit() {
    this.loadReport();
    this.loadMonthlyChart(this.selectedYear);
  }

  loadReport() {
    this.expenseService.getExpensesWithCategory().subscribe((expenses) => {
      const filtered = expenses.filter((e: any) => {
        // Use dateTime which is the user-selected date
        const d = new Date(e.dateTime);
        return (
          d.getMonth() === this.selectedMonth &&
          d.getFullYear() === this.selectedYear
        );
      });

      const categoryMap: any = {};
      filtered.forEach((e: any) => {
        const name = e.category?.name || 'Other';
        categoryMap[name] = (categoryMap[name] || 0) + (+e.amount || 0);
      });

      this.renderChart(Object.keys(categoryMap), Object.values(categoryMap));
    });
  }

  loadMonthlyChart(year: number) {
    this.expenseService.getExpensesWithCategory().subscribe((expenses) => {
      const monthlyData = Array(12).fill(0);
      expenses.forEach((e: any) => {
        const d = new Date(e.dateTime);
        if (d.getFullYear() === year) {
          monthlyData[d.getMonth()] += +e.amount || 0;
        }
      });

      this.renderMonthlyChart(monthlyData);
    });
  }

  renderMonthlyChart(data: number[]) {
    if (this.monthlyChartRef) this.monthlyChartRef.destroy();

    this.monthlyChartRef = new Chart(this.monthlyChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Expense',
            data,
          },
        ],
      },
      options: {
        indexAxis: 'x',
      },
    });
  }

  renderChart(labels: string[], data: number[]) {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
          },
        ],
      },
    });
  }
}
