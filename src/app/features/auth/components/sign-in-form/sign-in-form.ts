import { Component, computed, inject } from '@angular/core';
import { KeycloakStore } from '../../../../module/keycloak/keycloak-store';

/**
 * Composant de formulaire de connexion simplifié.
 *
 * Ce composant fournit les fonctionnalités de base pour se connecter
 * et se déconnecter via le service Keycloak. Il affiche également
 * le nom de l'utilisateur actuellement connecté.
 */
@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css',
})
export class SignInForm {

  /**
   * Store Keycloak injecté pour gérer l'état d'authentification.
   */
  readonly keycloakStore = inject(KeycloakStore);

  /**
   * Signal calculé contenant les données de l'utilisateur connecté.
   */
  readonly user = computed(() => this.keycloakStore.user());

  /**
   * Déclenche la procédure de connexion Keycloak.
   */
  login() {
    this.keycloakStore.login();
  }

  /**
   * Déclenche la procédure de déconnexion Keycloak.
   */
  logout() {
    this.keycloakStore.logout();
  }

  /**
   * Récupère le nom d'affichage de l'utilisateur.
   *
   * @returns Le nom d'utilisateur, le prénom ou 'Utilisateur' par défaut.
   */
  userName(): string {
    const user = this.keycloakStore.user();
    return user?.username ?? user?.firstName ?? 'Utilisateur';
  }
}
