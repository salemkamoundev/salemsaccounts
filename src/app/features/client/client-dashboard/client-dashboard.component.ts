import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div class="mb-8 border-b border-gray-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Historique de mes commandes</h1>
          <p class="mt-2 text-sm text-gray-500">Retrouvez vos achats, le statut de vos paiements Binance et vos codes d'accès.</p>
        </div>
        
        <button (click)="refreshOrders()" 
                [disabled]="isLoading"
                class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all">
          <svg [class.animate-spin]="isLoading" class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.213 15M16 19h5v-5" />
          </svg>
          {{ isLoading ? 'Actualisation...' : 'Actualiser' }}
        </button>
      </div>

      <div *ngIf="orders.length > 0" class="flex flex-wrap gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl max-w-max border border-gray-200/60">
        <button (click)="setFilter('all')" 
                [ngClass]="currentFilter === 'all' ? 'bg-blue-600 text-white shadow-md font-bold' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-medium'"
                class="px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2">
          <span>Toutes</span>
          <span [ngClass]="currentFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'" class="text-xs px-2 py-0.5 rounded-md font-bold">
            {{ orders.length }}
          </span>
        </button>
        
        <button (click)="setFilter('pending')" 
                [ngClass]="currentFilter === 'pending' ? 'bg-yellow-500 text-white shadow-md font-bold' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-medium'"
                class="px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2">
          <span>En attente</span>
          <span [ngClass]="currentFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-800'" class="text-xs px-2 py-0.5 rounded-md font-bold">
            {{ getCountByStatus('pending_payment') }}
          </span>
        </button>
        
        <button (click)="setFilter('delivered')" 
                [ngClass]="currentFilter === 'delivered' ? 'bg-green-600 text-white shadow-md font-bold' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-medium'"
                class="px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2">
          <span>Livrées</span>
          <span [ngClass]="currentFilter === 'delivered' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-800'" class="text-xs px-2 py-0.5 rounded-md font-bold">
            {{ getCountByStatus('delivered') }}
          </span>
        </button>
      </div>

      <div *ngIf="isLoading" class="flex flex-col justify-center items-center py-20">
        <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-500 font-medium">Chargement de votre historique...</span>
      </div>

      <div *ngIf="!isLoading && filteredOrders.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-xl font-medium text-gray-900 mb-2">Aucune commande trouvée</h2>
        <p class="text-gray-500 mb-6">Aucun achat ne correspond à cette catégorie.</p>
        <a routerLink="/" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          Découvrir nos abonnements
        </a>
      </div>

      <div *ngIf="!isLoading && filteredOrders.length > 0" class="space-y-6">
        <div *ngFor="let order of filteredOrders" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span class="text-xs text-gray-500 font-mono uppercase tracking-wider">Commande #{{ order.id?.substring(0,8) }}</span>
              <div class="text-sm font-medium text-gray-900">{{ order.createdAt?.toDate() | date:'dd/MM/yyyy à HH:mm' }}</div>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <span class="font-black text-gray-900 text-lg">{{ order.totalUSDT }} USDT</span>
              <span [ngClass]="{
                'bg-yellow-100 text-yellow-800 border-yellow-200': order.status === 'pending_payment',
                'bg-green-100 text-green-800 border-green-200': order.status === 'delivered'
              }" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border">
                {{ getStatusText(order.status) }}
              </span>
            </div>
          </div>
          
          <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="md:col-span-2">
              <h4 class="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Contenu de la commande</h4>
              <ul class="space-y-2 mb-4">
                <li *ngFor="let item of order.items" class="flex items-center text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div class="h-6 w-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center mr-3 text-xs font-bold flex-shrink-0">
                    x{{ item.quantity }}
                  </div>
                  <span class="font-semibold text-gray-900">{{ item.name }}</span>
                </li>
              </ul>

              <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 bg-gray-50/50 p-3 rounded-lg border border-dashed border-gray-200">
                <div><span class="font-bold text-gray-700">Appareil sélectionné :</span> {{ getDeviceText(order.device) }}</div>
                <div *ngIf="order.appPreference"><span class="font-bold text-gray-700">Application préférée :</span> {{ order.appPreference }}</div>
              </div>
            </div>

            <div class="flex flex-col justify-center">
              <div *ngIf="order.status === 'delivered' && order.subscriptionCode" class="p-4 bg-green-50 rounded-xl border border-green-200 shadow-inner">
                <h4 class="text-xs font-black text-green-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span class="flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                    Code d'Accès
                  </span>
                  <span *ngIf="copiedOrderId === order.id" class="text-[10px] text-green-600 font-bold bg-white px-1.5 py-0.5 rounded border border-green-300 animate-pulse">Copié !</span>
                </h4>
                
                <div class="relative group">
                  <p class="font-mono text-sm text-green-900 break-all bg-white p-3 pr-10 rounded-lg border border-green-100 font-medium select-all">
                    {{ order.subscriptionCode }}
                  </p>
                  <button (click)="copyToClipboard(order.subscriptionCode, order.id)" 
                          title="Copier le code"
                          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 bg-white rounded shadow-sm border border-gray-100 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 00-2 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-5 10h6m-6-4h6" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div *ngIf="order.status === 'pending_payment'" class="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-xs text-yellow-800">
                <div class="flex items-center font-bold mb-1">
                  <svg class="w-4 h-4 mr-1.5 animate-pulse text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Vérification manuelle
                </div>
                <p class="leading-relaxed">Votre preuve de dépôt USDT reçue via Binance Pay / Blockchain est en cours de validation. Votre code sera affiché ici dès approbation.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  orders: any[] = [];
  currentFilter: 'all' | 'pending' | 'delivered' = 'all';
  copiedOrderId: string | null = null;

  async ngOnInit() {
    await this.refreshOrders();
  }

  async refreshOrders() {
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      this.orders = await this.orderService.getUserOrders() || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  setFilter(filter: 'all' | 'pending' | 'delivered') {
    this.currentFilter = filter;
    this.cdr.detectChanges();
  }

  get filteredOrders() {
    if (this.currentFilter === 'all') return this.orders;
    if (this.currentFilter === 'pending') return this.orders.filter(o => o.status === 'pending_payment');
    return this.orders.filter(o => o.status === 'delivered');
  }

  getCountByStatus(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }

  copyToClipboard(text: string, orderId: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedOrderId = orderId;
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.copiedOrderId = null;
        this.cdr.detectChanges();
      }, 2000);
    }).catch(err => console.error('Impossible de copier', err));
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending_payment': return 'Vérification';
      case 'delivered': return 'Activé';
      default: return status;
    }
  }

  getDeviceText(device: string): string {
    switch (device) {
      case 'smart_tv': return 'Smart TV (Samsung/LG)';
      case 'android_box': return 'Box Android / Firestick';
      case 'smartphone': return 'Smartphone / Tablette';
      case 'pc': return 'PC / Mac';
      default: return 'Autre appareil';
    }
  }
}
