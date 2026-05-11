import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen">
      <section class="relative bg-neutral-900 py-24 md:py-32 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

        <div class="max-w-7xl mx-auto px-4 relative z-10">
          <div class="max-w-3xl">
            <h1 class="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6">
              Vos abonnements <br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Premium & Instantanés
              </span>
            </h1>
            <p class="text-xl text-neutral-400 mb-10 leading-relaxed max-w-xl">
              Accédez au meilleur du streaming et des services web. 
              Paiement 100% sécurisé en USDT via Binance. Activation garantie en moins de 5 minutes.
            </p>
            <div class="flex flex-wrap gap-4">
              <a routerLink="/catalog" class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30">
                Explorer le catalogue
              </a>
              <div class="flex items-center gap-3 px-6 py-4 bg-neutral-800 rounded-2xl border border-neutral-700">
                <span class="flex h-3 w-3 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span class="text-sm font-medium text-neutral-300">Plus de 500 comptes livrés</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="bg-neutral-50 border-y border-neutral-200 py-6">
        <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span class="font-bold text-neutral-800 text-lg">Accepté :</span>
          <span class="font-mono font-bold text-neutral-900 uppercase">Binance Pay</span>
          <span class="font-mono font-bold text-neutral-900 uppercase">USDT (TRC20)</span>
          <span class="font-mono font-bold text-neutral-900 uppercase">USDT (BEP20)</span>
        </div>
      </div>

      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="group">
              <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Vitesse Éclair</h3>
              <p class="text-neutral-500">Notre système automatisé traite vos commandes dès confirmation sur la blockchain.</p>
            </div>
            <div class="group">
              <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Sécurité Crypto</h3>
              <p class="text-neutral-500">Zéro intermédiaire bancaire. Vos données et vos transactions restent confidentielles.</p>
            </div>
            <div class="group">
              <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Support Expert</h3>
              <p class="text-neutral-500">Un problème d'activation ? Notre équipe vous répond en moins de 2 heures.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 bg-neutral-50">
        <div class="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Parcourir par service</h2>
          <p class="text-neutral-500">Sélectionnez la catégorie qui vous intéresse</p>
        </div>

        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngIf="isLoading" class="col-span-full py-10 flex justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <a *ngFor="let cat of categories" 
             [routerLink]="['/catalog']" [queryParams]="{ category: cat.id }"
             class="group bg-white p-8 rounded-3xl border border-neutral-200 hover:border-blue-300 hover:shadow-2xl transition-all flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 class="text-xl font-bold mb-2">{{ cat.name }}</h4>
            <p class="text-sm text-neutral-400 line-clamp-2">{{ cat.description }}</p>
          </a>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private categoryService = inject(CategoryService);
  categories: Category[] = [];
  isLoading = true;

  ngOnInit() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
