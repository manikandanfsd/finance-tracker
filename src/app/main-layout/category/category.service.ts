import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Category {
  id?: string;
  name: string;
  budgetAmount: number;
  createdAt: any;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoryRef = collection(this.firestore, 'categories');

  constructor(private firestore: Firestore) {}

  getCategories(): Observable<Category[]> {
    return collectionData(this.categoryRef, { idField: 'id' }) as Observable<
      Category[]
    >;
  }

  addCategory(data: { name: string; budgetAmount: number; createdAt: any }) {
    return addDoc(this.categoryRef, data);
  }

  deleteCategory(id: string) {
    return deleteDoc(doc(this.firestore, `categories/${id}`));
  }
}
