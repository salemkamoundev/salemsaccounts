import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Validation de la commande</h1>

        <div *ngIf="cartService.itemCount() === 0" class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 class="text-xl font-medium text-gray-900 mb-2">Votre panier est vide</h2>
          <p class="text-gray-500 mb-6">Ajoutez des abonnements pour continuer.</p>
          <button (click)="router.navigate(['/'])" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Parcourir le catalogue
          </button>
        </div>

        <div *ngIf="cartService.itemCount() > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div class="lg:col-span-7">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-900">Articles sélectionnés</h2>
                <button (click)="cartService.clearCart()" class="text-sm text-red-500 hover:text-red-700">Vider le panier</button>
              </div>
              <ul class="divide-y divide-gray-100">
                <li *ngFor="let item of cartService.items()" class="p-6 flex flex-col sm:flex-row sm:items-center">
                  <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 sm:mb-0">
                    <img *ngIf="item.imageUrl" [src]="item.imageUrl" class="w-full h-full object-cover">
                    <div *ngIf="!item.imageUrl" class="w-full h-full flex items-center justify-center text-gray-400">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  </div>
                  <div class="sm:ml-4 flex-1">
                    <h3 class="text-lg font-bold text-gray-900">{{ item.name }}</h3>
                    <p class="text-sm text-gray-500 line-clamp-1">{{ item.description }}</p>
                  </div>
                  <div class="sm:ml-4 flex flex-row sm:flex-col justify-between items-center sm:items-end mt-4 sm:mt-0 w-full sm:w-auto">
                    <span class="text-lg font-extrabold text-blue-600 mb-0 sm:mb-2">{{ item.priceUSDT * item.quantity }} USDT</span>
                    <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button (click)="updateQuantity(item.id!, item.quantity - 1)" class="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium">-</button>
                      <span class="px-3 py-1 text-sm font-bold border-x border-gray-200 min-w-[2.5rem] text-center">{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item.id!, item.quantity + 1)" class="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium">+</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 class="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Détails de réception</h2>
              
              <form (ngSubmit)="proceedToPayment()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email de réception <span class="text-red-500">*</span></label>
                  <input type="email" [(ngModel)]="checkoutData.email" name="email" required
                         class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                         placeholder="Pour recevoir vos accès">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Appareil cible</label>
                  <select [(ngModel)]="checkoutData.device" name="device"
                          class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                    <option value="smart_tv">Smart TV (Samsung/LG)</option>
                    <option value="android_box">Box Android / Firestick</option>
                    <option value="smartphone">Smartphone / Tablette</option>
                    <option value="pc">PC / Mac</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Application souhaitée (Optionnel)</label>
                  <input type="text" [(ngModel)]="checkoutData.appPreference" name="app" placeholder="Ex: IPTV Smarters, Flix IPTV..."
                         class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                </div>

                <div class="pt-6 mt-6 border-t border-gray-100">
                  <div class="flex justify-between items-center mb-6">
                    <span class="text-lg font-medium text-gray-700">Total à payer</span>
                    <span class="text-3xl font-black text-green-500">{{ cartService.totalUSDT() }} USDT</span>
                  </div>

                  <button type="submit" [disabled]="!checkoutData.email"
                          class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 flex justify-center items-center">
                    Procéder au paiement (Binance)
                    <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  cartService = inject(CartService);
  router = inject(Router);
  private authService = inject(AuthService);

  checkoutData = {
    email: '',
    device: 'smart_tv',
    appPreference: ''
  };

  constructor() {
    this.authService.user$.subscribe(user => {
      if (user && user.email) {
        this.checkoutData.email = user.email;
      }
    });
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  proceedToPayment() {
    if (!this.checkoutData.email) return;
    
    // Transmission des infos à la page de paiement
    this.router.navigate(['/checkout/payment'], {
      state: { checkoutData: this.checkoutData }
    });
  }
}
