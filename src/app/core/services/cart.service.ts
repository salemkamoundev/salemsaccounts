import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // 1. Déclaration du Signal principal contenant l'état local du panier
  // On l'initialise avec les données du localStorage (s'il y en a)
  private cartItems = signal<CartItem[]>(this.loadFromStorage());

  // 2. Création de Signals calculés (Computed)
  // Ils se mettent à jour automatiquement si cartItems change
  readonly items = this.cartItems.asReadonly();
  
  readonly totalUSDT = computed(() => {
    return this.cartItems().reduce((total, item) => total + (item.product.priceUSDT * item.quantity), 0);
  });
  
  readonly itemCount = computed(() => {
    return this.cartItems().reduce((count, item) => count + item.quantity, 0);
  });

  constructor() {
    // 3. Effet de bord : À chaque fois que le signal cartItems change,
    // on sauvegarde automatiquement le panier dans le LocalStorage
    effect(() => {
      localStorage.setItem('salemsaccounts_cart', JSON.stringify(this.cartItems()));
    });
  }

  // Ajouter un produit au panier
  addToCart(product: Product, quantity: number = 1) {
    this.cartItems.update(items => {
      // Vérifie si le produit est déjà dans le panier
      const existingItem = items.find(i => i.product.id === product.id);
      
      if (existingItem) {
        // Met à jour la quantité
        return items.map(i => 
          i.product.id === product.id 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        );
      }
      
      // Ajoute le nouveau produit
      return [...items, { product, quantity }];
    });
  }

  // Retirer un produit complet du panier
  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
  }

  // Vider le panier (suite à une commande validée)
  clearCart() {
    this.cartItems.set([]);
  }

  // Méthode utilitaire pour lire le LocalStorage au démarrage
  private loadFromStorage(): CartItem[] {
    try {
      const storedCart = localStorage.getItem('salemsaccounts_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      console.error('Erreur lors de la lecture du panier', e);
      return [];
    }
  }
}
