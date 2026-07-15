import { Component, computed, inject, output, OutputEmitterRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MembreService } from '../../services/membres.service';
import { Membre } from '../../models/membre.model';
import MembresAjoutsComponent from '../../components/membres-ajouts/membres-ajouts';
import { ModalServices } from '../../../../shared/services/modal-services';
import { ModalDetailInactif } from '../../components/modal-detail-inactif/modal-detail-inactif';
import { ModalConfirm } from '../../../../shared/components/modal-confirm/modal-confirm';

@Component({
  selector: 'app-membres-libres',
  standalone: true,
  imports: [CommonModule, FormsModule, MembresAjoutsComponent, ModalDetailInactif, ModalConfirm],
  templateUrl: './membres-libres.html',
  styleUrls: ['./membres-libres.css'],
})
export default class MembresLibresComponent {
  private readonly membreService = inject(MembreService);
  private modalService = inject(ModalServices);
  confirmMessage = signal('');
  selectedIdToDelete = signal<string | null>(null);
  modalAjoutIsOpen = signal(false);
  modalConfirmIsOpen = signal(false);
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
  filterList(listMembre: Membre[]) {
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

    this.membreService.deleteMember(id).subscribe({
      next: () => this.modalService.success(`Supprimé avec succés `),
      error: () => this.modalService.error(`Erreur pour la suppression ! `),
    });
    this.closeModal();
    this.closeModalConfirm();
  }
  assignMemberToTeam(membre: Membre): void {
    //TODO : modifier en modal quand services equipes ok , pour avoir un lenu déroulant des equipes a selectionné 
    const equipeId = prompt("Identifiant de l'équipe :");
    if (!equipeId) return;
    this.membreService.assignMemberToTeam(membre, equipeId).subscribe({
      // TODO :ATTENTION ID en attendant le service equipe
      next: () =>
        this.modalService.success(
          `${membre.prenom} ${membre.nom} Est devenue un joueur du ${equipeId}`,
        ),
      error: () =>
        this.modalService.error(
          `erreur pour la mise en équipe de  ${membre.prenom} ${membre.nom} `,
        ),
    });
    this.closeModal();
  }
  activateMember(membre: Membre): void {
    this.membreService.activateMember(membre).subscribe({
      next: () => this.modalService.success(`${membre.prenom} ${membre.nom} Est devenu actif`),
      error: () =>
        this.modalService.error(`erreur pour l'activation de ${membre.prenom} ${membre.nom} `),
    });
    this.closeModal();
  }
  openModalAjout(): void {
    this.modalAjoutIsOpen.set(true);
  }
  openModalConfirm(membre:Membre): void {
    this.confirmMessage.set(`Etes-vous sûr de rendre ${membre.prenom} ${membre.nom} inactif ?`);
    this.selectedIdToDelete.set(membre.id);
    this.modalConfirmIsOpen.set(true);
  }
  closeModalConfirm(): void {
    this.selectedIdToDelete.set(null);
    this.modalConfirmIsOpen.set(false);
  }
}
