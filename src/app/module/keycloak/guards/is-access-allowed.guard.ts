import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

/**
 * Fonction interne vérifiant si l'utilisateur connecté possède le rôle requis
 * pour accéder à une route (ex: ADMIN, JOUEUR, COACH).
 *
 * ✅ Ne déclenche aucune initialisation de Keycloak ici : `authData` est fourni
 * par `createAuthGuard`, qui s'appuie sur l'instance Keycloak déjà initialisée
 * globalement via `provideKeycloak()` au bootstrap de l'application.
 *
 * @param route L'instantané de la route activée (non utilisé ici)
 * @param _ L'instantané de l'état du routeur (non utilisé)
 * @param authData Données d'authentification fournies par keycloak-angular
 * @param role Le rôle requis pour accéder à la route (ex: 'ADMIN')
 * @returns true si l'accès est autorisé, false sinon (redirection gérée par login())
 */
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData,
  role: string,
): Promise<boolean | UrlTree> => {
  const { keycloak } = authData;

  // ─── PAS CONNECTÉ → REDIRECTION LOGIN ───────────────────
  if (!keycloak.authenticated) {
    await keycloak.login();
    return false;
  }

  // ─── VÉRIFICATION DU RÔLE (realm OU resource/client) ───
  // hasRealmRole  : rôle défini au niveau du realm (partagé entre plusieurs clients)
  // hasResourceRole : rôle défini au niveau du client (spécifique à cette appli)
  // Suffisant pour un modèle simple ADMIN / JOUEUR / COACH.
  return keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role);
};

// ─── Export ───────────────────────────────────────────────────────────────────

/**
 * Factory créant un guard Angular pour restreindre l'accès à une route
 * selon un rôle Keycloak donné.
 *
 * Utilise `createAuthGuard` de `keycloak-angular`, qui injecte automatiquement
 * `authData` (instance Keycloak + état d'authentification) dans la fonction
 * de vérification, sans avoir besoin d'appeler `inject()` manuellement.
 *
 * Usage dans les routes :
 * ```ts
 * {
 *   path: 'admin',
 *   canActivate: [isAllowedGuard('ADMIN')],
 *   loadComponent: () => import('./admin.component'),
 * }
 * ```
 *
 * @param role Le rôle nécessaire pour activer la route (ex: 'ADMIN', 'COACH')
 * @returns Un guard de type CanActivateFn utilisable dans la config des routes
 */
export const isAllowedGuard = (role: string) =>
  createAuthGuard<CanActivateFn>((route, state, authData) =>
    isAccessAllowed(route, state, authData, role),
  );
