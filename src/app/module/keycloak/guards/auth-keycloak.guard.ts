import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakStore } from '../keycloak-store';

/**
 * Guard vérifiant si l'utilisateur est authentifié avec Keycloak.
 * Si Keycloak n'est pas initialisé, il tente de l'initialiser.
 * Si l'utilisateur n'est pas connecté, il est redirigé vers la page de login.
 * 
 * @param route La route activée
 * @param state L'état du routeur
 * @returns true si l'utilisateur est authentifié, sinon redirige vers /login
 */
export const authKeycloakGuard: CanActivateFn = async (route, state) => {
  const store = inject(KeycloakStore);
  const router = inject(Router);

  // ─── INIT ───────────────────────────────
  if (!store.initialized()) {
    await store.init();
  }

  // ─── SI CONNECTÉ → OK ───────────────────
  if (store.authenticated()) {
    return true;
  }

  // ─── ❌ PAS CONNECTÉ → REDIRECT LOGIN ───
  await router.navigate(['/login']);

  return false;
};
