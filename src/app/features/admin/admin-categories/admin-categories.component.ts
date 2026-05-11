import { Component, inject, OnInit } from '@angular/core';
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
        <button (click)="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
            <tr *ngFor="let cat of categories">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ cat.name }}</td>
              <td class="px-6 py-4 text-gray-500 text-sm">{{ cat.description }}</td>
              <td class="px-6 py-4 text-right">
                <button (click)="editCategory(cat)" class="text-blue-600 hover:text-blue-900 mr-3 font-medium">Modifier</button>
                <button (click)="deleteCategory(cat.id!)" class="text-red-600 hover:text-red-900 font-medium">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="categories.length === 0">
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
              <button type="button" (click)="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  
  categories: Category[] = [];
  showModal = false;
  editingId: string | null = null;
  currentCategory: Partial<Category> = {};

  ngOnInit() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  openModal() {
    this.editingId = null;
    this.currentCategory = { name: '', description: '' };
    this.showModal = true;
  }

  editCategory(cat: Category) {
    this.editingId = cat.id!;
    this.currentCategory = { ...cat };
    this.showModal = true;
  }

  async saveCategory() {
    try {
      if (this.editingId) {
        await this.categoryService.updateCategory(this.editingId, this.currentCategory);
      } else {
        await this.categoryService.addCategory(this.currentCategory as Category);
      }
      this.showModal = false;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue.');
    }
  }

  async deleteCategory(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      try {
        await this.categoryService.deleteCategory(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }
}
