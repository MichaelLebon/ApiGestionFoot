import { Component, computed, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { KeycloakStore } from '../../module/keycloak/keycloak-store';

/**
 * Composant de barre de navigation principal de l'application.
 *
 * Il affiche les différents menus de navigation
 * et les informations de l'utilisateur connecté via Keycloak.
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
   * Store Keycloak.
   */
  readonly keycloakStore = inject(KeycloakStore);

  /**
   * Keycloak est-il prêt ?
   */
  readonly ready = computed(() => this.keycloakStore.ready());

  /**
   * Utilisateur connecté.
   */
  readonly user = computed(() => this.keycloakStore.user());

  /**
   * Nom d'utilisateur.
   */
  readonly username = computed(() => this.keycloakStore.username());

  /**
   * L'utilisateur est-il connecté ?
   */
  readonly isAuth = computed(() => this.keycloakStore.authenticated());

  /**
   * Eléments du menu.
   */
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
      },

      {
        label: 'Membres',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Tous les membres',
            icon: 'pi pi-list',
            routerLink: '/membres/affectes',
          },
          {
            label: 'Membre(s) libres',
            icon: 'pi pi-user-minus',
            routerLink: '/membres/libres',
          },
        ],
      },

      {
        label: 'Équipes',
        icon: 'pi pi-sitemap',
        items: [
          {
            label: 'Liste des équipes',
            icon: 'pi pi-users',
            routerLink: '/equipes',
          },
        ],
      },

      {
        label: 'Clubs',
        icon: 'pi pi-building',
        items: [
          {
            label: 'Liste des clubs',
            icon: 'pi pi-building',
            routerLink: '/clubs',
          },
        ],
      },

      {
        label: 'Matchs',
        icon: 'pi pi-trophy',
        items: [
          {
            label: 'Calendrier',
            icon: 'pi pi-calendar',
            routerLink: '/matchs',
          },
          {
            label: 'Nouveau match',
            icon: 'pi pi-plus',
            routerLink: '/matchs/create',
          },
        ],
      },
    ];
  }

  /**
   * Déconnecte l'utilisateur.
   */
  logout(): void {
    this.keycloakStore.logout();
  }

  /**
   * Nom affiché dans la barre de navigation.
   */
  displayName(): string {
    return this.username() ?? this.user()?.username ?? this.user()?.firstName ?? 'Utilisateur';
  }
}
