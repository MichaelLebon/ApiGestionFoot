import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Club } from '../models/club.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/clubs`;

  /**
   * Récupère tous les clubs.
   */
  getAll(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }

  /**
   * Récupère un club par son identifiant.
   */
  getById(id: string): Observable<Club> {
    return this.http.get<Club>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau club.
   */
  create(club: Partial<Club>): Observable<Club> {
    return this.http.post<Club>(this.apiUrl, club);
  }

  /**
   * Supprime un club.
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
