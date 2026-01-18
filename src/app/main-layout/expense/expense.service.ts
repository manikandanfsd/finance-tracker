import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData,
  serverTimestamp,
} from '@angular/fire/firestore';
import { map, combineLatest, Observable } from 'rxjs';
import { Category } from '../category/category.service';

export interface Expense {
  id?: string;
  type: 'in' | 'out';
  dateTime: string;
  amount: number;
  remarks: string | null;
  category: string;
  paymentMode: string;
  createdAt?: Date;
}

export interface ExpenseWithCategory extends Omit<Expense, 'category'> {
  category: Category | null;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expenseRef = collection(this.firestore, 'expenses');

  constructor(private firestore: Firestore) {}

  // ➕ ADD EXPENSE
  addExpense(data: Expense) {
    return addDoc(this.expenseRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  }

  // ✏️ UPDATE EXPENSE
  updateExpense(id: string, data: Partial<Expense>) {
    const docRef = doc(this.firestore, `expenses/${id}`);
    return updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // ❌ DELETE EXPENSE
  deleteExpense(id: string) {
    const docRef = doc(this.firestore, `expenses/${id}`);
    return deleteDoc(docRef);
  }

  // 📥 GET ALL EXPENSES
  getExpenses(): Observable<Expense[]> {
    return collectionData(this.expenseRef, {
      idField: 'id',
    }) as Observable<Expense[]>;
  }

  getExpensesWithCategory(): Observable<ExpenseWithCategory[]> {
    const categories$ = collectionData(
      collection(this.firestore, 'categories'),
      { idField: 'id' },
    );

    return combineLatest([this.getExpenses(), categories$]).pipe(
      map(([expenses, categories]: any[]) =>
        expenses.map((exp: Expense) => ({
          ...exp,
          category:
            categories.find((cat: Category) => cat.id === exp.category) || null,
        })),
      ),
    );
  }
}
