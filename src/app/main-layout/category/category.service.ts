import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth';

export interface Category {
  id?: string;
  name: string;
  budgetAmount: number;
  userId: string;
  createdAt: any;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoryRef = collection(this.firestore, 'categories');
  private userId = this.authService.getUserInfo()?.uid || '';

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
  ) {}

  getCategories(): Observable<Category[]> {
    const categoryQuery = query(
      this.categoryRef,
      where('userId', '==', this.userId),
    );
    return collectionData(categoryQuery, { idField: 'id' }) as Observable<
      Category[]
    >;
  }

  addCategory(data: { name: string; budgetAmount: number; createdAt: any }) {
    return addDoc(this.categoryRef, {
      ...data,
      userId: this.userId,
    });
  }

  deleteCategory(id: string) {
    return deleteDoc(doc(this.firestore, `categories/${id}`));
  }
}
