import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ExpenseService } from '../expense/expense.service';
import { Subject, takeUntil } from 'rxjs';

interface CategoryData {
  [key: string]: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ReportsPage implements OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @ViewChild('monthlyChart') monthlyChart!: ElementRef;

  private monthlyChartRef?: Chart;
  private chart?: Chart;
  private destroy$ = new Subject<void>();
  private chartTimeout?: any;

  selectedDate: string = new Date().toISOString();
  maxDate: string = new Date().toISOString();

  showReport: boolean = false;
  hasData: boolean = false;
  isLoading: boolean = false;

  constructor(
    private expenseService: ExpenseService,
    private toastController: ToastController,
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyCharts();
    if (this.chartTimeout) {
      clearTimeout(this.chartTimeout);
    }
  }

  loadReport() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showReport = false;

    const selectedDateObj = new Date(this.selectedDate);
    const selectedMonth = selectedDateObj.getMonth();
    const selectedYear = selectedDateObj.getFullYear();

    // Single API call for both charts
    this.expenseService
      .getExpensesWithCategory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (expenses) => {
          // Process data for both charts
          const { categoryMap, monthlyData } = this.processExpenses(
            expenses,
            selectedMonth,
            selectedYear,
          );

          this.hasData = Object.keys(categoryMap).length > 0;
          this.isLoading = false;
          this.showReport = true;

          if (this.hasData) {
            this.renderBothCharts(categoryMap, monthlyData);
          }
        },
        error: (error) => {
          console.error('Error loading report:', error);
          this.isLoading = false;
          this.showErrorToast('Failed to load report data');
        },
      });
  }

  private processExpenses(
    expenses: any[],
    selectedMonth: number,
    selectedYear: number,
  ) {
    const categoryMap: CategoryData = {};
    const monthlyData = Array(12).fill(0);

    expenses.forEach((expense: any) => {
      const expenseDate = new Date(expense.dateTime);
      const amount = +expense.amount || 0;

      // Monthly data for the selected year
      if (expenseDate.getFullYear() === selectedYear) {
        monthlyData[expenseDate.getMonth()] += amount;
      }

      // Category data for selected month
      if (
        expenseDate.getMonth() === selectedMonth &&
        expenseDate.getFullYear() === selectedYear
      ) {
        const categoryName = expense.category?.name || 'Other';
        categoryMap[categoryName] = (categoryMap[categoryName] || 0) + amount;
      }
    });

    return { categoryMap, monthlyData };
  }

  private renderBothCharts(categoryMap: CategoryData, monthlyData: number[]) {
    // Clear any pending timeout
    if (this.chartTimeout) {
      clearTimeout(this.chartTimeout);
    }

    this.chartTimeout = setTimeout(() => {
      this.renderDistributionChart(
        Object.keys(categoryMap),
        Object.values(categoryMap),
      );
      this.renderMonthlyChart(monthlyData);
      this.chartTimeout = undefined;
    }, 0);
  }

  private destroyCharts() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    if (this.monthlyChartRef) {
      this.monthlyChartRef.destroy();
      this.monthlyChartRef = undefined;
    }
  }

  private renderMonthlyChart(data: number[]) {
    if (!this.monthlyChart?.nativeElement) return;

    if (this.monthlyChartRef) {
      this.monthlyChartRef.destroy();
    }

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
            label: 'Monthly Expenses',
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  private renderDistributionChart(labels: string[], data: number[]) {
    if (!this.chartCanvas?.nativeElement) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: this.generateColors(data.length),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  private generateColors(count: number): string[] {
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#C9CBCF',
      '#4BC0C0',
      '#FF6384',
    ];
    return colors.slice(0, count);
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }
}
