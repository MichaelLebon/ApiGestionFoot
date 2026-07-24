import { computed, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Club, ClubRequest } from '../models/club.model';

/**
 * Service gérant les opérations liées aux clubs.
 */
@Injectable({
  providedIn: 'root',
})
export class ClubService {
  /** URL de base de l'API */
  private apiUrl = `${environment.apiUrl}/clubs`;
  /**
   * Ressource contenant la liste des clubs.
   */
  clubsResource = httpResource<Club[]>(() => this.apiUrl);
  /**
   * Signal calculé contenant la liste des clubs.
   */
  clubs = computed(() => this.clubsResource.value() ?? []);
  /**
   * @param http Client HTTP Angular.
   */
  constructor(private http: HttpClient) {
    console.log(this.apiUrl);
  }
  /**
   * Récupère un club par son identifiant.
   */
  getById(id: string) {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }
  /**
   * Crée un nouveau club.
   */
  create(club:ClubRequest) {
    return this.http.post<Club>(this.apiUrl, club)
      .pipe(tap(() => this.reload()));
  }
  /**
   * Supprime un club.
   */
  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.reload()));
  }
  /**
   * Recharge la liste des clubs.
   */
   reload() {
    this.clubsResource.reload();
  }
}
