import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakStore } from '../keycloak-store';

export const authKeycloakGuard: CanActivateFn = async () => {
  const store = inject(KeycloakStore);
  const router = inject(Router);

  /**
   * Attendre que Keycloak soit prêt
   */
  if (!store.ready()) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (store.ready()) {
          clearInterval(interval);
          resolve(true);
        }
      }, 50);
    });
  }

  /**
   * Utilisateur connecté
   */
  if (store.authenticated()) {
    return true;
  }

  /**
   * Pas connecté
   */
  router.navigate(['/']);

  return false;
};
