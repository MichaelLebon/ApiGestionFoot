import { Component, signal } from '@angular/core';
import { SignInForm } from '../sign-in-form/sign-in-form';

/**
 * Composant principal de la carte d'accueil.
 *
 * Gère l'état courant de la carte affichée (connexion, inscription,
 * mot de passe oublié, etc.) à l'aide d'un Signal Angular.
 *
 * Le composant reçoit les changements d'état depuis les composants
 * enfants et met à jour l'affichage en conséquence.
 */
@Component({
  selector: 'app-home-card',
  standalone: true,
  imports: [SignInForm],
  templateUrl: './home-card.html',
  styleUrl: './home-card.css',
})
export class HomeCard {
  /**
   * État actuel de la carte affichée.
   * Initialisé sur la vue principale de connexion.
   */
  // homeCardState = signal<CardType>('home-card');

}
