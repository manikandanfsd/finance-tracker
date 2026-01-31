import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  AlertController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from './category.service';
import { RouterModule } from '@angular/router';

import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage {
  categories$ = this.categoryService.getCategories();
  isLoading = true;
  isSaving = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    budgetAmount: [],
  });

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private alertController: AlertController,
  ) {
    // Track loading state
    this.categories$.subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;
      },
    });
  }

  async saveCategory() {
    if (this.form.invalid) return;

    this.isSaving = true;
    try {
      const data = {
        name: this.form.value.name ?? '',
        budgetAmount: Number(this.form.value.budgetAmount),
        createdAt: serverTimestamp(),
      };

      await this.categoryService.addCategory(data);
      this.form.reset();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      this.isSaving = false;
    }
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }

  async confirmDelete(id: string, name: string) {
    const alert = await this.alertController.create({
      header: 'Delete Category',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteCategory(id);
          },
        },
      ],
    });

    await alert.present();
  }

  editCategory(id: string) {
    // Navigate to edit page or open a modal for editing
  }
}
