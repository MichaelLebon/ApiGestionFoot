import { Injectable, computed } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Club, ClubRequest } from '../models/club.model';

@Injectable({
  providedIn: 'root',
})
export class ClubsService {
  private readonly apiUrl = `${environment.apiUrl}/clubs`;
  clubsResource = httpResource<Club[]>(() => this.apiUrl);
  clubs = computed(() => this.clubsResource.value() ?? []);
  constructor(private http: HttpClient) {}
  createClub(request: ClubRequest) {
    return this.http.post<Club>(this.apiUrl, request);
  }
  reload() {
    this.clubsResource.reload();
  }
}
