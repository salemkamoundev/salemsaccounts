import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { CartService } from '../../core/services/cart.service';
import { environment } from '../../../environments/environment';
// Le service sera créé à l'étape 16, on anticipe son importation
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center mb-10">
          <h1 class="text-3xl font-extrabold text-gray-900">Paiement USDT (Binance)</h1>
          <p class="mt-4 text-lg text-gray-500">
            Veuillez procéder au transfert pour activer votre abonnement.
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2">
            
            <!-- Instructions Binance -->
            <div class="p-8 bg-gray-900 text-white flex flex-col justify-center items-center text-center">
              <div class="mb-6">
                <p class="text-gray-400 text-sm uppercase tracking-wide font-bold mb-1">Montant à transférer</p>
                <p class="text-5xl font-extrabold text-green-400">{{ cartService.totalUSDT() }} <span class="text-2xl">USDT</span></p>
              </div>

              <!-- Fake QR Code (Placeholder) -->
              <div class="bg-white p-4 rounded-xl mb-6 shadow-md">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ walletAddress }}" alt="QR Code Binance" class="w-32 h-32">
              </div>

              <div class="w-full text-left bg-gray-800 p-4 rounded-lg border border-gray-700">
                <p class="text-xs text-gray-400 mb-1">Adresse de réception (TRC20 ou BEP20)</p>
                <p class="text-sm font-mono break-all text-blue-300 font-medium">{{ walletAddress || 'Adresse non configurée dans environment.ts' }}</p>
              </div>
              
              <div class="mt-6 flex items-start text-left text-xs text-red-300 bg-red-900/30 p-3 rounded-lg border border-red-800/50">
                <svg class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>N'envoyez que des USDT sur les réseaux Tron (TRC20) ou BNB Smart Chain (BEP20). Toute autre crypto sera perdue.</p>
              </div>
            </div>

            <!-- Formulaire de preuve de paiement -->
            <div class="p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-6">Confirmer le paiement</h3>
              
              <div *ngIf="errorMessage" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>

              <form (ngSubmit)="submitPayment()" class="space-y-6">
                <!-- Upload Screenshot -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Capture d'écran du transfert</label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600 justify-center">
                        <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1">
                          <span>Téléverser un fichier</span>
                          <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" (change)="onFileSelected($event)">
                        </label>
                      </div>
                      <p class="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 5MB</p>
                    </div>
                  </div>
                  <p *ngIf="selectedFile" class="mt-2 text-sm text-green-600 font-medium flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    {{ selectedFile.name }} sélectionné
                  </p>
                </div>

                <!-- Transaction Hash -->
                <div>
                  <label for="txHash" class="block text-sm font-medium text-gray-700">Hash de transaction (TxID) <span class="text-gray-400 font-normal">- Optionnel si capture</span></label>
                  <input type="text" id="txHash" name="txHash" [(ngModel)]="transactionHash"
                         class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg py-3 px-4 border bg-gray-50 font-mono text-sm"
                         placeholder="Ex: 8a7c...3f2b">
                </div>

                <!-- Bouton de soumission avec état de chargement -->
                <div class="pt-4">
                  <button type="submit" [disabled]="uploading || (!selectedFile && !transactionHash)"
                          class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
                    <span *ngIf="!uploading">Soumettre pour validation</span>
                    <span *ngIf="uploading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement en cours ({{ uploadProgress }}%)...
                    </span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class PaymentComponent implements OnInit {
  cartService = inject(CartService);
  private storage = inject(Storage);
  private router = inject(Router);
  
  // order.service sera implémenté au prochain prompt
  // Pour le moment on utilise "any" pour éviter une erreur de compilation si on lance le projet avant l'étape 16
  private orderService = inject(OrderService);

  walletAddress = environment.binanceWalletUSDT;
  
  // Données de l'étape précédente
  checkoutData: any = null;

  // Formulaire
  selectedFile: File | null = null;
  transactionHash: string = '';
  
  // États UI
  errorMessage = '';
  uploading = false;
  uploadProgress = 0;

  ngOnInit() {
    // Récupérer les données passées par le CheckoutComponent via history.state
    this.checkoutData = history.state.checkoutData;
    
    // Sécurité : si on arrive sur la page sans data ou avec un panier vide, on redirige
    if (!this.checkoutData || this.cartService.itemCount() === 0) {
      this.router.navigate(['/checkout']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async submitPayment() {
    if (!this.selectedFile && !this.transactionHash) {
      this.errorMessage = "Veuillez fournir une capture d'écran ou le Hash de transaction.";
      return;
    }

    this.uploading = true;
    this.errorMessage = '';
    let downloadURL = '';

    try {
      // 1. Upload de l'image vers Firebase Storage s'il y en a une
      if (this.selectedFile) {
        // Chemin: payment_proofs/timestamp_nomfichier
        const filePath = `payment_proofs/${Date.now()}_${this.selectedFile.name}`;
        const storageRef = ref(this.storage, filePath);
        
        const uploadTask = uploadBytesResumable(storageRef, this.selectedFile);

        // Attendre la fin de l'upload et écouter la progression
        downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            }, 
            (error) => {
              console.error("Erreur d'upload", error);
              reject(error);
            }, 
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      // 2. Création de la commande via OrderService
      // Nous l'appellerons dans le prochain script (step16)
      await this.orderService.createOrder(
        this.cartService.items(),
        this.cartService.totalUSDT(),
        this.checkoutData,
        downloadURL,
        this.transactionHash
      );

      // 3. Vider le panier et rediriger vers le dashboard client
      this.cartService.clearCart();
      this.router.navigate(['/dashboard']);

    } catch (error) {
      this.errorMessage = "Une erreur est survenue lors de l'enregistrement de votre paiement. Veuillez réessayer.";
      this.uploading = false;
      console.error(error);
    }
  }
}
