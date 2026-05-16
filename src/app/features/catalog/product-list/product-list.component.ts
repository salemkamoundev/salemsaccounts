import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-white min-h-screen">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Catalogue des Abonnements</h1>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Trouvez le produit digital qu'il vous faut. Paiement direct et sécurisé en USDT.
          </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Filtres (Sidebar sur Desktop, Scroll horizontal sur Mobile) -->
          <div class="w-full lg:w-64 flex-shrink-0">
            <h2 class="text-lg font-medium text-gray-900 mb-4 hidden lg:block">Catégories</h2>
            <div class="flex overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-0 scrollbar-hide">
              <button (click)="selectCategory(null)" 
                      [ngClass]="(selectedCategory$ | async) === null ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left">
                Toutes les catégories
              </button>
              
              <ng-container *ngIf="categories$ | async as categories">
                <button *ngFor="let cat of categories" 
                        (click)="selectCategory(cat.id!)"
                        [ngClass]="(selectedCategory$ | async) === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left">
                  {{ cat.name }}
                </button>
              </ng-container>
            </div>
          </div>

          <!-- Grille des produits -->
          <div class="flex-1">
            <ng-container *ngIf="products$ | async as products; else loadingTpl">
              <div *ngIf="products.length > 0; else emptyTpl" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                
                <!-- Carte Produit -->
                <div *ngFor="let product of products" class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
                  <!-- Image générique si pas d'image -->
                  <div class="h-48 bg-gray-200 relative">
                    <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.title" class="w-full h-full object-cover">
                    <div *ngIf="!product.imageUrl" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      <svg class="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div class="p-5 flex-1 flex flex-col">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-bold text-gray-900 line-clamp-2">{{ product.title }}</h3>
                    </div>
                    <p class="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">{{ product.description || 'Aucune description disponible.' }}</p>
                    
                    <div class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <!-- Prix en USDT -->
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-500 font-medium">Prix unitaire</span>
                        <span class="text-2xl font-extrabold text-green-600">{{ product.priceUSDT }} <span class="text-sm font-bold">USDT</span></span>
                      </div>
                      <a [routerLink]="['/catalog', product.id]" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                        Détails
                      </a>
                    </div>
                  </div>
                </div>

              </div>
              
              <!-- Aucun produit -->
              <ng-template #emptyTpl>
                <div class="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
                  <p class="mt-1 text-sm text-gray-500">Il n'y a pas d'abonnements dans cette catégorie pour le moment.</p>
                </div>
              </ng-template>
            </ng-container>

            <!-- Loading -->
            <ng-template #loadingTpl>
              <div class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </ng-template>
          </div>

        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories$ = this.categoryService.getCategories();
  
  selectedCategory$ = new BehaviorSubject<string | null>(null);
  
  products$: Observable<Product[]> = this.selectedCategory$.pipe(
    switchMap(categoryId => {
      // Sécurité : on ignore si l'ID est vide ou s'il vaut le texte "null"
      if (categoryId && categoryId !== 'null') {
        return this.productService.getProductsByCategory(categoryId);
      } else {
        return this.productService.getProducts();
      }
    })
  );

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const cat = params['category'];
      // Si une catégorie est présente dans l'URL (et n'est pas le mot "null")
      if (cat && cat !== 'null') {
        this.selectedCategory$.next(cat);
      } else {
        // Sinon, on s'assure que le bouton "Toutes les catégories" est bien activé
        this.selectedCategory$.next(null);
      }
    });
  }

  selectCategory(categoryId: string | null) {
    // On met à jour l'URL (si categoryId est null, ça l'enlèvera proprement de l'URL)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId || null },
      queryParamsHandling: 'merge'
    });
  }
}
