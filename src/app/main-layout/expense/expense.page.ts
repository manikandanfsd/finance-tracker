import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryService } from '../category/category.service';
import { ExpenseService } from './expense.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class ExpensePage implements OnInit {
  categories: Category[] = [];
  openDateTime = false;
  displayDateTime = '';
  isLoading = true;
  isSaving = false;

  form = this.fb.group({
    type: ['in', Validators.required],
    dateTime: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]],
    remarks: [null],
    category: [null, Validators.required],
    paymentMode: ['Cash', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Check for query params or route params for type
    this.activatedRoute.queryParams.subscribe((params) => {
      const type = params['type'];
      if (type === 'in' || type === 'out') {
        this.form.patchValue({ type });
      }
    });

    const now = new Date().toISOString();
    this.form.patchValue({ dateTime: now });
    this.displayDateTime = new Date(now).toLocaleString();
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      this.isLoading = false;
    });
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.showToast('Please fill all required fields', 'warning');
      return;
    }

    this.isSaving = true;
    try {
      await this.expenseService.addExpense(this.form.value as any);

      await this.showToast(
        `${this.form.value.type === 'in' ? 'Income' : 'Expense'} saved successfully!`,
        'success',
      );

      this.form.reset();
      this.form.patchValue({
        type: 'in',
        paymentMode: 'Cash',
        dateTime: new Date().toISOString(),
      });
      this.displayDateTime = new Date().toLocaleString();

      // Navigate back to home
      this.router.navigate(['/main/tabs/home']);
    } catch (error) {
      console.error('Error saving expense:', error);
      await this.showToast('Failed to save. Please try again.', 'danger');
    } finally {
      this.isSaving = false;
    }
  }

  async saveAndAddMore() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.showToast('Please fill all required fields', 'warning');
      return;
    }

    this.isSaving = true;
    try {
      const currentType = this.form.value.type;
      await this.expenseService.addExpense(this.form.value as any);

      await this.showToast(
        `${currentType === 'in' ? 'Income' : 'Expense'} saved! Add another entry.`,
        'success',
      );

      // Reset form but keep the type
      this.form.reset();
      this.form.patchValue({
        type: currentType,
        paymentMode: 'Cash',
        dateTime: new Date().toISOString(),
      });
      this.displayDateTime = new Date().toLocaleString();
    } catch (error) {
      console.error('Error saving expense:', error);
      await this.showToast('Failed to save. Please try again.', 'danger');
    } finally {
      this.isSaving = false;
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
