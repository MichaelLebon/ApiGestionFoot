import { InjectionToken } from '@angular/core';

/**
 * Jeton d'injection (InjectionToken) Angular permettant d'injecter la configuration initiale du mode sombre.
 * Reçoit une valeur booléenne : true pour le mode sombre, false pour le mode clair.
 */
export const IS_DARK = new InjectionToken<boolean>('IS_DARK');
