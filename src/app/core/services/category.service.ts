import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private firestore = inject(Firestore);
  private categoriesCollection = collection(this.firestore, 'categories');

  // Récupérer toutes les catégories
  getCategories(): Observable<Category[]> {
    return collectionData(this.categoriesCollection, { idField: 'id' }) as Observable<Category[]>;
  }

  // Récupérer une catégorie par ID
  getCategory(id: string): Observable<Category> {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return docData(categoryDoc, { idField: 'id' }) as Observable<Category>;
  }

  // Ajouter une catégorie
  addCategory(category: Category) {
    return addDoc(this.categoriesCollection, category);
  }

  // Mettre à jour une catégorie
  updateCategory(id: string, data: Partial<Category>) {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return updateDoc(categoryDoc, data);
  }

  // Supprimer une catégorie
  deleteCategory(id: string) {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    return deleteDoc(categoryDoc);
  }
}
