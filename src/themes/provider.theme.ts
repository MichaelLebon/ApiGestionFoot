import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

import { ServiceTheme } from './service.theme';
import { IS_DARK } from './theme.tokens';

/**
 * Fournit la configuration globale du thème pour l'application.
 * Configure PrimeNG, le service de thème personnalisé et les injections de dépendances nécessaires.
 *
 * @param theme - Le preset de thème à utiliser (ex: MainTheme).
 * @param isDark - État initial du mode sombre (par défaut: false).
 * @returns Un objet ApplicationConfig contenant les providers configurés.
 */
export const provideTheme = (theme: any, isDark: boolean = false): ApplicationConfig => {
  return {
    providers: [
      /**
       * PrimeNG global config
       */
      providePrimeNG({
        theme: {
          preset: theme,
          options: {
            darkModeSelector: '.dark',
            cssLayer: {
              name: 'primeng',
              order: 'theme, base, primeng',
            },
          },
        },
      }),

      /**
       * Injecte le boolean dark mode initial
       */
      {
        provide: IS_DARK,
        useValue: isDark,
      },

      /**
       * Theme service runtime
       */
      ServiceTheme,

      /**
       * Toast / messages PrimeNG
       */
      MessageService,
    ],
  };
};
