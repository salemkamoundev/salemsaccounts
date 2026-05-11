import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'products');

  // Récupérer tous les produits
  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  // Récupérer les produits d'une catégorie spécifique
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const q = query(this.productsCollection, where('category', '==', categoryId));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  // Récupérer un produit par ID
  getProduct(id: string): Observable<Product> {
    const productDoc = doc(this.firestore, \`products/\${id}\`);
    return docData(productDoc, { idField: 'id' }) as Observable<Product>;
  }

  // Ajouter un produit
  addProduct(product: Product) {
    return addDoc(this.productsCollection, product);
  }

  // Mettre à jour un produit
  updateProduct(id: string, data: Partial<Product>) {
    const productDoc = doc(this.firestore, \`products/\${id}\`);
    return updateDoc(productDoc, data);
  }

  // Supprimer un produit
  deleteProduct(id: string) {
    const productDoc = doc(this.firestore, \`products/\${id}\`);
    return deleteDoc(productDoc);
  }
}
