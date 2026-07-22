/**
 * Modèle représentant les statistiques du tableau de bord.
 */
export interface DashboardStats {
  /** Nombre total de membres */
  membres: number;

  /** Nombre total d'équipes */
  equipes: number;

  /** Nombre total de clubs */
  clubs: number;

  /** Nombre de matchs à venir */
  matchsAVenir: number;

  /** Nombre de compétitions */
  competitions: number;
}
