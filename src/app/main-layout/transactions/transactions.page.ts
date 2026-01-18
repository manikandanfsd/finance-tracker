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
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TransactionsPage implements OnInit {
  expenses$ = this.expenseService.getExpensesWithCategory();

  expenseList: ExpenseWithCategory[] = [];
  categoryObj: Record<string, string> = {};

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {}
}
