import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Connexion</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Accédez à vos abonnements et commandes
          </p>
        </div>
        
        <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email-address" class="sr-only">Adresse Email</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required [(ngModel)]="email"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse Email">
            </div>
            <div>
              <label for="password" class="sr-only">Mot de passe</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required [(ngModel)]="password"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe">
            </div>
          </div>

          <div>
            <button type="submit"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Se connecter
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <button (click)="loginGoogle()"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
              Google
            </button>
          </div>
        </div>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Pas encore de compte ? 
            <a routerLink="/signup" class="font-medium text-blue-600 hover:text-blue-500">S'inscrire</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit() {
    try {
      this.errorMessage = '';
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = 'Identifiants incorrects ou erreur de connexion.';
      console.error(error);
    }
  }

  async loginGoogle() {
    try {
      this.errorMessage = '';
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = 'Erreur lors de la connexion avec Google.';
    }
  }

  async loginFacebook() {
    try {
      this.errorMessage = '';
      await this.authService.loginWithFacebook();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = 'Erreur lors de la connexion avec Facebook.';
    }
  }
}
