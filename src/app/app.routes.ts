/**
 * @file app.routes.ts
 * @description Définition des routes de l'application Angular.
 * Ce fichier gère la navigation entre les différentes pages de l'application.
 */

import { Routes } from '@angular/router';
import { authKeycloakGuard } from './module/keycloak/guards/auth-keycloak.guard';

/**
 * Configuration des routes de l'application.
 * Chaque route associe un chemin à un composant chargé de manière asynchrone (lazy loading).
 */
export const routes: Routes = [
  {
    // Page d'accueil
    path: '',
    loadComponent: () => import('./features/auth/pages/home-page/home-page'),
  },
  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard-card/dashboard-card'),
  },

  {
    // Page de gestion des membres
    path: 'membres/affectes',
    loadComponent: () => import('./features/gestion-membres/pages/membres/membres'),
  },
  {
    // Page des membres libres
    path: 'membres/libres',
    loadComponent: () => import('./features/gestion-membres/pages/membres-libres/membres-libres'),
  },
  {
    // Page des membres libres
    path: 'membres/membres-ajouts',
    loadComponent: () => import('./features/gestion-membres/components/membres-ajouts/membres-ajouts'),
  },
];
