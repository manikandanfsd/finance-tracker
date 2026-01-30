import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {
  Expense,
  ExpenseService,
  ExpenseWithCategory,
} from '../expense/expense.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  expenses$!: Observable<ExpenseWithCategory[]>;
  recentTransactions$!: Observable<ExpenseWithCategory[]>;

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  userName = 'User';

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    // Load user name from localStorage
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      this.userName = userInfo.name || 'User';
    }

    this.expenses$ = this.expenseService.getExpensesWithCategory();

    // Calculate totals
    this.expenses$.subscribe((expenses) => {
      this.totalIncome = expenses
        .filter((e) => e.type === 'in')
        .reduce((sum, e) => sum + (+e.amount || 0), 0);

      this.totalExpense = expenses
        .filter((e) => e.type === 'out')
        .reduce((sum, e) => sum + (+e.amount || 0), 0);
      this.balance = this.totalIncome - this.totalExpense;
    });

    // Recent 5 transactions
    this.recentTransactions$ = this.expenses$.pipe(
      map((expenses) =>
        [...expenses]
          .sort(
            (a, b) =>
              new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
          )
          .slice(0, 5),
      ),
    );
  }
}
