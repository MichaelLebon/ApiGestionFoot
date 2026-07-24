export interface Club {
  id: string;
  nom: string;
  local: string;
  equipes: string[];
}

export interface ClubRequest {
  nom: string;
  local: string;
}
