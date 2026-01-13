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
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoryRef;

  constructor(private firestore: Firestore) {
    this.categoryRef = collection(this.firestore, 'categories');
  }

  getCategories(): Observable<Category[]> {
    return collectionData(this.categoryRef, { idField: 'id' }) as Observable<
      Category[]
    >;
  }

  addCategory(name: string) {
    return addDoc(this.categoryRef, { name });
  }

  deleteCategory(id: string) {
    return deleteDoc(doc(this.firestore, `categories/${id}`));
  }
}
