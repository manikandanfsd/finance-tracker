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

  selectedDate: string = new Date().toISOString();
  maxDate: string = new Date().toISOString();

  constructor(private expenseService: ExpenseService) {}

  ngAfterViewInit() {
    this.loadReport();
    this.loadMonthlyChart(new Date(this.selectedDate).getFullYear());
  }

  loadReport() {
    const selectedDateObj = new Date(this.selectedDate);
    const selectedMonth = selectedDateObj.getMonth();
    const selectedYear = selectedDateObj.getFullYear();

    this.expenseService.getExpensesWithCategory().subscribe((expenses) => {
      const filtered = expenses.filter((e: any) => {
        const d = new Date(e.dateTime);
        return (
          d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
        );
      });

      const categoryMap: any = {};
      filtered.forEach((e: any) => {
        const name = e.category?.name || 'Other';
        categoryMap[name] = (categoryMap[name] || 0) + (+e.amount || 0);
      });

      this.renderChart(Object.keys(categoryMap), Object.values(categoryMap));
    });

    // Update monthly chart for the selected year
    this.loadMonthlyChart(selectedYear);
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
