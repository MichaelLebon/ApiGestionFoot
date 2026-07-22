import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard-stats.model';
import { KeycloakStore } from '../../../../module/keycloak/keycloak-store';

/**
 * Composant de carte de tableau de bord.
 *
 * Affiche les statistiques globales de l'application récupérées depuis le service Dashboard.
 * Gère également l'affichage du profil de l'utilisateur connecté via Keycloak.
 */
@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.html',
  styleUrls: ['./dashboard-card.css'],
  imports: [CommonModule],
  standalone: true,
})
export default class DashboardCard implements OnInit {
  /** Statistiques du tableau de bord (membres, équipes, matchs, etc.). */
  stats: DashboardStats | null = null;
  /** État de chargement des données. */
  loading = true;

  /** Store Keycloak pour accéder aux données utilisateur. */
  readonly keycloakStore = inject(KeycloakStore);
  /** Signal calculé pour les informations utilisateur. */
  readonly user = computed(() => this.keycloakStore.user());
  /** Signal calculé pour le nom d'utilisateur. */
  readonly username = computed(() => this.keycloakStore.username());

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  /**
   * Initialise le composant en récupérant les statistiques via le DashboardService.
   * Utilise ChangeDetectorRef pour forcer la mise à jour de la vue après la réception des données.
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
   * Retourne le nom à afficher pour l'utilisateur.
   *
   * @returns Le nom d'utilisateur Keycloak ou une valeur par défaut.
   */
  displayName(): string {
    return this.username() ?? this.user()?.username ?? this.user()?.firstName ?? 'Utilisateur';
  }

  /**
   * Navigue vers la page de liste des membres.
   */
  goToMembers(): void {
    console.log(this.router.navigate(['/membres/affectes']));
  }

  goToEquipes(): void {
    console.log(this.router.navigate(['/equipes']));
  }
}


