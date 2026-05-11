import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  orderBy
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  /**
   * Créer une nouvelle commande suite au paiement Binance
   */
  async createOrder(items: any[], totalUSDT: number, checkoutData: any, proofUrl: string, txHash: string) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("L'utilisateur doit être connecté pour passer une commande.");
    }

    const ordersCollection = collection(this.firestore, 'orders');
    
    // Construction de l'objet de commande
    const newOrder = {
      userId: user.uid,
      items: items,
      totalUSDT: totalUSDT,
      checkoutDetails: checkoutData, // Contient deliveryEmail, deviceType, etc.
      status: 'pending_payment', // Statut en attente de validation manuelle
      paymentProofUrl: proofUrl || null,
      transactionHash: txHash || null,
      createdAt: Date.now() // Utilisation du timestamp local pour correspondre au modèle (number)
    };

    return await addDoc(ordersCollection, newOrder);
  }

  /**
   * Récupérer les commandes de l'utilisateur connecté (Espace Client)
   */
  async getUserOrders(): Promise<Order[]> {
    const user = this.auth.currentUser;
    if (!user) return [];

    const ordersRef = collection(this.firestore, 'orders');
    // On récupère uniquement les commandes du client
    const q = query(ordersRef, where('userId', '==', user.uid));
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    // Tri en mémoire (le plus récent en premier) pour éviter de devoir créer un index Firestore complexe
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Récupérer TOUTES les commandes (Pour le Back Office Admin)
   */
  async getAllOrders(): Promise<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    return orders.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Mettre à jour le statut d'une commande (ex: passer de pending_payment à delivered)
   */
  async updateOrderStatus(orderId: string, status: Order['status'], activationCode?: string) {
    const orderDoc = doc(this.firestore, `orders/${orderId}`);
    const updateData: any = { status };
    
    if (activationCode) {
      updateData.activationCode = activationCode;
    }
    
    return await updateDoc(orderDoc, updateData);
  }
}
