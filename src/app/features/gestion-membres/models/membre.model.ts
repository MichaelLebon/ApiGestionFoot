/** * Représente un membre du système. */
export interface Membre {
  /** Identifiant unique du membre */
  id: string;
  /** Prénom du membre */
  prenom: string;
  /** Nom de famille du membre */
  nom: string;
  /** Adresse e-mail du membre */
  email: string;
  /** Date de naissance au format string */
  dateDeNaissance: string;
  /** Liste des rôles assignés au membre */
  roles: string[];
  /** Statut actuel du membre (ex: actif, inactif) */
  statut: string;
  /** Équipe à laquelle le membre est rattaché */
  equipe: string;
  /** Club auquel le membre appartient */
  club: string;
}

export interface MembreRequest {
  /** Prénom du membre */
  prenom: string;
  /** Nom de famille du membre */
  nom: string;
  /** Adresse e-mail du membre */
  email: string;
  /** Date de naissance au format string */
  dateDeNaissance: string;
  /** Liste des rôles assignés au membre */
  roles: string[];
}
