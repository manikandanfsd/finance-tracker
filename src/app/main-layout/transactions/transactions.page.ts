import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonContent,
  IonChip,
  IonLabel,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { Category, CategoryService } from '../category/category.service';
import {
  Expense,
  ExpenseService,
  ExpenseWithCategory,
} from '../expense/expense.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonContent,
    IonChip,
    IonLabel,
    IonSpinner,
    IonIcon,
  ],
})
export class TransactionsPage implements OnInit {
  private filterSubject = new BehaviorSubject<'all' | 'in' | 'out'>('all');
  private searchSubject = new BehaviorSubject<string>('');
  selectedFilter: 'all' | 'in' | 'out' = 'all';
  searchTerm = '';
  showSearch = false;
  isLoading = true;

  expenses$ = this.expenseService.getExpensesWithCategory();
  filteredExpenses$: Observable<ExpenseWithCategory[]>;

  constructor(private expenseService: ExpenseService) {
    // Combine expenses with filter and search to create filtered list
    this.filteredExpenses$ = combineLatest([
      this.expenses$,
      this.filterSubject,
      this.searchSubject,
    ]).pipe(
      map(([expenses, filter, search]) => {
        let filtered = expenses;

        // Apply type filter
        if (filter !== 'all') {
          filtered = filtered.filter((expense) => expense.type === filter);
        }

        // Apply search filter
        if (search.trim()) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(
            (expense) =>
              expense.category?.name.toLowerCase().includes(searchLower) ||
              expense.remarks?.toLowerCase().includes(searchLower) ||
              expense.amount.toString().includes(search) ||
              expense.paymentMode.toLowerCase().includes(searchLower),
          );
        }

        return filtered;
      }),
    );

    // Subscribe to track loading state
    this.filteredExpenses$.subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnInit() {}

  setFilter(filter: 'all' | 'in' | 'out') {
    this.selectedFilter = filter;
    this.filterSubject.next(filter);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.clearSearch();
    }
  }

  onSearchChange(event: any) {
    const value = event.detail.value || '';
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchSubject.next('');
  }
}
