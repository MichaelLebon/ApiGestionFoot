import { Injectable, Inject } from '@angular/core';
import { IS_DARK } from './theme.tokens';

/**
 * Service de gestion du thème (sombre/clair).
 * Manipule la classe "dark" sur l'élément racine <html> pour basculer entre les modes.
 */
@Injectable({ providedIn: 'root' })
export class ServiceTheme {
  /**
   * Initialise le service avec l'état du mode sombre injecté.
   * @param isDark - L'état initial du mode sombre.
   */
  constructor(@Inject(IS_DARK) private isDark: boolean) {
    console.log('THEME_SERVICE INIT');

    this.set(this.isDark ? 'dark' : 'light');
  }

  /**
   * Applique manuellement un thème spécifique.
   * @param theme - Le thème à appliquer ('dark' ou 'light').
   */
  set(theme: 'dark' | 'light') {
    const html = document.documentElement;

    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  /**
   * Bascule entre le mode sombre et le mode clair.
   */
  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  /**
   * Vérifie si le mode sombre est actuellement actif.
   * @returns true si le thème sombre est actif, false sinon.
   */
  isDarkTheme(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}
