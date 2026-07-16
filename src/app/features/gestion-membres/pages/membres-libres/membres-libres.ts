import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembreService } from '../../services/membres.service';
import { Membre } from '../../models/membre.model';
import MembresAjoutsComponent from '../../components/membres-ajouts/membres-ajouts';
import { ModalServices } from '../../../../shared/services/modal-services';
import { ModalConfirm } from '../../../../shared/components/modal-confirm/modal-confirm';
import { ModalDetailInactif } from '../../components/modal-detail-inactif/modal-detail-inactif';
import { MembresFiltresComponent } from '../../components/membres-filtres/membres-filtres';
import { MembresTableComponent } from '../../components/membres-table/membres-table';

@Component({
  selector: 'app-membres-libres',
  standalone: true,
  imports: [
    CommonModule,
    MembresAjoutsComponent,
    ModalConfirm,
    ModalDetailInactif,
    MembresFiltresComponent,
    MembresTableComponent,
  ],
  templateUrl: './membres-libres.html',
  styleUrls: ['./membres-libres.css'],
})
export default class MembresLibresComponent {
  private readonly membreService = inject(MembreService);
  private modalService = inject(ModalServices);

  confirmMessage = signal('');
  selectedIdToDelete = signal<string | null>(null);
  modalActiveIsOpen = signal(false);
  modalAjoutIsOpen = signal(false);
  modalConfirmIsOpen = signal(false);
  modalDetailIsOpen = signal(false);

  membresLibre = this.membreService.membresLibres;
  membresInactifs = this.membreService.membresInactifs;
  selectedJoueur = signal<Membre | null>(null);

  search = signal('');
  filterRole = signal('');

  filteredListInactifs = computed(() => this.filterList(this.membresInactifs()));
  filteredListLibres = computed(() => this.filterList(this.membresLibre()));

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

  deleteJoueur(id: string): void {
    this.membreService.deleteMember(id).subscribe({
      next: () => this.modalService.success(`Supprimé avec succés `),
      error: () => this.modalService.error(`Erreur pour la suppression ! `),
    });
    this.closeModal();
    this.closeModalConfirm();
  }

  assignMemberToTeam(membre: Membre): void {
    const equipeId = prompt("Identifiant de l'équipe :");
    if (!equipeId) return;
    this.membreService.assignMemberToTeam(membre, equipeId).subscribe({
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
    this.closeModalActive();
    this.closeModal();
  }

  openDetail(membre: Membre): void {
    this.selectedJoueur.set(membre);
    this.modalDetailIsOpen.set(true);
  }

  closeModal(): void {
    this.selectedJoueur.set(null);
    this.modalDetailIsOpen.set(false);
  }

  openModalAjout(): void {
    this.modalAjoutIsOpen.set(true);
  }

  openModalConfirm(membre: Membre): void {
    this.confirmMessage.set(`Etes-vous sûr de rendre ${membre.prenom} ${membre.nom} inactif ?`);
    this.selectedIdToDelete.set(membre.id);
    this.modalConfirmIsOpen.set(true);
  }

  closeModalConfirm(): void {
    this.selectedIdToDelete.set(null);
    this.modalConfirmIsOpen.set(false);
  }

  openModalActive(membre: Membre): void {
    this.confirmMessage.set(`Etes-vous sûr de rendre ${membre.prenom} ${membre.nom} actif ?`);
    this.selectedJoueur.set(membre);
    this.modalActiveIsOpen.set(true);
  }

  closeModalActive(): void {
    this.modalActiveIsOpen.set(false);
  }
}
