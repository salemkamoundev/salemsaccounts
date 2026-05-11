import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="md:flex md:items-center md:justify-between mb-10">
          <div class="flex-1 min-w-0">
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Mon Espace Client</h2>
            <p class="mt-2 text-lg text-gray-500">
              <ng-container *ngIf="authService.user$ | async as user">
                Connecté en tant que <span class="font-medium text-gray-900">{{ user.email }}</span>
              </ng-container>
            </p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <a routerLink="/catalog" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Nouveau catalogue
            </a>
          </div>
        </div>

        <!-- Section des Commandes -->
        <div class="bg-white shadow overflow-hidden sm:rounded-xl border border-gray-100">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg leading-6 font-bold text-gray-900">Historique de mes commandes</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Retrouvez vos achats, le statut de vos paiements Binance et vos codes d'accès.</p>
          </div>

          <div *ngIf="isLoading" class="p-12 flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <div *ngIf="!isLoading && orders.length === 0" class="text-center py-16">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
            <p class="mt-1 text-sm text-gray-500">Vous n'avez pas encore passé de commande d'abonnement.</p>
          </div>

          <!-- Liste des commandes -->
          <ul *ngIf="!isLoading && orders.length > 0" role="list" class="divide-y divide-gray-200">
            <li *ngFor="let order of orders" class="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div class="flex items-center justify-between flex-wrap gap-4">
                
                <!-- Info de base -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-blue-600 truncate">
                    Commande #{{ order.id?.substring(0, 8) | uppercase }}...
                  </p>
                  <p class="mt-1 flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}
                  </p>
                </div>

                <!-- Montant -->
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">{{ order.totalUSDT }} USDT</p>
                  <p class="text-xs text-gray-500" *ngIf="order.items.length > 0">{{ order.items[0].product.title }} <span *ngIf="order.items.length > 1">... (+{{ order.items.length - 1 }})</span></p>
                </div>

                <!-- Badge Statut -->
                <div class="flex-shrink-0 w-full sm:w-auto text-right sm:text-left mt-2 sm:mt-0">
                  <span [ngClass]="{
                    'bg-yellow-100 text-yellow-800 border-yellow-200': order.status === 'pending_payment',
                    'bg-blue-100 text-blue-800 border-blue-200': order.status === 'paid',
                    'bg-green-100 text-green-800 border-green-200': order.status === 'delivered',
                    'bg-red-100 text-red-800 border-red-200': order.status === 'cancelled'
                  }" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border">
                    
                    <svg *ngIf="order.status === 'pending_payment'" class="-ml-1 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg *ngIf="order.status === 'paid'" class="-ml-1 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <svg *ngIf="order.status === 'delivered'" class="-ml-1 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    <svg *ngIf="order.status === 'cancelled'" class="-ml-1 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>

                    {{ getStatusText(order.status) }}
                  </span>
                </div>

              </div>

              <!-- Section Accès / Livraison (Visible uniquement si livré) -->
              <div *ngIf="order.status === 'delivered' && order.activationCode" class="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 class="text-sm font-bold text-green-900 mb-1">Vos accès d'abonnement :</h4>
                <div class="bg-white p-3 rounded border border-green-100 flex justify-between items-center">
                  <code class="text-gray-900 font-mono text-sm break-all">{{ order.activationCode }}</code>
                  <button (click)="copyToClipboard(order.activationCode)" class="ml-2 text-green-600 hover:text-green-800 focus:outline-none" title="Copier">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  </button>
                </div>
                <p class="text-xs text-green-700 mt-2">Ces accès ont également été envoyés à l'adresse fournie lors de la commande.</p>
              </div>

              <!-- Message informatif si en attente -->
              <div *ngIf="order.status === 'pending_payment'" class="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                <p>Votre preuve de transfert USDT est en cours de vérification par notre équipe. Votre abonnement sera activé sous peu.</p>
              </div>

            </li>
          </ul>
        </div>
        
      </div>
    </div>
  `
})
export class ClientDashboardComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);

  orders: any[] = [];
  isLoading = true;

  async ngOnInit() {
    try {
      this.orders = await this.orderService.getUserOrders();
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
    } finally {
      this.isLoading = false;
    }
  }

  getStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'pending_payment': 'En vérification (USDT)',
      'paid': 'Paiement validé',
      'delivered': 'Livré / Actif',
      'cancelled': 'Annulé'
    };
    return statuses[status] || status;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Accès copiés dans le presse-papiers !");
    });
  }
}
