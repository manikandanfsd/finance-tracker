import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonDatetimeButton,
  IonButton,
  IonIcon,
  IonSpinner,
  IonModal,
  IonDatetime,
  ToastController,
} from '@ionic/angular/standalone';
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
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonDatetimeButton,
    IonButton,
    IonIcon,
    IonSpinner,
    IonModal,
    IonDatetime,
  ],
})
export class ReportsPage implements OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @ViewChild('monthlyChart') monthlyChart!: ElementRef;
  @ViewChild('trendChart') trendChart!: ElementRef;

  private monthlyChartRef?: Chart;
  private chart?: Chart;
  private trendChartRef?: Chart;
  private destroy$ = new Subject<void>();
  private chartTimeout?: any;

  selectedDate: string = new Date().toISOString();
  maxDate: string = new Date().toISOString();

  showReport: boolean = false;
  hasData: boolean = false;
  isLoading: boolean = false;

  // Summary metrics
  totalIncome: number = 0;
  totalExpense: number = 0;
  netBalance: number = 0;
  savingsRate: number = 0;

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
          // Process data for all charts
          const { categoryMap, monthlyIncomeData, monthlyExpenseData } =
            this.processExpenses(expenses, selectedMonth, selectedYear);

          this.hasData =
            Object.keys(categoryMap).length > 0 ||
            this.totalIncome > 0 ||
            this.totalExpense > 0;
          this.isLoading = false;
          this.showReport = true;

          if (this.hasData) {
            this.renderAllCharts(
              categoryMap,
              monthlyIncomeData,
              monthlyExpenseData,
            );
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
    const monthlyIncomeData = Array(12).fill(0);
    const monthlyExpenseData = Array(12).fill(0);
    let monthIncome = 0;
    let monthExpense = 0;

    expenses.forEach((expense: any) => {
      const expenseDate = new Date(expense.dateTime);
      const amount = +expense.amount || 0;
      const isIncome = expense.type === 'in';

      // Monthly data for the selected year
      if (expenseDate.getFullYear() === selectedYear) {
        if (isIncome) {
          monthlyIncomeData[expenseDate.getMonth()] += amount;
        } else {
          monthlyExpenseData[expenseDate.getMonth()] += amount;
        }
      }

      // Data for selected month
      if (
        expenseDate.getMonth() === selectedMonth &&
        expenseDate.getFullYear() === selectedYear
      ) {
        if (isIncome) {
          monthIncome += amount;
        } else {
          monthExpense += amount;
          const categoryName = expense.category?.name || 'Other';
          categoryMap[categoryName] = (categoryMap[categoryName] || 0) + amount;
        }
      }
    });

    // Calculate summary metrics
    this.totalIncome = monthIncome;
    this.totalExpense = monthExpense;
    this.netBalance = monthIncome - monthExpense;
    this.savingsRate =
      monthIncome > 0 ? (this.netBalance / monthIncome) * 100 : 0;

    return { categoryMap, monthlyIncomeData, monthlyExpenseData };
  }

  private renderAllCharts(
    categoryMap: CategoryData,
    monthlyIncomeData: number[],
    monthlyExpenseData: number[],
  ) {
    // Clear any pending timeout
    if (this.chartTimeout) {
      clearTimeout(this.chartTimeout);
    }

    this.chartTimeout = setTimeout(() => {
      this.renderDistributionChart(
        Object.keys(categoryMap),
        Object.values(categoryMap),
      );
      this.renderMonthlyChart(monthlyIncomeData, monthlyExpenseData);
      this.renderTrendChart(monthlyIncomeData, monthlyExpenseData);
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
    if (this.trendChartRef) {
      this.trendChartRef.destroy();
      this.trendChartRef = undefined;
    }
  }

  private renderMonthlyChart(incomeData: number[], expenseData: number[]) {
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
            label: 'Income',
            data: incomeData,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'Expense',
            data: expenseData,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y ?? 0;
                return `${context.dataset.label}: $${value.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + value,
            },
          },
        },
      },
    });
  }

  private renderTrendChart(incomeData: number[], expenseData: number[]) {
    if (!this.trendChart?.nativeElement) return;

    if (this.trendChartRef) {
      this.trendChartRef.destroy();
    }

    this.trendChartRef = new Chart(this.trendChart.nativeElement, {
      type: 'line',
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
            label: 'Income',
            data: incomeData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Expense',
            data: expenseData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y ?? 0;
                return `${context.dataset.label}: $${value.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + value,
            },
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
            labels: {
              padding: 10,
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
              },
            },
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
