import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 relative">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Gestion des Abonnements</h2>
        <button (click)="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 z-10">
          Nouvel Abonnement
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix (USDT)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngIf="isLoading">
              <td colspan="5" class="px-6 py-8 text-center">
                <div class="flex justify-center items-center text-blue-600">
                  <svg class="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span class="text-gray-500 font-medium">Chargement des abonnements...</span>
                </div>
              </td>
            </tr>

            <tr *ngFor="let prod of products">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img *ngIf="prod.imageUrl" [src]="prod.imageUrl" class="h-10 w-10 rounded-lg mr-3 object-cover border border-gray-200">
                  <div *ngIf="!prod.imageUrl" class="h-10 w-10 rounded-lg mr-3 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <span class="font-medium text-gray-900 block">{{ prod.name }}</span>
                    <span class="text-xs text-gray-500 truncate w-32 block">{{ prod.description }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getCategoryName(prod.category) }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-bold text-blue-600">{{ prod.priceUSDT }} USDT</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" 
                      [ngClass]="(prod.stock || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ (prod.stock || 0) > 0 ? (prod.stock || 0) + ' en stock' : 'Rupture' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button (click)="editProduct(prod)" [disabled]="deletingId === prod.id" class="text-blue-600 hover:text-blue-900 mr-3 font-medium disabled:opacity-50">Modifier</button>
                <button (click)="deleteProduct(prod.id!)" [disabled]="deletingId === prod.id" class="text-red-600 hover:text-red-900 font-medium disabled:opacity-50">
                  <span *ngIf="deletingId === prod.id" class="inline-block animate-spin mr-1">⏳</span>
                  {{ deletingId === prod.id ? 'Suppression...' : 'Supprimer' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="!isLoading && products.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">Aucun produit trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto">
        <div class="bg-white rounded-xl p-6 w-full max-w-2xl my-8 shadow-2xl relative">
          <h3 class="text-xl font-bold mb-4 text-gray-900">{{ editingId ? 'Modifier' : 'Ajouter' }} un abonnement</h3>
          <form (ngSubmit)="saveProduct()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1 text-gray-700">Nom du service</label>
              <input [(ngModel)]="currentProduct.name" name="name" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" required>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1 text-gray-700">Catégorie</label>
              <select [(ngModel)]="currentProduct.category" name="cat" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" required>
                <option value="" disabled>Sélectionner une catégorie</option>
                <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1 text-gray-700">Prix (USDT)</label>
              <input type="number" [(ngModel)]="currentProduct.priceUSDT" name="price" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" required min="0" step="0.01">
            </div>

            <div>
              <label class="block text-sm font-medium mb-1 text-gray-700">Stock disponible</label>
              <input type="number" [(ngModel)]="currentProduct.stock" name="stock" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" required min="0">
            </div>

            <div>
              <label class="block text-sm font-medium mb-1 text-gray-700">URL de l'image</label>
              <input [(ngModel)]="currentProduct.imageUrl" name="img" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" placeholder="https://...">
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea [(ngModel)]="currentProduct.description" name="desc" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" rows="3" required></textarea>
            </div>

            <div class="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" (click)="showModal = false" [disabled]="isSaving" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium disabled:opacity-50">Annuler</button>
              <button type="submit" [disabled]="isSaving" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center disabled:opacity-50">
                <svg *ngIf="isSaving" class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  categories: Category[] = [];
  
  showModal = false;
  editingId: string | null = null;
  currentProduct: Partial<Product> = {};

  isLoading = true;
  isSaving = false;
  deletingId: string | null = null;

  ngOnInit() {
    this.isLoading = true;

    const fallback = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }, 5000);

    this.categoryService.getCategories().subscribe(res => {
      this.categories = res || [];
      this.cdr.detectChanges();
    });

    this.productService.getProducts().subscribe({
      next: (res) => {
        clearTimeout(fallback);
        this.products = res || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        clearTimeout(fallback);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return 'Non assignée';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Inconnue';
  }

  openModal() {
    this.editingId = null;
    this.currentProduct = { 
      name: '', 
      description: '', 
      priceUSDT: 0, 
      stock: 0, 
      category: '', 
      imageUrl: '' 
    };
    this.showModal = true;
    this.cdr.detectChanges(); // <-- Indispensable sur mobile pour forcer le rafraîchissement
  }

  editProduct(prod: Product) {
    this.editingId = prod.id || null;
    const { id, ...dataToEdit } = prod as any;
    this.currentProduct = { ...dataToEdit };
    this.showModal = true;
    this.cdr.detectChanges(); // <-- Indispensable ici aussi
  }

  async saveProduct() {
    this.isSaving = true;
    this.cdr.detectChanges();
    try {
      if (this.editingId) {
        await this.productService.updateProduct(this.editingId, this.currentProduct);
      } else {
        await this.productService.addProduct(this.currentProduct as Product);
      }
      this.showModal = false;
    } catch (error) {
      console.error('Erreur de sauvegarde produit', error);
      alert('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  async deleteProduct(id: string) {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer cet abonnement ?')) {
      this.deletingId = id;
      this.cdr.detectChanges();
      try {
        await this.productService.deleteProduct(id);
      } catch (error) {
        console.error('Erreur suppression produit', error);
      } finally {
        this.deletingId = null;
        this.cdr.detectChanges();
      }
    }
  }
}
