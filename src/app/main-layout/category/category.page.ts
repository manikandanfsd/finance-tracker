import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from './category.service';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { trash, menu } from 'ionicons/icons';

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
  });

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    addIcons({ trash, menu });
  }

  async addCategory() {
    if (this.form.invalid) return;

    await this.categoryService.addCategory(this.form.value.name!.trim());
    this.form.reset();
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }
}
