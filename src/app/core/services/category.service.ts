import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // ✅ CORRECTION : L'injection est faite au niveau de la classe, pas dans la méthode
  private firestore = inject(Firestore);

  getCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    return collectionData(categoriesRef, { idField: 'id' }) as Observable<Category[]>;
  }

  getCategory(id: string): Observable<Category> {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return docData(categoryDoc, { idField: 'id' }) as Observable<Category>;
  }

  addCategory(category: Category): Promise<any> {
    const categoriesRef = collection(this.firestore, 'categories');
    return addDoc(categoriesRef, category);
  }

  updateCategory(id: string, data: Partial<Category>): Promise<void> {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return updateDoc(categoryDoc, data);
  }

  deleteCategory(id: string): Promise<void> {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return deleteDoc(categoryDoc);
  }
}
