import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryService } from '../category/category.service';
import { ExpenseService } from './expense.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class ExpensePage implements OnInit {
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService
  ) {}
  categories: Category[] = [];
  openDateTime = false;
  displayDateTime = '';

  form = this.fb.group({
    type: ['in', Validators.required],
    dateTime: ['', Validators.required],
    amount: ['', Validators.required],
    remarks: [null],
    category: [null, Validators.required],
    paymentMode: ['Cash', Validators.required],
  });

  ngOnInit() {
    const now = new Date().toISOString();
    this.form.patchValue({ dateTime: now });
    this.displayDateTime = new Date(now).toLocaleString();
    this.categoryService
      .getCategories()
      .subscribe((data) => (this.categories = data));
  }

  onDateTimeChange(event: any) {
    const isoValue = event.detail.value;
    this.form.patchValue({ dateTime: isoValue });
    this.displayDateTime = new Date(isoValue).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  openDateTimePicker() {
    const now = new Date().toISOString();
    this.form.patchValue({ dateTime: now });
    this.openDateTime = true;
  }

  closeDateTimePicker() {
    this.openDateTime = false;
  }

  async saveExpense() {
    if (this.form.invalid) return;

    await this.expenseService.addExpense(this.form.value as any);

    this.form.reset();
  }
}
