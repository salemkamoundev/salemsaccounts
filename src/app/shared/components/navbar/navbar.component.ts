import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-200 shadow-sm relative z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo & Liens de navigation -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center cursor-pointer" routerLink="/">
              <span class="text-xl font-bold text-blue-600">SalemsAccounts</span>
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a routerLink="/" routerLinkActive="border-blue-500 text-gray-900" [routerLinkActiveOptions]="{exact: true}" 
                 class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Accueil
              </a>
              <a routerLink="/catalog" routerLinkActive="border-blue-500 text-gray-900"
                 class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                Catalogue
              </a>
              
              <!-- Lien Admin visible uniquement si l'utilisateur est admin -->
              <ng-container *ngIf="userProfile$ | async as profile">
                <a *ngIf="profile.role === 'admin'" routerLink="/admin" routerLinkActive="border-blue-500 text-gray-900"
                   class="border-transparent text-red-500 hover:border-red-300 hover:text-red-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                  ⚙️ Back Office
                </a>
              </ng-container>
            </div>
          </div>

          <!-- Actions Auth (Desktop) -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <ng-container *ngIf="authService.user$ | async as user; else loginTpl">
              <a routerLink="/dashboard" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Mes Commandes
              </a>
              <button (click)="logout()" class="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Déconnexion
              </button>
            </ng-container>
            <ng-template #loginTpl>
              <a routerLink="/login" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Se connecter
              </a>
              <a routerLink="/signup" class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                S'inscrire
              </a>
            </ng-template>
          </div>

          <!-- Menu Hamburger (Mobile) -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button type="button" (click)="toggleMobileMenu()" class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span class="sr-only">Ouvrir le menu principal</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path *ngIf="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path *ngIf="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Mobile (Dropdown) -->
      <div *ngIf="isMobileMenuOpen" class="sm:hidden border-t border-gray-200 bg-white">
        <div class="pt-2 pb-3 space-y-1">
          <a routerLink="/" (click)="toggleMobileMenu()" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Accueil</a>
          <a routerLink="/catalog" (click)="toggleMobileMenu()" class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Catalogue</a>
          
          <ng-container *ngIf="userProfile$ | async as profile">
            <a *ngIf="profile.role === 'admin'" routerLink="/admin" (click)="toggleMobileMenu()" class="border-transparent text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              ⚙️ Back Office
            </a>
          </ng-container>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <ng-container *ngIf="authService.user$ | async as user; else mobileLoginTpl">
            <div class="px-4 flex items-center">
              <div class="text-base font-medium text-gray-800">{{ user.email }}</div>
            </div>
            <div class="mt-3 space-y-1">
              <a routerLink="/dashboard" (click)="toggleMobileMenu()" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Mes Commandes</a>
              <button (click)="logout()" class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Déconnexion</button>
            </div>
          </ng-container>
          <ng-template #mobileLoginTpl>
            <div class="space-y-1">
              <a routerLink="/login" (click)="toggleMobileMenu()" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Se connecter</a>
              <a routerLink="/signup" (click)="toggleMobileMenu()" class="block px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-gray-100">S'inscrire</a>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  private firestore = inject(Firestore);

  isMobileMenuOpen = false;

  // Pipeline pour récupérer le document Firestore de l'utilisateur connecté
  userProfile$ = this.authService.user$.pipe(
    switchMap(user => {
      if (user) {
        const userDocRef = doc(this.firestore, \`users/\${user.uid}\`);
        return docData(userDocRef, { idField: 'uid' });
      } else {
        return of(null);
      }
    })
  );

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  async logout() {
    await this.authService.logout();
    this.isMobileMenuOpen = false;
  }
}
