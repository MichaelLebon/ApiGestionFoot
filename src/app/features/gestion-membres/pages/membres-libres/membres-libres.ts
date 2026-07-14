import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MembreService } from '../../services/membres.service';
import { Membre } from '../../models/membre.model';
import MembresAjoutsComponent from '../../components/membres-ajouts/membres-ajouts';

@Component({
  selector: 'app-membres-libres',
  standalone: true,
  imports: [CommonModule, FormsModule, MembresAjoutsComponent],
  templateUrl: './membres-libres.html',
  styleUrls: ['./membres-libres.css'],
})
export default class MembresLibresComponent {
  private readonly membreService = inject(MembreService);

  modalAjoutIsOpen = signal(false);

  // Idéalement membresLibres() et membresInactifs() sont déjà des signals
  // exposés par le service. S'ils ne le sont pas encore, wrap-les en signal.
  membresLibre = this.membreService.membresLibres;
  membresInactifs = this.membreService.membresInactifs;

  selectedJoueur = signal<Membre | null>(null);

  // Signals pour les filtres, liés via [(ngModel)]="search()" / (ngModelChange)
  // ou mieux : model() si tu passes par un composant enfant.
  search = signal('');
  filterRole = signal('');

  // Le filtrage devient dérivé automatiquement, plus besoin d'appeler
  // une méthode manuellement : dès que membresLibre, search ou filterRole
  // changent, filteredList se recalcule tout seul.
  filteredListLibres = computed(() => {
    return this.filterList(this.membresLibre());
  });
  filteredListInactifs = computed(() => {
    return this.filterList(this.membresInactifs());
  });

  filterList(listMembre: Membre[]){
    const term = this.search().toLowerCase();
    const role = this.filterRole();

    return (listMembre ?? []).filter((membre) => {
      const nomComplet = `${membre.prenom} ${membre.nom}`.toLowerCase();
      const rechercheOK = term === '' || nomComplet.includes(term);
      const roleOK = role === '' || membre.roles.includes(role);
      return rechercheOK && roleOK;
    });
  }

  openDetail(membre: Membre): void {
    this.selectedJoueur.set(membre);
  }

  closeModal(): void {
    this.selectedJoueur.set(null);
  }

  deleteJoueur(id: string): void {
    if (!confirm('Voulez-vous vraiment désactiver ce membre ?')) return;
    this.membreService.deleteMember(id).subscribe();
  }

  assignMemberToTeam(membre: Membre): void {
    const equipeId = prompt("Identifiant de l'équipe :");
    if (!equipeId) return;
    this.membreService.assignMemberToTeam(membre, equipeId).subscribe();
  }

  activateMember(membre: Membre): void {
    this.membreService.activateMember(membre);
  }

  openModalAjout(): void {
    this.modalAjoutIsOpen.set(true);
  }
}
