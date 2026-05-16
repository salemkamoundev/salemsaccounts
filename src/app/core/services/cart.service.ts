import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal contenant les articles du panier
  private cartItems = signal<CartItem[]>([]);

  // Signaux calculés pour utilisation réactive
  readonly items = computed(() => this.cartItems());
  readonly itemCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  readonly totalUSDT = computed(() => this.cartItems().reduce((acc, item) => acc + (item.priceUSDT * item.quantity), 0));

  constructor() {
    this.loadCart();
  }

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        return items.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    this.saveCart();
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(item => item.id === productId ? { ...item, quantity } : item)
    );
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('salemsaccounts_cart');
  }

  // Sauvegarde dans le localStorage pour ne pas perdre le panier au rechargement
  private saveCart() {
    localStorage.setItem('salemsaccounts_cart', JSON.stringify(this.cartItems()));
  }

  private loadCart() {
    const saved = localStorage.getItem('salemsaccounts_cart');
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur de lecture du panier', e);
      }
    }
  }
}
