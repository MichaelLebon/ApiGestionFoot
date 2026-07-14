import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, httpResource } from '@angular/common/http';
import { MembreService } from '../../services/membres.service';
import { Membre } from '../../models/membre.model';
import { constructorParametersDownlevelTransform } from '@angular/compiler-cli';

/**
 * =========================================================
 * GESTION DES MEMBRES - VERSION STABLE
 * =========================================================
 * - pas de ChangeDetectorRef
 * - pas de queueMicrotask
 * - pas de NG0100
 * - structure simple Angular
 */
@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './membres.html',
  styleUrls: ['./membres.css'],
})
export default class MembresComponent implements OnInit {
  // ================= DATA =================

  membreService = inject(MembreService);

  membersAffectes: Membre[] | undefined = this.membreService.membresAffectes();
  filteredList = signal<Membre[]>([]);
  selectedMember: any = null;

  search = '';
  filterRole = '';

  private apiUrl = 'http://localhost:8080/api/membres';

  constructor(private http: HttpClient) {}

  // ================= INIT =================

  ngOnInit(): void {
    this.applyFilter();
  }

  // ================= LOAD =================

  loadMembers(): void {
    this.http.get<any[]>(`${this.apiUrl}/affectes`).subscribe({
      next: (data) => {
        this.membersAffectes = data;
        this.applyFilter();
      },
      error: (err) => console.error(err),
    });
  }


  // ================= FILTER =================
  applyFilter(): void {
    const searchLower = this.search.toLowerCase();

    const membreList = (this.membersAffectes ?? []).filter((membre) => {
      const fullName = `${membre.prenom} ${membre.nom}`.toLowerCase();

      return (
        (!this.search || fullName.includes(searchLower)) &&
        (!this.filterRole || membre.roles.includes(this.filterRole))
      );
    });

    this.filteredList.set(membreList);
  }

  // ================= DETAIL =================

  openDetail(member: any): void {
    if (this.membersAffectes) {
      for (const mb of this.membersAffectes) {
        if (member.id === member.id) {
          this.selectedMember = mb;
        }
      }
    }
    // this.http.get<any>(`${this.apiUrl}/${member.id}`).subscribe({
    //   next: (data) => {
    //     this.selectedMember = data;
    //   },
    //   error: (err) => console.error(err),
    // });
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

        this.loadMembers();
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
      next: () => this.loadMembers(),
      error: (err) => console.error(err),
    });
  }

  removeFromTeam(member: any): void {
    if (!confirm('Retirer de l’équipe ?')) return;

    this.http.delete(`${this.apiUrl}/${member.id}/equipes`).subscribe({
      next: () => this.loadMembers(),
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
      next: () => this.loadMembers(),
      error: (err) => console.error(err),
    });
  }
}
