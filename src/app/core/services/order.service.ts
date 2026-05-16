import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc, orderBy } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async createOrder(items: any[], totalUSDT: number, checkoutData: any, paymentProofUrl: string, txHash: string) {
    // Utilisation de this.auth.currentUser au lieu de authService.currentUserValue
    const user = this.auth.currentUser;
    if (!user) throw new Error("Vous devez être connecté pour passer une commande.");

    const orderRef = collection(this.firestore, 'orders');
    
    const newOrder = {
      userId: user.uid,
      userEmail: checkoutData.email,
      items: items,
      totalUSDT: totalUSDT,
      device: checkoutData.device,
      appPreference: checkoutData.appPreference,
      paymentProof: paymentProofUrl,
      txHash: txHash,
      status: 'pending_payment',
      subscriptionCode: null,
      createdAt: serverTimestamp()
    };

    return await addDoc(orderRef, newOrder);
  }

  // Ajout de Promise<any[]> et as any pour satisfaire le compilateur strict
  async getUserOrders(): Promise<any[]> {
    const user = this.auth.currentUser;
    if (!user) return [];

    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where("userId", "==", user.uid), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  }

  async getAllOrders(): Promise<any[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
  }

  async updateOrderStatus(orderId: string, status: string, subscriptionCode?: string) {
    const orderDoc = doc(this.firestore, `orders/${orderId}`);
    const updateData: any = { status };
    
    if (subscriptionCode) {
      updateData.subscriptionCode = subscriptionCode;
    }
    
    return await updateDoc(orderDoc, updateData);
  }
}
