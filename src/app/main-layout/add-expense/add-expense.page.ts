import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  standalone: true,
  selector: 'app-add-expense',
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense.page.html',
})
export class AddExpensePage {
  form = this.fb.group({
    amount: ['', Validators.required],
    category: ['', Validators.required],
    date: ['', Validators.required],
    note: [''],
  });

  constructor(private fb: FormBuilder, private firestore: Firestore) {}

  async saveExpense() {
    if (this.form.invalid) return;

    await addDoc(collection(this.firestore, 'expenses'), {
      ...this.form.value,
      createdAt: new Date(),
    });

    this.form.reset();
  }
}
