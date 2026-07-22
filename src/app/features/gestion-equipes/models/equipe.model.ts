export type CategorieEquipe = 'SENIOR' | 'U21' | 'U18' | 'U15' | 'U13' | 'U11' | 'U9';

export interface Club {
  id: string;
  nom: string;
}

export interface Equipe {
  id: string;
  nom: string;
  categorie: CategorieEquipe;
  nom_du_club: string | null;
}

export interface MembreEquipe {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  dateDeNaissance: string;
  roles: string[];
  statut: string;
}

export interface EquipeRequest {
  nom: string;
  categorie: CategorieEquipe;
  club_id: string;
}
