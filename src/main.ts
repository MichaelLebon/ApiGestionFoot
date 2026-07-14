/**
 * @file main.ts
 * @description Point d'entrée principal de l'application Angular.
 * Ce fichier est responsable du démarrage (bootstrap) de l'application.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/container/app';

/**
 * Initialise l'application Angular en utilisant le composant racine 'App'
 * et la configuration définie dans 'appConfig'.
 */
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
