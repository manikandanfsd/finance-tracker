import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Category, CategoryService } from '../category/category.service';
import { Expense, ExpenseService } from '../expense/expense.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TransactionsPage implements OnInit {
  expenses$ = this.expenseService.getExpenses();

  expenseList: Expense[] = [];
  categoryObj: Record<string, string> = {};

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.expenseService.getExpenses().subscribe((data) => {
      this.expenseList = data;
    });

    this.categoryService.getCategories().subscribe((data: Category[]) => {
      data.forEach((cat) => {
        const key = cat.id || cat.name;
        this.categoryObj[key] = cat.name;
      });
    });
  }
}
function getExpenses(): any {
  throw new Error('Function not implemented.');
}

function getCategories(): any {
  throw new Error('Function not implemented.');
}
