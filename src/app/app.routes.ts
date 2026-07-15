import { Routes } from '@angular/router';
import { authKeycloakGuard } from './module/keycloak/guards/auth-keycloak.guard';

export const routes: Routes = [
  /**
   * Page publique
   */
  {
    path: '',
    loadComponent: () => import('./features/auth/pages/home-page/home-page'),
  },

  /**
   * Dashboard protégé
   */
  {
    path: 'dashboard',
    canActivate: [authKeycloakGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard-card/dashboard-card'),
  },

  /**
   * Membres affectés
   */
  {
    path: 'membres/affectes',
    canActivate: [authKeycloakGuard],
    loadComponent: () => import('./features/gestion-membres/pages/membres/membres'),
  },

  /**
   * Membres libres
   */
  {
    path: 'membres/libres',
    canActivate: [authKeycloakGuard],
    loadComponent: () => import('./features/gestion-membres/pages/membres-libres/membres-libres'),
  },

  /**
   * Ajout membre
   */
  {
    path: 'membres/membres-ajouts',
    canActivate: [authKeycloakGuard],
    loadComponent: () =>
      import('./features/gestion-membres/components/membres-ajouts/membres-ajouts'),
  },

  /**
   * Route inconnue
   */
  {
    path: '**',
    redirectTo: '',
  },
];
