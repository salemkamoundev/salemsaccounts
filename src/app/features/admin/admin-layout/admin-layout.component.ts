import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex h-screen bg-gray-100 font-sans">
      
      <!-- Sidebar (Desktop) -->
      <aside class="hidden w-64 overflow-y-auto bg-gray-900 md:block flex-shrink-0">
        <div class="py-4 text-gray-400 flex flex-col h-full">
          <a routerLink="/" class="ml-6 text-lg font-bold text-white flex items-center">
            <svg class="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            SalemsAccounts
          </a>
          
          <div class="mt-8 mb-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">
            Menu de gestion
          </div>

          <ul class="space-y-2">
            <li>
              <a routerLink="/admin/dashboard" routerLinkActive="bg-gray-800 text-white border-l-4 border-blue-500" [routerLinkActiveOptions]="{exact: true}"
                 class="block px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                📊 Tableau de bord
              </a>
            </li>
            <li>
              <a routerLink="/admin/orders" routerLinkActive="bg-gray-800 text-white border-l-4 border-blue-500"
                 class="block px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                🛒 Commandes USDT
              </a>
            </li>
            <li>
              <a routerLink="/admin/products" routerLinkActive="bg-gray-800 text-white border-l-4 border-blue-500"
                 class="block px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                📦 Abonnements (Produits)
              </a>
            </li>
            <li>
              <a routerLink="/admin/categories" routerLinkActive="bg-gray-800 text-white border-l-4 border-blue-500"
                 class="block px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                📑 Catégories
              </a>
            </li>
          </ul>

          <div class="mt-auto px-6 py-4">
            <a routerLink="/" class="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Retour au site client
            </a>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex flex-col flex-1 w-full overflow-hidden">
        <!-- Header Mobile / Topbar -->
        <header class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div class="flex items-center">
            <button class="text-gray-500 focus:outline-none md:hidden">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-800 md:hidden ml-4">Admin</h1>
          </div>
          <div class="flex items-center">
            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Espace Administrateur</span>
          </div>
        </header>

        <!-- Dynamic Content (Router Outlet) -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>

    </div>
  `
})
export class AdminLayoutComponent {}
