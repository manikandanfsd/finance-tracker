import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TransactionsPage implements OnInit {
  private filterSubject = new BehaviorSubject<'all' | 'in' | 'out'>('all');
  selectedFilter: 'all' | 'in' | 'out' = 'all';

  expenses$ = this.expenseService.getExpensesWithCategory();
  filteredExpenses$: Observable<ExpenseWithCategory[]>;

  constructor(private expenseService: ExpenseService) {
    // Combine expenses with filter to create filtered list
    this.filteredExpenses$ = combineLatest([
      this.expenses$,
      this.filterSubject,
    ]).pipe(
      map(([expenses, filter]) => {
        if (filter === 'all') {
          return expenses;
        }
        return expenses.filter((expense) => expense.type === filter);
      }),
    );
  }

  ngOnInit() {}

  setFilter(filter: 'all' | 'in' | 'out') {
    this.selectedFilter = filter;
    this.filterSubject.next(filter);
  }
}
