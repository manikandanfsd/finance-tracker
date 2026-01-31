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
  query,
  where,
} from '@angular/fire/firestore';
import { map, combineLatest, Observable } from 'rxjs';
import { Category, CategoryService } from '../category/category.service';
import { AuthService } from 'src/app/auth/service/auth';

export interface Expense {
  id?: string;
  type: 'in' | 'out';
  dateTime: string;
  amount: number;
  remarks: string | null;
  category: string;
  paymentMode: string;
  userId: string;
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

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private categoryService: CategoryService,
  ) {}

  // Get current user ID dynamically
  private getUserId(): string {
    return this.authService.getUserInfo()?.uid || '';
  }

  // ➕ ADD EXPENSE
  addExpense(data: Expense) {
    return addDoc(this.expenseRef, {
      ...data,
      userId: this.getUserId(),
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
  getExpenses(startDate?: string, endDate?: string): Observable<Expense[]> {
    const constraints = [where('userId', '==', this.getUserId())];

    if (startDate) {
      constraints.push(where('dateTime', '>=', startDate));
    }
    if (endDate) {
      constraints.push(where('dateTime', '<=', endDate));
    }

    const expenseQuery = query(this.expenseRef, ...constraints);

    return collectionData(expenseQuery, {
      idField: 'id',
    }) as Observable<Expense[]>;
  }

  getExpensesWithCategory(
    startDate?: string,
    endDate?: string,
  ): Observable<ExpenseWithCategory[]> {
    const categories$ = this.categoryService.getCategories();
    return combineLatest([
      this.getExpenses(startDate, endDate),
      categories$,
    ]).pipe(
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
