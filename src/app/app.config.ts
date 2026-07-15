/**
 * @file app.config.ts
 * @description Configuration globale de l'application Angular.
 *
 * Cette configuration enregistre les principaux providers :
 * - le routeur
 * - le client HTTP
 * - l'authentification Keycloak
 * - le système de thème
 * - la configuration générale de l'application
 *
 * IMPORTANT :
 * Depuis keycloak-angular 21, l'initialisation de Keycloak est réalisée
 * automatiquement par provideKeycloak() via les initOptions définies dans
 * keycloak.provider.ts.
 *
 * Il ne faut donc plus appeler keycloak.init() ici.
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

/**
 * ------------------------------------------------------------------------
 * Configuration locale de l'application
 * ------------------------------------------------------------------------
 */
const localConfig: ApplicationConfig = {
  providers: [
    /**
     * Active le mode "zoneless".
     * Angular ne dépend plus de zone.js et utilise les Signals
     * pour déclencher les mises à jour de l'interface.
     */
    provideZonelessChangeDetection(),

    /**
     * Active les gestionnaires globaux d'erreurs.
     * Les erreurs non interceptées sont correctement remontées
     * par Angular.
     */
    provideBrowserGlobalErrorListeners(),

    /**
     * Active le client HTTP utilisé pour communiquer avec
     * le backend Spring Boot.
     */
    provideHttpClient(),

    /**
     * Configure entièrement Keycloak.
     *
     * Ce provider :
     *  - crée l'instance Keycloak
     *  - appelle automatiquement kc.init(...)
     *  - configure les intercepteurs HTTP
     *  - active le rafraîchissement automatique du token
     *
     * Il est inutile d'appeler init() ailleurs.
     */
    provideKeycloakAngular(),

    /**
     * Configuration du routeur Angular.
     *
     * withComponentInputBinding() permet d'injecter directement
     * les paramètres des routes dans les @Input() des composants.
     */
    provideRouter(routes, withComponentInputBinding()),

    /**
     * --------------------------------------------------------------------
     * Initialisation de l'application
     * --------------------------------------------------------------------
     *
     * Cette fonction est exécutée une seule fois au démarrage.
     *
     * On initialise uniquement les services applicatifs qui ne sont
     * pas déjà gérés automatiquement.
     *
     * Ici :
     *  - application du thème par défaut.
     *
     * AUCUNE initialisation de Keycloak n'est réalisée ici.
     */
    provideEnvironmentInitializer(() => {
      const theme = inject(ServiceTheme);

      /**
       * Thème appliqué au démarrage.
       *
       * Valeurs possibles selon ton projet :
       *  - "light"
       *  - "dark"
       */
      theme.set('light');
    }),
  ],
};

/**
 * ------------------------------------------------------------------------
 * Configuration finale de l'application
 * ------------------------------------------------------------------------
 *
 * Fusionne :
 *  - la configuration locale
 *  - le fournisseur du thème principal
 */
export const appConfig = mergeApplicationConfig(localConfig, provideTheme(MainTheme, true));
