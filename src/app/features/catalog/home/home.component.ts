import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <div class="relative bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-900 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Vos abonnements et</span>
                <span class="block text-blue-500 xl:inline">produits digitaux</span>
              </h1>
              <p class="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Découvrez notre catalogue complet d'abonnements électroniques et de services digitaux. Paiement rapide et sécurisé via USDT (Binance). Activation garantie.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a routerLink="/catalog" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg transition-colors">
                    Voir le catalogue
                  </a>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <a routerLink="/login" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg transition-colors">
                    Se connecter
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-80" src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Équipements électroniques et écrans">
      </div>
    </div>

    <!-- Section Catégories -->
    <div class="bg-gray-50 py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Nos Catégories</h2>
          <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choisissez la catégorie qui correspond à vos besoins.
          </p>
        </div>

        <div class="mt-10">
          <ng-container *ngIf="categories$ | async as categories; else loadingTpl">
            <div *ngIf="categories.length > 0; else emptyTpl" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Carte Catégorie -->
              <div *ngFor="let category of categories" 
                   [routerLink]="['/catalog']" [queryParams]="{ category: category.id }"
                   class="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div class="px-4 py-5 sm:p-6 text-center">
                  <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 class="text-lg leading-6 font-medium text-gray-900">{{ category.name }}</h3>
                  <p class="mt-2 text-sm text-gray-500" *ngIf="category.description">
                    {{ category.description }}
                  </p>
                  <div class="mt-4">
                    <span class="text-blue-600 text-sm font-medium hover:text-blue-500">Explorer &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ng-template #emptyTpl>
              <div class="text-center py-12">
                <p class="text-gray-500 text-lg">Aucune catégorie disponible pour le moment.</p>
              </div>
            </ng-template>
          </ng-container>

          <ng-template #loadingTpl>
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  private categoryService = inject(CategoryService);
  categories$ = this.categoryService.getCategories();
}
