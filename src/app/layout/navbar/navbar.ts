import { Component, computed, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { KeycloakStore } from '../../module/keycloak/keycloak-store';
import { RouterModule } from '@angular/router';

/**
 * Composant de barre de navigation principal de l'application.
 *
 * Ce composant affiche les différents menus de navigation
 * (Dashboard, Membres, Équipes, Matchs, Paramètres)
 * et gère les informations de l'utilisateur authentifié via Keycloak.
 *
 * Il permet également la déconnexion de l'utilisateur connecté.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  imports: [CommonModule, BadgeModule, MenubarModule, InputTextModule, RippleModule, RouterModule],
})
export class MenubarBasicDemo implements OnInit {
  /**
   * Store Keycloak permettant d'accéder aux informations
   * d'authentification et aux actions de session.
   */
  readonly keycloakStore = inject(KeycloakStore);

  /**
   * Indique si l'initialisation de Keycloak est terminée.
   */
  readonly ready = computed(() => this.keycloakStore.ready());

  /**
   * Informations complètes de l'utilisateur connecté.
   */
  readonly user = computed(() => this.keycloakStore.user());

  /**
   * Nom d'utilisateur récupéré depuis Keycloak.
   */
  readonly username = computed(() => this.keycloakStore.username());

  /**
   * Indique si l'utilisateur est authentifié.
   */
  readonly isAuth = computed(() => this.keycloakStore.authenticated());

  /**
   * Liste des éléments affichés dans la barre de navigation.
   */
  items: MenuItem[] = [];

  /**
   * Initialise les éléments du menu lors du chargement du composant.
   */
  ngOnInit(): void {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },

      {
        label: 'Membres',
        icon: 'pi pi-users',
        items: [
          { label: 'Tous les membres', icon: 'pi pi-list', routerLink: '/membres/affectes' },
          { label: 'Membre(s) libres', icon: 'pi pi-list', routerLink: '/membres/libres' },
        ],
      },

      {
        label: 'Équipes',
        icon: 'pi pi-sitemap',
        items: [
          { label: 'Liste des équipes', icon: 'pi pi-users', routerLink: '/equipes' },
          { label: 'Créer une équipe', icon: 'pi pi-plus-circle', routerLink: '/equipes/create' },
        ],
      },

      {
        label: 'Matchs',
        icon: 'pi pi-trophy',
        items: [
          { label: 'Calendrier', icon: 'pi pi-calendar', routerLink: '/matchs' },
          { label: 'Nouveau match', icon: 'pi pi-plus', routerLink: '/matchs/create' },
        ],
      },

      {
        label: 'Paramètres',
        icon: 'pi pi-cog',
        routerLink: '/settings',
      },
    ];
  }

  /**
   * Déconnecte l'utilisateur actuellement authentifié
   * et le redirige vers la page d'accueil.
   */
  logout(): void {
    this.keycloakStore.logout();
  }

  /**
   * Retourne le nom à afficher dans l'interface utilisateur.
   *
   * Priorité :
   * 1. Nom d'utilisateur Keycloak
   * 2. Username de l'utilisateur
   * 3. Prénom de l'utilisateur
   * 4. Valeur par défaut "Utilisateur"
   *
   * @returns Le nom affiché dans la barre de navigation.
   */
  displayName(): string {
    return this.username() ?? this.user()?.username ?? this.user()?.firstName ?? 'Utilisateur';
  }
}
