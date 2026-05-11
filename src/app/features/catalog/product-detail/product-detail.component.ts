import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Bouton Retour -->
        <div class="mb-8">
          <a routerLink="/catalog" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au catalogue
          </a>
        </div>

        <ng-container *ngIf="product$ | async as product; else loadingTpl">
          <div *ngIf="product; else notFoundTpl" class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <div class="lg:flex">
              
              <!-- Image Section -->
              <div class="lg:w-1/2 bg-gray-100 relative">
                <img *ngIf="product.imageUrl" [src]="product.imageUrl" [alt]="product.title" class="w-full h-full object-cover min-h-[300px] lg:min-h-[500px]">
                <div *ngIf="!product.imageUrl" class="w-full h-full min-h-[300px] lg:min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <svg class="h-24 w-24 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              <!-- Content Section -->
              <div class="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div class="mb-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Abonnement Numérique
                  </span>
                </div>
                
                <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">{{ product.title }}</h1>
                
                <div class="prose prose-blue text-gray-500 mb-8 max-w-none">
                  <p class="whitespace-pre-line text-lg">{{ product.description || 'Cet article ne possède pas de description détaillée.' }}</p>
                </div>

                <div class="mt-auto border-t border-gray-200 pt-8">
                  <div class="flex items-center justify-between mb-8">
                    <div class="text-gray-500">Prix de l'abonnement</div>
                    <div class="text-4xl font-extrabold text-green-600 tracking-tight">
                      {{ product.priceUSDT }} <span class="text-xl font-bold text-green-500 uppercase">USDT</span>
                    </div>
                  </div>

                  <!-- Bouton de commande -->
                  <button (click)="orderNow(product)" 
                          class="w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Commander à l'avance
                  </button>
                  
                  <p class="mt-4 text-sm text-center text-gray-500 flex items-center justify-center">
                    <svg class="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Paiement sécurisé via Binance (USDT TRC20/BEP20)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Templates alternatifs -->
        <ng-template #notFoundTpl>
          <div class="text-center py-20 bg-white shadow rounded-2xl border border-gray-100">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Produit introuvable</h3>
            <p class="text-gray-500">Cet abonnement n'existe plus ou l'URL est incorrecte.</p>
            <a routerLink="/catalog" class="mt-6 inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Retour au catalogue</a>
          </div>
        </ng-template>

        <ng-template #loadingTpl>
          <div class="flex justify-center items-center py-32">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  product$!: Observable<Product>;

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.productService.getProduct(id!);
      })
    );
  }

  orderNow(product: Product) {
    // Redirection vers le checkout avec l'ID de l'article en paramètre
    this.router.navigate(['/checkout'], { queryParams: { productId: product.id } });
  }
}
