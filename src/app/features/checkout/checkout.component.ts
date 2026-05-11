import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Cas où le panier est vide -->
        <div *ngIf="cartService.itemCount() === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Votre commande est vide</h2>
          <p class="text-gray-500 mb-6">Vous n'avez pas encore sélectionné d'abonnement.</p>
          <a routerLink="/catalog" class="inline-flex px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Parcourir le catalogue
          </a>
        </div>

        <!-- Checkout Form & Summary -->
        <div *ngIf="cartService.itemCount() > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
          
          <!-- Colonne Gauche : Formulaire des détails -->
          <div class="lg:col-span-7">
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Détails de l'abonnement</h2>
              <p class="text-sm text-gray-500 mb-8">Ces informations sont nécessaires pour configurer et livrer votre abonnement électronique.</p>

              <form (ngSubmit)="proceedToPayment()" class="space-y-6">
                <!-- Email de livraison -->
                <div>
                  <label for="deliveryEmail" class="block text-sm font-medium text-gray-700">Email de réception du code / lien</label>
                  <div class="mt-1">
                    <input type="email" id="deliveryEmail" name="deliveryEmail" required [(ngModel)]="checkoutData.deliveryEmail"
                           class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-3 px-4 border bg-gray-50" 
                           placeholder="exemple@domaine.com">
                  </div>
                </div>

                <!-- Type d'appareil -->
                <div>
                  <label for="deviceType" class="block text-sm font-medium text-gray-700">Sur quel appareil allez-vous l'utiliser ?</label>
                  <div class="mt-1">
                    <select id="deviceType" name="deviceType" required [(ngModel)]="checkoutData.deviceType"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-3 px-4 border bg-gray-50">
                      <option value="" disabled selected>Sélectionnez un appareil...</option>
                      <option value="Smart TV (Samsung/LG)">Smart TV (Samsung / LG)</option>
                      <option value="Android TV / Box">Android TV / Box Android</option>
                      <option value="Boitier MAG">Boîtier MAG</option>
                      <option value="Smartphone / Tablette">Smartphone / Tablette</option>
                      <option value="PC / Mac">PC / Mac</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <!-- Adresse MAC (Optionnel) -->
                <div *ngIf="checkoutData.deviceType === 'Smart TV (Samsung/LG)' || checkoutData.deviceType === 'Boitier MAG'">
                  <label for="macAddress" class="block text-sm font-medium text-gray-700">Adresse MAC (Si requise par votre application)</label>
                  <div class="mt-1">
                    <input type="text" id="macAddress" name="macAddress" [(ngModel)]="checkoutData.macAddress"
                           class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-3 px-4 border bg-gray-50 uppercase" 
                           placeholder="00:1A:79:XX:XX:XX">
                  </div>
                  <p class="mt-2 text-xs text-gray-500">Obligatoire pour les applications comme Smart IPTV ou les boîtiers MAG.</p>
                </div>

                <!-- Notes supplémentaires -->
                <div>
                  <label for="notes" class="block text-sm font-medium text-gray-700">Remarque (Optionnel)</label>
                  <div class="mt-1">
                    <textarea id="notes" name="notes" rows="3" [(ngModel)]="checkoutData.notes"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-3 px-4 border bg-gray-50"
                              placeholder="Application préférée, demande spécifique..."></textarea>
                  </div>
                </div>

                <div class="pt-6">
                  <button type="submit" [disabled]="!checkoutData.deliveryEmail || !checkoutData.deviceType"
                          class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                    Continuer vers le paiement (USDT)
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Colonne Droite : Résumé de la commande -->
          <div class="lg:col-span-5">
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
              <h3 class="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h3>
              
              <ul role="list" class="divide-y divide-gray-200 mb-6">
                <li *ngFor="let item of cartService.items()" class="flex py-4">
                  <div class="flex-1 flex flex-col">
                    <div>
                      <div class="flex justify-between text-base font-medium text-gray-900">
                        <h4 class="line-clamp-2">{{ item.product.title }}</h4>
                        <p class="ml-4 whitespace-nowrap">{{ item.product.priceUSDT }} USDT</p>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">{{ item.product.category }}</p>
                    </div>
                    <div class="flex-1 flex items-end justify-between text-sm">
                      <p class="text-gray-500">Qté {{ item.quantity }}</p>
                      <button type="button" (click)="cartService.removeFromCart(item.product.id!)" class="font-medium text-red-600 hover:text-red-500">
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

              <div class="border-t border-gray-200 pt-6">
                <div class="flex justify-between text-lg font-bold text-gray-900 mb-2">
                  <p>Total à payer</p>
                  <p class="text-green-600">{{ cartService.totalUSDT() }} USDT</p>
                </div>
                <p class="text-sm text-gray-500 mb-6">Le paiement se fera manuellement via Binance Pay (TRC20 ou BEP20) à l'étape suivante.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  // Modèle pour le formulaire
  checkoutData = {
    deliveryEmail: '',
    deviceType: '',
    macAddress: '',
    notes: ''
  };

  proceedToPayment() {
    // On passe les informations saisies via le state du routeur pour l'étape de paiement
    this.router.navigate(['/payment'], { state: { checkoutData: this.checkoutData } });
  }
}
