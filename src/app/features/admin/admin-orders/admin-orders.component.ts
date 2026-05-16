import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Suivi des Commandes</h2>
        
        <div class="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button (click)="setFilter('all')" 
                  [class.bg-gray-100]="filterStatus === 'all'"
                  class="px-4 py-1.5 text-sm font-medium rounded-md transition-all">Toutes</button>
          <button (click)="setFilter('pending_payment')" 
                  [class.bg-yellow-100]="filterStatus === 'pending_payment'"
                  [class.text-yellow-700]="filterStatus === 'pending_payment'"
                  class="px-4 py-1.5 text-sm font-medium rounded-md transition-all">À valider</button>
          <button (click)="filterStatus = 'delivered'" 
                  [class.bg-green-100]="filterStatus === 'delivered'"
                  [class.text-green-700]="filterStatus === 'delivered'"
                  class="px-4 py-1.5 text-sm font-medium rounded-md transition-all">Livrées</button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        
        <div *ngIf="isLoading" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center">
          <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p class="text-gray-500 font-medium">Récupération des commandes...</p>
        </div>

        <div *ngFor="let order of filteredOrders" 
             class="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-1">
              <span class="font-mono text-xs font-bold text-gray-400">#{{ order.id?.substring(0,8) }}</span>
              <span [ngClass]="getStatusClass(order.status)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {{ order.status === 'pending_payment' ? 'Attente Paiement' : 'Livré' }}
              </span>
            </div>
            <h3 class="font-bold text-gray-900">{{ order.totalUSDT }} USDT</h3>
            <p class="text-sm text-gray-500">{{ order.createdAt?.toDate() | date:'dd/MM/yyyy HH:mm' }}</p>
            <p class="text-xs text-gray-400 mt-1">Client : {{ order.userEmail }}</p>
          </div>

          <div class="flex-1">
            <p class="text-xs text-gray-400 uppercase font-bold mb-1">Preuve fournie</p>
            <div *ngIf="order.txHash" class="flex items-center gap-2">
              <span class="text-xs font-mono text-blue-600 truncate w-32 block" [title]="order.txHash">{{ order.txHash }}</span>
              <a [href]="'https://tronscan.org/#/transaction/' + order.txHash" target="_blank" class="text-gray-400 hover:text-blue-500">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
            <div *ngIf="order.paymentProof" class="text-xs text-green-600 font-medium">Image uploadée ✓</div>
            <div *ngIf="!order.txHash && !order.paymentProof" class="text-xs text-red-500 italic">Aucune preuve</div>
          </div>

          <button (click)="openDetail(order)" 
                  class="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors w-full md:w-auto">
            {{ order.status === 'pending_payment' ? 'Valider & Livrer' : 'Voir Détails' }}
          </button>
        </div>

        <div *ngIf="!isLoading && filteredOrders.length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <p class="text-gray-400">Aucune commande ne correspond à ce filtre.</p>
        </div>
      </div>

      <div *ngIf="selectedOrder" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Traitement Commande</h3>
              <p class="text-sm text-gray-500">Validation du paiement USDT</p>
            </div>
            <button (click)="selectedOrder = null" class="text-gray-400 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[70vh]">
            <div class="mb-6">
              <label class="block text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Preuve de paiement</label>
              
              <div *ngIf="selectedOrder.paymentProof" class="rounded-xl overflow-hidden border border-gray-200 mb-4 bg-gray-50 p-2">
                <a [href]="selectedOrder.paymentProof" target="_blank" class="block text-center text-xs text-blue-600 font-medium mb-2 hover:underline">Ouvrir l'image en grand ↗</a>
                <img [src]="selectedOrder.paymentProof" class="w-full h-auto object-contain bg-black max-h-60 rounded-lg">
              </div>

              <div *ngIf="selectedOrder.txHash" class="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 break-all border border-gray-700 flex justify-between items-center">
                <div><span class="text-gray-500 mr-2">$ tx_hash:</span>{{ selectedOrder.txHash }}</div>
                <a [href]="'https://tronscan.org/#/transaction/' + selectedOrder.txHash" target="_blank" class="text-green-400 hover:text-white ml-2 flex-shrink-0">Explorer ↗</a>
              </div>
            </div>

            <div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <label class="block text-sm font-bold text-blue-900 mb-2">Code d'abonnement à délivrer</label>
              <textarea [(ngModel)]="subCode" 
                        rows="4" 
                        [disabled]="selectedOrder.status === 'delivered' || isProcessing"
                        class="w-full rounded-xl border border-blue-200 p-4 text-sm focus:ring-blue-500 focus:border-blue-500 mb-4 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Ex: NETFLIX-PREMIUM-XXXX-XXXX..."></textarea>
              
              <button *ngIf="selectedOrder.status === 'pending_payment'"
                      (click)="deliverOrder()" 
                      [disabled]="!subCode || isProcessing"
                      class="w-full flex justify-center items-center bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                <svg *ngIf="isProcessing" class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isProcessing ? 'Traitement en cours...' : 'Valider le paiement et Envoyer' }}
              </button>

              <div *ngIf="selectedOrder.status === 'delivered'" class="text-center text-sm font-bold text-green-700 bg-green-100 rounded-lg py-2">
                ✓ Cette commande a déjà été livrée.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  
  orders: any[] = [];
  filterStatus: string = 'pending_payment';
  selectedOrder: any = null;
  subCode: string = '';
  
  isLoading = true;
  isProcessing = false;

  async ngOnInit() {
    await this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    this.cdr.detectChanges();

    const fallback = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);

    try {
      this.orders = await this.orderService.getAllOrders() || [];
    } catch (error) {
      console.error('Erreur de chargement des commandes', error);
    } finally {
      clearTimeout(fallback);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  get filteredOrders() {
    if (this.filterStatus === 'all') return this.orders;
    return this.orders.filter(o => o.status === this.filterStatus);
  }

  setFilter(status: string) {
    this.filterStatus = status;
    this.cdr.detectChanges();
  }

  openDetail(order: any) {
    this.selectedOrder = order;
    this.subCode = order.subscriptionCode || '';
    this.cdr.detectChanges();
  }

  async deliverOrder() {
    if (!this.selectedOrder || !this.subCode) return;
    this.isProcessing = true;
    this.cdr.detectChanges();
    
    try {
      // Met à jour le document Firestore
      await this.orderService.updateOrderStatus(this.selectedOrder.id, 'delivered', this.subCode);
      this.selectedOrder = null;
      alert('Commande livrée avec succès ! Le client a reçu son accès.');
      
      // Rafraîchit immédiatement la liste locale
      await this.loadOrders();
    } catch (e) {
      alert('Erreur lors de la livraison');
    } finally {
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  }

  getStatusClass(status: string) {
    return status === 'pending_payment' 
      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
      : 'bg-green-100 text-green-700 border border-green-200';
  }
}
