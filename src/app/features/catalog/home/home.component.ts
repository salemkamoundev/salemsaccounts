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

      <section class="py-20 bg-neutral-50">
        <div class="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Parcourir par service</h2>
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