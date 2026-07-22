import { computed, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Equipe, EquipeRequest, MembreEquipe } from '../models/equipe.model';

@Injectable({
  providedIn: 'root',
})
export class EquipesService {
  private readonly apiUrl = `${environment.apiUrl}/equipes`;

  // ================= RESSOURCE =================

  equipesResource = httpResource<Equipe[]>(() => this.apiUrl);

  equipes = computed(() => this.equipesResource.value() ?? []);

  isLoading = computed(() => this.equipesResource.isLoading());

  error = computed(() => this.equipesResource.error());

  constructor(private http: HttpClient) {}

  // ================= GET =================

  getAllEquipes() {
    return this.http.get<Equipe[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<Equipe>(`${this.apiUrl}/${id}`);
  }

  getMembresEquipe(id: string) {
    return this.http.get<MembreEquipe[]>(`${this.apiUrl}/${id}/membres`);
  }

  // ================= CREATE =================

  createEquipe(request: EquipeRequest) {
    return this.http.post<Equipe>(this.apiUrl, request).pipe(tap(() => this.reload()));
  }

  // ================= UPDATE =================

  updateClub(equipeId: string, clubId: string) {
    return this.http
      .put<Equipe>(`${this.apiUrl}/${equipeId}/club/${clubId}`, {})
      .pipe(tap(() => this.reload()));
  }

  // ================= DELETE =================

  deleteEquipe(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(tap(() => this.reload()));
  }

  // ================= RELOAD =================

  reload(): void {
    this.equipesResource.reload();
  }
}
