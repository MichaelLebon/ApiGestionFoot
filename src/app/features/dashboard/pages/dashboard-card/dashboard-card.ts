import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { KeycloakStore } from '../../../../module/keycloak/keycloak-store';

/**
 * Composant de carte de tableau de bord.
 *
 * Affiche les statistiques globales de l'application.
 * Permet la navigation vers les différentes sections.
 */
@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.html',
  styleUrls: ['./dashboard-card.css'],
  imports: [CommonModule],
  standalone: true,
})
export default class DashboardCard implements OnInit {
  /** Statistiques du tableau de bord */
  stats: DashboardStats | null = null;

  /** Chargement des données */
  loading = true;

  /** Store Keycloak */
  readonly keycloakStore = inject(KeycloakStore);

  /** Informations utilisateur */
  readonly user = computed(() => this.keycloakStore.user());

  /** Nom utilisateur */
  readonly username = computed(() => this.keycloakStore.username());

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  /**
   * Chargement des statistiques au démarrage
   */
  ngOnInit(): void {
    console.log('Dashboard init');

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('ERREUR API', err);

        this.loading = false;
      },
    });
  }

  /**
   * Nom affiché dans le dashboard
   */
  displayName(): string {
    return this.username() ?? this.user()?.username ?? this.user()?.firstName ?? 'Utilisateur';
  }

  /**
   * Navigation vers les membres
   */
  goToMembers(): void {
    this.router.navigate(['/membres/affectes']);
  }

  /**
   * Navigation vers les équipes
   */
  goToEquipes(): void {
    this.router.navigate(['/equipes']);
  }

  /**
   * Navigation vers les clubs
   */
  goToClubs(): void {
    this.router.navigate(['/clubs']);
  }

  /**
   * Navigation vers les matchs
   */
  goToMatchs(): void {
    this.router.navigate(['/matchs']);
  }
}
