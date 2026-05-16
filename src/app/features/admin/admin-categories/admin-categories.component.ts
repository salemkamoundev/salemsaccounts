import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
        <button (click)="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          Nouvelle Catégorie
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngIf="isLoading">
              <td colspan="3" class="px-6 py-8 text-center">
                <div class="flex justify-center items-center text-blue-600">
                  <svg class="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span class="text-gray-500 font-medium">Chargement des catégories...</span>
                </div>
              </td>
            </tr>
            
            <tr *ngFor="let cat of categories">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ cat.name }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ cat.description }}</td>
              <td class="px-6 py-4 text-right">
                <button (click)="editCategory(cat)" [disabled]="deletingId === cat.id" class="text-blue-600 hover:text-blue-900 mr-3 font-medium disabled:opacity-50">Modifier</button>
                <button (click)="deleteCategory(cat.id)" [disabled]="deletingId === cat.id" class="text-red-600 hover:text-red-900 font-medium disabled:opacity-50">
                  <span *ngIf="deletingId === cat.id" class="inline-block animate-spin mr-1">⏳</span>
                  {{ deletingId === cat.id ? 'Suppression...' : 'Supprimer' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="!isLoading && categories.length === 0">
              <td colspan="3" class="px-6 py-4 text-center text-gray-500">Aucune catégorie trouvée.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">{{ editingId ? 'Modifier' : 'Ajouter' }} une catégorie</h3>
          <form (ngSubmit)="saveCategory()">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1 text-gray-700">Nom</label>
              <input [(ngModel)]="currentCategory.name" name="name" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" required>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea [(ngModel)]="currentCategory.description" name="desc" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500" rows="3"></textarea>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" (click)="showModal = false" [disabled]="isSaving" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">Annuler</button>
              <button type="submit" [disabled]="isSaving" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50">
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
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef); // <-- Injection du détecteur
  
  categories: Category[] = [];
  showModal = false;
  editingId: string | null = null;
  currentCategory: Partial<Category> = {};

  isLoading = true;
  isSaving = false;
  deletingId: string | null = null;

  ngOnInit() {
    this.isLoading = true;

    // Timeout de sécurité au cas où Firestore ne répondrait jamais (ex: réseau coupé)
    const fallback = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.warn('Timeout: Chargement des catégories trop long.');
      }
    }, 5000);

    this.categoryService.getCategories().subscribe({
      next: (res) => {
        clearTimeout(fallback);
        this.categories = res || [];
        this.isLoading = false;
        this.cdr.detectChanges(); // <-- Force la MAJ de la vue
      },
      error: (err) => {
        clearTimeout(fallback);
        console.error('Erreur de chargement:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.editingId = null;
    this.currentCategory = { name: '', description: '' };
    this.showModal = true;
  }

  editCategory(cat: Category) {
    this.editingId = cat.id || null;
    const { id, ...dataToEdit } = cat as any;
    this.currentCategory = { ...dataToEdit };
    this.showModal = true;
  }

  async saveCategory() {
    this.isSaving = true;
    try {
      if (this.editingId) {
        await this.categoryService.updateCategory(this.editingId, this.currentCategory);
      } else {
        await this.categoryService.addCategory(this.currentCategory as Category);
      }
      this.showModal = false;
    } catch (error) {
      alert('Une erreur est survenue lors de la sauvegarde.');
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  async deleteCategory(id: string | undefined) {
    if (!id) return;
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      this.deletingId = id;
      try {
        await this.categoryService.deleteCategory(id);
      } catch (error) {
        alert('Échec de la suppression.');
      } finally {
        this.deletingId = null;
        this.cdr.detectChanges();
      }
    }
  }
}
