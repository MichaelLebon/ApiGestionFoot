import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipesService } from '../../services/equipes.service';
import { Equipe } from '../../models/equipe.model';
import { ModalServices } from '../../../../shared/services/modal-services';
import { ModalConfirm } from '../../../../shared/components/modal-confirm/modal-confirm';
import { ModalGenerique } from '../../../../shared/components/modal-generique/modal-generique';
import { EquipesTableComponent } from '../../components/equipes-table/equipes-table';
import { ModalDetailEquipeComponent } from '../../components/modal-detail-equipe/modal-detail-equipe';
import { EquipesFiltresComponent } from '../../components/equipe-filtres/equipe-filtres';
import EquipesAjoutComponent from '../../components/equipe-ajout/equipe-ajout';
@Component({
  selector: 'app-equipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalConfirm,
    ModalGenerique,
    EquipesFiltresComponent,
    EquipesTableComponent,
    ModalDetailEquipeComponent,
    EquipesAjoutComponent,
  ],
  templateUrl: './equipes.html',
  styleUrls: ['./equipes.css'],
})
export default class EquipesComponent {
  // ================= SERVICES =================
  equipesService = inject(EquipesService);
  modalService = inject(ModalServices);
  equipes = this.equipesService.equipes;
  // ================= FILTRES =================
  search = signal('');
  filterCategorie = signal('');
  filteredList = computed(() => {
    const term = this.search().toLowerCase();
    const categorie = this.filterCategorie();
    return this.equipes().filter((equipe) => {
      const matchText = !term || equipe.nom.toLowerCase().includes(term);
      const matchCategorie = !categorie || equipe.categorie === categorie;
      return matchText && matchCategorie;
    });
  });
  // ================= DETAIL =================
  selectedId = signal<string | null>(null);
  selectedEquipe = computed(() => this.equipes().find((e) => e.id === this.selectedId()) ?? null);
  openDetail(equipe: Equipe) {
    this.selectedId.set(equipe.id);
  }
  closeModal() {
    this.selectedId.set(null);
  }
  // ================= DELETE =================
  modalConfirmIsOpen = signal(false);
  confirmMessage = signal('');
  private pendingConfirmAction = signal<(() => void) | null>(null);
  deleteEquipe(id: string) {
    this.openConfirm('Supprimer cette équipe ?', () => {
      this.equipesService.deleteEquipe(id).subscribe({
        next: () => {
          this.modalService.success('Équipe supprimée avec succès');
          this.closeModal();
        },
        error: () => {
          this.modalService.error("Erreur lors de la suppression de l'équipe");
        },
      });
    });
  }
  private openConfirm(message: string, action: () => void) {
    this.confirmMessage.set(message);
    this.pendingConfirmAction.set(action);
    this.modalConfirmIsOpen.set(true);
  }
  closeConfirm() {
    this.modalConfirmIsOpen.set(false);
    this.pendingConfirmAction.set(null);
  }
  confirmAction() {
    this.pendingConfirmAction()?.();
    this.closeConfirm();
  }
  // ================= CLUB =================
  isModalClubOpen = signal(false);
  equipeForClub = signal<Equipe | null>(null);
  selectedClubId = signal('');
  openModalClub(equipe: Equipe) {
    this.equipeForClub.set(equipe);
    this.isModalClubOpen.set(true);
  }
  closeModalClub() {
    this.isModalClubOpen.set(false);
    this.equipeForClub.set(null);
    this.selectedClubId.set('');
  }
  assignClub() {
    const equipe = this.equipeForClub();
    const clubId = this.selectedClubId();
    if (!equipe || !clubId) return;
    this.equipesService.updateClub(equipe.id, clubId).subscribe({
      next: () => {
        this.modalService.success('Club modifié');
        this.closeModalClub();
      },
      error: () => {
        this.modalService.error('Impossible de modifier le club');
      },
    });
  }
  // ================= AJOUT =================
  isModalAddOpen = signal(false);
  openModalAjout() {
    console.log("je suis la ")
    this.isModalAddOpen.set(true);

  }
  closeModalAjout() {
    this.isModalAddOpen.set(false);
  }
}
