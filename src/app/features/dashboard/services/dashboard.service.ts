import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Objet de transfert de données pour les statistiques du tableau de bord.
 */
export interface DashboardDto {
  /** Nombre total de membres */
  membres: number;

  /** Nombre total d'équipes */
  equipes: number;

  /** Nombre total de clubs */
  clubs: number;

  /** Nombre de matchs à venir */
  matchsAVenir: number;

  /** Nombre de compétitions en cours ou à venir */
  competitions: number;
}

/**
 * Service gérant la récupération des données du tableau de bord.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /** URL de l'API pour les statistiques du tableau de bord */
  private apiUrl = 'http://localhost:8080/api/dashboard/stats';

  /**
   * @param http Client HTTP d'Angular pour effectuer les requêtes.
   */
  constructor(private http: HttpClient) {}

  /**
   * Récupère les statistiques globales pour le tableau de bord.
   *
   * @returns Un Observable contenant les statistiques du tableau de bord.
   */
  getStats() {
    return this.http.get<DashboardDto>(this.apiUrl);
  }
}
