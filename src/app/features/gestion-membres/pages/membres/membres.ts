import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MembreService } from '../../services/membres.service';
import { Membre } from '../../models/membre.model';

/**
 * =========================================================
 * GESTION DES MEMBRES
 * =========================================================
 * membersAffectes pointe directement vers le signal computed
 * du service (sans l'appeler) : filteredList se recalcule
 * automatiquement dès que la donnée HTTP arrive, y compris
 * au tout premier chargement.
 */
@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './membres.html',
  styleUrls: ['./membres.css'],
})
export default class MembresComponent {
  // ================= DATA =================

  membreService = inject(MembreService);

  membersAffectes = this.membreService.membresAffectes;
  selectedMember: any = null;

  search = signal('');
  filterRole = signal('');

  private apiUrl = 'http://localhost:8080/api/membres';

  constructor(private http: HttpClient) {}

  // ================= FILTER =================

  filteredList = computed(() => this.filterList(this.membersAffectes()));

  filterList(listMembre: Membre[]): Membre[] {
    const term = this.search().toLowerCase();
    const role = this.filterRole();

    return (listMembre ?? []).filter((membre) => {
      const fullName = `${membre.prenom} ${membre.nom}`.toLowerCase();

      return (!term || fullName.includes(term)) && (!role || membre.roles.includes(role));
    });
  }

  // ================= DETAIL =================

  openDetail(member: any): void {
    for (const mb of this.membersAffectes()) {
      if (mb.id === member.id) {
        this.selectedMember = mb;
      }
    }
  }

  closeModal(): void {
    this.selectedMember = null;
  }

  // ================= DELETE =================

  deleteMember(id: string): void {
    if (!confirm('Supprimer ce membre ?')) {
      return;
    }

    this.membreService.deleteMember(id).subscribe({
      next: () => {
        alert('Membre supprimé avec succès.');

        this.selectedMember = null;

        this.membreService.membresAffectesResource.reload();
      },

      error: (err) => {
        console.error(err);

        alert('Erreur lors de la suppression du membre.');
      },
    });
  }

  // ================= TEAM =================

  assignTeam(member: any): void {
    const id = prompt('ID équipe ?');
    if (!id) return;

    this.http.post(`${this.apiUrl}/${member.id}/equipes/${id}`, {}).subscribe({
      next: () => this.membreService.membresAffectesResource.reload(),
      error: (err) => console.error(err),
    });
  }

  removeFromTeam(member: any): void {
    if (!confirm('Retirer de l’équipe ?')) return;

    this.http.delete(`${this.apiUrl}/${member.id}/equipes`).subscribe({
      next: () => this.membreService.membresAffectesResource.reload(),
      error: (err) => console.error(err),
    });
  }

  // ================= ROLES =================

  manageRoles(member: any): void {
    const action = prompt('1 = Ajouter / 2 = Supprimer');
    if (!action) return;

    const role = prompt('ROLE (JOUEUR / COACH / ADMIN)');
    if (!role) return;

    const url = `${this.apiUrl}/${member.id}/roles/${role}`;

    let req = null;

    if (action === '1') req = this.http.post(url, {});
    else if (action === '2') req = this.http.delete(url);

    if (!req) return;

    req.subscribe({
      next: () => this.membreService.membresAffectesResource.reload(),
      error: (err) => console.error(err),
    });
  }
}
