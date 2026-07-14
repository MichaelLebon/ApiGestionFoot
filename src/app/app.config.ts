/**
 * @file app.config.ts
 * @description Configuration globale de l'application Angular.
 * Définit les fournisseurs (providers) essentiels comme le routage, le client HTTP,
 * l'authentification Keycloak et la gestion des thèmes.
 */

import {
  ApplicationConfig,
  inject,
  mergeApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';

import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideTheme } from '../themes/provider.theme';
import { MainTheme } from '../themes/main.theme';
import { ServiceTheme } from '../themes/service.theme';

import { provideKeycloakAngular } from './module/keycloak/keycloak.provider';
import { KeycloakStore } from './module/keycloak/keycloak-store';

/**
 * Configuration locale des fournisseurs de l'application.
 */
const localConfig: ApplicationConfig = {
  providers: [
    // Active la détection de changement sans zone pour de meilleures performances
    provideZonelessChangeDetection(),
    // Fournit des écouteurs d'erreurs globaux pour le navigateur
    provideBrowserGlobalErrorListeners(),

    // Client HTTP pour les appels API
    provideHttpClient(),
    // Service d'authentification Keycloak
    provideKeycloakAngular(),

    // Configuration du routeur avec liaison des paramètres d'entrée aux composants
    provideRouter(routes, withComponentInputBinding()),

    // ─── INITIALISATION DE L'APPLICATION ─────────────────────────────
    /**
     * Initialiseur d'environnement exécuté au démarrage de l'application.
     * Configure Keycloak et le thème par défaut.
     */
    provideEnvironmentInitializer(async () => {
      const theme = inject(ServiceTheme);
      const keycloak = inject(KeycloakStore);

      // ✅ Initialisation asynchrone de Keycloak
      await keycloak.init();

      // Initialisation du thème (par défaut : 'light')
      theme.set('light');
    }),
  ],
};

/**
 * Configuration finale de l'application, fusionnant la configuration locale
 * avec le fournisseur de thème principal.
 */
export const appConfig = mergeApplicationConfig(localConfig, provideTheme(MainTheme, true));
