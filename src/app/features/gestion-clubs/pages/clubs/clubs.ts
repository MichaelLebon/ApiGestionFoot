import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Club } from '../../models/club.model';
import { ClubService } from '../../services/club.service';
import { ClubFiltresComponent } from '../../components/club-filtres/club-filtres';
import { ClubTableComponent } from '../../components/club-table/club-table';
import { ModalDetailClubComponent } from '../../components/modal-detail-club/modal-detail-club';
@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClubFiltresComponent,
    ClubTableComponent,
    ModalDetailClubComponent,
  ],
  templateUrl: './clubs.html',
  styleUrl: './clubs.css',
})
export default class ClubsComponent implements OnInit {
  private readonly clubService = inject(ClubService);
  private readonly cdr = inject(ChangeDetectorRef);
  /**
   * Liste complète des clubs
   */
  clubs: Club[] = [];
  /**
   * Liste affichée après filtres
   */
  filteredClubs: Club[] = [];
  /**
   * Compteur dynamique
   */
  totalClubs = 0;
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
  ngOnInit(): void {
    this.loadClubs();
  }
  /**
   * Chargement des clubs depuis API
   */
  loadClubs(): void {
    this.clubService.getAll().subscribe({
      next: (clubs) => {
        this.clubs = clubs;
        this.filteredClubs = [...clubs];
        this.totalClubs = clubs.length;
        /**
         * Correction Angular NG0100
         */
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur récupération clubs :', err);
      },
    });
  }
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
    this.clubService.create(this.newClub).subscribe({
      next: () => {
        this.closeAddModal();
        this.loadClubs();
      },
      error: (err) => {
        console.error('Erreur ajout club :', err);
      },
    });
  }
  /**
   * Filtrage clubs
   */
  onFiltersChange(filters: { nom: string; local: string }): void {
    this.filteredClubs = this.clubs.filter((club) => {
      const nomMatch = club.nom.toLowerCase().includes(filters.nom.toLowerCase());
      const localMatch = club.local.toLowerCase().includes(filters.local.toLowerCase());
      return nomMatch && localMatch;
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
  supprimerClub(club: Club): void {
    if (!confirm(`Supprimer le club "${club.nom}" ?`)) {
      return;
    }
    this.clubService.delete(club.id).subscribe({
      next: () => {
        this.loadClubs();
      },
      error: (err) => {
        console.error('Erreur suppression club :', err);
      },
    });
  }
}
