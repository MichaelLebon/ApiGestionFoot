// Import du thème de base Lara
import Lara from '@primeuix/themes/lara';

// Fonction pour créer un thème custom basé sur Lara
import { definePreset } from '@primeuix/themes';

/**
 * Thème principal de l'application.
 * Définit le design system global en se basant sur le thème Lara de PrimeNG.
 * Permet de surcharger les couleurs, espacements et autres variables de style.
 */
export const MainTheme = definePreset(Lara, {

});
