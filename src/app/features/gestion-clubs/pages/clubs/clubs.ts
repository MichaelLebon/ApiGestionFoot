import { Component,  inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Club, ClubRequest } from '../../models/club.model';
import { ClubService } from '../../services/club.service';
import { ClubFiltresComponent } from '../../components/club-filtres/club-filtres';
import { ClubTableComponent } from '../../components/club-table/club-table';
import { ModalDetailClubComponent } from '../../components/modal-detail-club/modal-detail-club';
import { ModalServices } from '../../../../shared/services/modal-services';
import { ModalConfirm } from '../../../../shared/components/modal-confirm/modal-confirm';
@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClubFiltresComponent,
    ClubTableComponent,
    ModalDetailClubComponent,
    ModalConfirm,
  ],
  templateUrl: './clubs.html',
  styleUrl: './clubs.css',
})
export default class ClubsComponent {
  clubService = inject(ClubService);
  modalService = inject(ModalServices);
  /**
   * Liste complète des clubs
   */
  clubs = this.clubService.clubs;
  /**
   * Liste affichée après filtres
   */
  selectedIdToDelete = signal<string | null>(null);
  search = signal('');
  local = signal('');
  filteredClubs = computed(() => {
    const searchFinal = this.search().toLowerCase();
    const localFinal = this.local().toLowerCase();
    return this.clubs().filter((club) => {
      const clubName = !searchFinal || club.nom.toLowerCase().includes(searchFinal);
      const clubLocal = !localFinal || club.local.toLowerCase().includes(localFinal);
      return clubName && clubLocal;
    });
  });
  /**
   * Club sélectionné pour détail
   */
  selectedClub: Club | null = null;
  /**
   * Modal détail
   */
  detailVisible = false;
  /**
   * Modal ajout
   */
  addModalVisible = false;
  /**
   * Nouveau club
   */
  newClub = {
    nom: '',
    local: '',
  };

  /**
   * Ouverture modal ajout
   */
  openAddModal(): void {
    this.addModalVisible = true;
  }
  /**
   * Fermeture modal ajout
   */
  closeAddModal(): void {
    this.addModalVisible = false;
    this.newClub = {
      nom: '',
      local: '',
    };
  }
  /**
   * Ajout d'un club
   */
  addClub(): void {
    if (!this.newClub.nom.trim()) {
      return;
    }
    const clubRequest = {
      nom: this.newClub.nom,
      local: this.newClub.local,
    };
    this.clubService.create(clubRequest).subscribe({
      next: () => {
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Erreur ajout club :', err);
      },
    });
  }
  /**
   * Afficher détail club
   */
  openDetail(club: Club): void {
    this.selectedClub = club;
    this.detailVisible = true;
  }
  /**
   * Fermer détail club
   */
  closeDetail(): void {
    this.detailVisible = false;
    this.selectedClub = null;
  }
  /**
   * Suppression club
   */
  modalConfirmIsOpen = signal(false);
  confirmMessage = signal('');

  supprimerClub() {

    const id = this.selectedIdToDelete();
    if (!id) {
      console.error('Aucun club sélectionné');
      return;
    }
    this.clubService.delete(id).subscribe({
      next: () => {
        this.modalService.success('Club supprimé avec succès');
        this.closeConfirm();
        this.selectedIdToDelete.set(null);
      },
      error: (err) => {
        console.error(err);
        this.modalService.error('Erreur suppression club');
        this.closeConfirm();
      },
    });
  }
  public openConfirm(message: string, club: Club): void {
    this.selectedIdToDelete.set(club.id);
    this.confirmMessage.set(message);
    this.modalConfirmIsOpen.set(true);
  }

  closeConfirm(): void {
    this.selectedIdToDelete.set(null);
    this.modalConfirmIsOpen.set(false);
    this.confirmMessage.set(" ");
  }
}
