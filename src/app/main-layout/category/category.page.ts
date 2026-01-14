import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from './category.service';
import { RouterModule } from '@angular/router';

import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage {
  categories$ = this.categoryService.getCategories();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    budgetAmount: [],
  });

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  async saveCategory() {
    if (this.form.invalid) return;

    const data = {
      name: this.form.value.name ?? '',
      budgetAmount: Number(this.form.value.budgetAmount),
      createdAt: serverTimestamp(),
    };

    await this.categoryService.addCategory(data);
    this.form.reset();
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }

  editCategory(id: string) {
    // Navigate to edit page or open a modal for editing
  }
}
