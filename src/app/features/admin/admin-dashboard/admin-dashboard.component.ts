import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h2>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>

      <!-- Stats Grid -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <!-- Total Commandes -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Commandes Totales</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
          </div>
        </div>

        <!-- En attente de validation -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">À valider (Preuves USDT)</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.pendingOrders }}</p>
          </div>
        </div>

        <!-- Revenus Validés -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Revenus Validés (USDT)</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.totalRevenue }}</p>
          </div>
        </div>

      </div>

      <!-- Actions Rapides -->
      <div *ngIf="!isLoading" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Actions Rapides</h3>
        <div class="flex gap-4">
          <a routerLink="/admin/orders" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
            Vérifier les paiements
          </a>
          <a routerLink="/admin/products" class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors">
            Ajouter un abonnement
          </a>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);

  isLoading = true;
  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  };

  async ngOnInit() {
    try {
      const orders = await this.orderService.getAllOrders();
      
      this.stats.totalOrders = orders.length;
      
      let pending = 0;
      let revenue = 0;

      orders.forEach(order => {
        if (order.status === 'pending_payment') {
          pending++;
        }
        if (order.status === 'paid' || order.status === 'delivered') {
          revenue += order.totalUSDT;
        }
      });

      this.stats.pendingOrders = pending;
      this.stats.totalRevenue = revenue;

    } catch (error) {
      console.error("Erreur lors du chargement des statistiques", error);
    } finally {
      this.isLoading = false;
    }
  }
}
