import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Membre, MembreRequest } from '../models/membre.model';

/**
 * Service gérant les opérations liées aux membres.
 */
@Injectable({
  providedIn: 'root',
})
export class MembreService {
  /** URL de base de l'API */
  private apiUrl = `${environment.apiUrl}/membres`;

  membresAffectesResource = httpResource<Membre[]>(() => `${this.apiUrl}/affectes`);
  membresAffectes = computed(() => this.membresAffectesResource.value() ?? []);
  membresLibresResource = httpResource<Membre[]>(() => `${this.apiUrl}/libres`);
  membresLibres = computed(() => this.membresLibresResource.value() ?? []);
  membresInactifsResource = httpResource<Membre[]>(() => `${this.apiUrl}/inactifs`);
  membresInactifs = computed(() => this.membresInactifsResource.value() ?? []);
  /**
   * @param http Client HTTP d'Angular pour effectuer les requêtes.
   */
  constructor(private http: HttpClient) {
    console.log(this.apiUrl);
  }
  /**
   * Récupère la liste de tous les membres.
   * @returns Un Observable contenant un tableau de membres.
   */
  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  /**
   * Récupère un membre par son identifiant.
   * @param id L'identifiant unique du membre.
   * @returns Un Observable contenant les données du membre.
   */
  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteMember(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  create(membre: MembreRequest) {
    return this.http.post(this.apiUrl, membre);
  }
  assignMemberToTeam(membre: Membre, equipeId: string) {
    return this.http.post(`${this.apiUrl}/${membre.id}/equipe/${equipeId}`, membre);
  }
  activateMember(membre: Membre) {
    this.http.put<Membre>(`${this.apiUrl}/${membre.id}/activate`, {}).subscribe()
  }
}
