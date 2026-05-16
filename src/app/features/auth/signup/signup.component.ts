import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Créer un compte</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Rejoignez-nous pour commander vos abonnements
          </p>
        </div>

        <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email-address" class="sr-only">Adresse Email</label>
              <input id="email-address" name="email" type="email" required [(ngModel)]="email"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Adresse Email">
            </div>
            <div>
              <label for="password" class="sr-only">Mot de passe</label>
              <input id="password" name="password" type="password" required [(ngModel)]="password"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Mot de passe (6 caractères min)">
            </div>
            <div>
              <label for="confirm-password" class="sr-only">Confirmer le mot de passe</label>
              <input id="confirm-password" name="confirmPassword" type="password" required [(ngModel)]="confirmPassword"
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Confirmer le mot de passe">
            </div>
          </div>

          <div>
            <button type="submit"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
              S'inscrire
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Ou s'inscrire avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <button (click)="signupGoogle()"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
              Google
            </button>
          </div>
        </div>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Déjà un compte ? 
            <a routerLink="/login" class="font-medium text-green-600 hover:text-green-500">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    try {
      this.errorMessage = '';
      await this.authService.signup(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = "Erreur lors de l'inscription. Cet email est peut-être déjà utilisé.";
      console.error(error);
    }
  }

  async signupGoogle() {
    try {
      this.errorMessage = '';
      await this.authService.loginWithGoogle(); // Gère aussi l'inscription via checkAndCreateUserDocument
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = "Erreur lors de l'inscription avec Google.";
    }
  }

  async signupFacebook() {
    try {
      this.errorMessage = '';
      await this.authService.loginWithFacebook(); // Gère aussi l'inscription via checkAndCreateUserDocument
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = "Erreur lors de l'inscription avec Facebook.";
    }
  }
}
