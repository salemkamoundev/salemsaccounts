import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  signOut,
  authState
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // Observable pour suivre l'état de l'utilisateur connecté
  user$ = authState(this.auth);

  // --- LOGIN CLASSIQUE ---
  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // --- INSCRIPTION CLASSIQUE ---
  async signup(email: string, pass: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    await this.createUserDocument(credential.user.uid, email);
    return credential;
  }

  // --- LOGIN GOOGLE ---
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    await this.checkAndCreateUserDocument(credential.user.uid, credential.user.email);
    return credential;
  }

  // --- LOGIN FACEBOOK ---
  async loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    await this.checkAndCreateUserDocument(credential.user.uid, credential.user.email);
    return credential;
  }

  // --- DÉCONNEXION ---
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // --- MÉTHODES PRIVÉES FIRESTORE ---

  // Crée le document utilisateur avec le rôle par défaut
  private async createUserDocument(uid: string, email: string | null) {
    const userRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userRef, {
      email: email,
      role: 'user', // Par défaut
      createdAt: serverTimestamp()
    });
  }

  // Vérifie si le document existe (utile pour les logins sociaux) et le crée si besoin
  private async checkAndCreateUserDocument(uid: string, email: string | null) {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await this.createUserDocument(uid, email);
    }
  }
}
