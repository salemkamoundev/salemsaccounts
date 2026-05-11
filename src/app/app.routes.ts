import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // --- CATALOGUE (Public) ---
  {
    path: '',
    loadComponent: () => import('./features/catalog/home/home.component').then(m => m.HomeComponent),
    title: 'Accueil - SalemsAccounts'
  },
  {
    path: 'catalog',
    loadComponent: () => import('./features/catalog/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Catalogue - SalemsAccounts'
  },
  {
    path: 'catalog/:id',
    loadComponent: () => import('./features/catalog/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Détail du produit'
  },

  // --- AUTHENTIFICATION (Public) ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Connexion - SalemsAccounts'
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent),
    title: 'Inscription - SalemsAccounts'
  },

  // --- CHECKOUT & ESPACE CLIENT (Protégé par AuthGuard) ---
  {
  { 
    path: 'payment', 
    loadComponent: () => import('./features/checkout/payment.component').then(m => m.PaymentComponent), 
    canActivate: [authGuard], 
    title: 'Paiement USDT' 
  }, 
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'Finaliser la commande'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/client/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent),
    canActivate: [authGuard],
    title: 'Mes Commandes'
  },

  // --- BACK OFFICE ADMIN (Protégé par AdminGuard) ---
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    title: 'Back Office - SalemsAccounts',
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
      },
      { 
      { 
        path: 'categories', 
        loadComponent: () => import('./features/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent) 
      }, 
        path: 'products', 
        loadComponent: () => import('./features/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent) 
      },
      { 
        path: 'orders', 
        loadComponent: () => import('./features/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent) 
      }
    ]
  },

  // --- REDIRECTION PAR DÉFAUT ---
  {
    path: '**',
    redirectTo: ''
  }
];
