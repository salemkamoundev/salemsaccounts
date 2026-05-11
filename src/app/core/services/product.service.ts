import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // ✅ CORRECTION : Injection au niveau de la classe
  private firestore = inject(Firestore);

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(productsRef, where('category', '==', categoryId));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getProduct(id: string): Observable<Product> {
    const productDoc = doc(this.firestore, `products/${id}`);
    return docData(productDoc, { idField: 'id' }) as Observable<Product>;
  }

  addProduct(product: Product): Promise<any> {
    const productsRef = collection(this.firestore, 'products');
    return addDoc(productsRef, product);
  }

  updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const productDoc = doc(this.firestore, `products/${id}`);
    return updateDoc(productDoc, data);
  }

  deleteProduct(id: string): Promise<void> {
    const productDoc = doc(this.firestore, `products/${id}`);
    return deleteDoc(productDoc);
  }
}
