import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { KeycloakStore } from '../keycloak-store';
import { inject } from '@angular/core';

/**
 * Fonction interne pour vérifier si l'accès est autorisé pour un rôle donné.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion.
 * 
 * @param route L'instantané de la route activée
 * @param _ L'instantané de l'état du routeur (inutilisé)
 * @param authData Données d'authentification fournies par KeycloakAngular
 * @param role Le rôle requis pour accéder à la route
 * @returns Un booléen ou une UrlTree indiquant si l'accès est autorisé
 */
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData,
  role: string,
): Promise<boolean | UrlTree> => {
  const { keycloak } = authData; // ✅ keycloak vient de authData, pas de inject()
  const  store = inject(KeycloakStore)

  if (!keycloak.authenticated) {
    await keycloak.login(); // ✅ redirige vers login si non authentifié
    return false;
  }

  // ✅ vérifie le rôle realm OU resource
  return (
    keycloak.hasRealmRole(role) ||
    keycloak.hasResourceRole(role) ||
    (store as any).getGroups().includes(role)
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────

/**
 * Factory créant un guard pour vérifier si l'utilisateur possède un rôle spécifique.
 * Utilise `createAuthGuard` de `keycloak-angular`.
 * 
 * @param role Le rôle nécessaire pour activer la route
 * @returns Un guard de type CanActivateFn
 */
export const isAllowedGuard = (role: string) =>
  createAuthGuard<CanActivateFn>((route, state, authData) =>
    isAccessAllowed(route, state, authData, role),
  );
