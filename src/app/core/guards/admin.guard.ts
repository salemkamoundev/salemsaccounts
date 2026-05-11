import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return authState(auth).pipe(
    switchMap(user => {
      if (!user) {
        // Non connecté
        router.navigate(['/login']);
        return of(false);
      }

      // Interroger Firestore pour vérifier le rôle dans salemsaccounts
      const userDocRef = doc(firestore, `users/${user.uid}`);
      return from(getDoc(userDocRef)).pipe(
        map(docSnap => {
          if (docSnap.exists() && docSnap.data()?.['role'] === 'admin') {
            return true; // C'est bien un admin
          } else {
            console.warn('Accès refusé : Rôle admin requis.');
            router.navigate(['/']); // Retour à l'accueil si ce n'est pas un admin
            return false;
          }
        }),
        catchError((error) => {
          console.error('Erreur lors de la vérification du rôle :', error);
          router.navigate(['/']);
          return of(false);
        })
      );
    })
  );
};
