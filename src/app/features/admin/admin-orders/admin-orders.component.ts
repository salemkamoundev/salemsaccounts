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
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div *ngIf="isLoading" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center">
          <svg class="animate-spin h-10 w-10 text-blue-600 mb-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p class="text-gray-500 font-medium">Récupération des commandes...</p>
        </div>

        <div *ngFor="let order of filteredOrders" class="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex">
          <h3 class="font-bold text-gray-900">{{ order.totalUSDT }} USDT</h3>
        </div>

        <div *ngIf="!isLoading && filteredOrders.length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <p class="text-gray-400">Aucune commande ne correspond à ce filtre.</p>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef); // <-- Injection
  
  orders: any[] = [];
  filterStatus: string = 'pending_payment';
  
  isLoading = true;

  async ngOnInit() {
    this.isLoading = true;
    
    const fallback = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);

    try {
      this.orders = await this.orderService.getAllOrders() || [];
    } catch (error) {
      console.error('Erreur', error);
    } finally {
      clearTimeout(fallback);
      this.isLoading = false;
      this.cdr.detectChanges(); // <-- Forcer le refresh
    }
  }

  get filteredOrders() {
    return this.orders;
  }
}
