import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { form, FormField, required, submit } from '@angular/forms/signals';

import { ModalServices } from '../../../../shared/services/modal-services';
import { EquipesService } from '../../services/equipes.service';
import { EquipeRequest, CategorieEquipe } from '../../models/equipe.model';
@Component({
  selector: 'app-equipes-ajout',
  standalone: true,
  imports: [CommonModule, FormsModule, FormField],
  templateUrl: './equipe-ajout.html',
  styleUrls: ['./equipe-ajout.css'],
})
export default class EquipesAjoutComponent {
  // ================= SERVICES =================

  private modalService = inject(ModalServices);
  private equipesService = inject(EquipesService);

  // ================= DATA =================

  equipeModel = signal<EquipeRequest>({
    nom: '',
    categorie: 'SENIOR',
    club_id: '',
  });

  equipeForm = form(this.equipeModel, (schemaPath) => {
    required(schemaPath.nom, {
      message: "Le nom de l'équipe est requis",
    });
    required(schemaPath.categorie, { message: 'La catégorie est requise' });
  });
  selectedCategorie: CategorieEquipe = 'SENIOR';
  //  TODO Plus tard on remplacera ceci par la sélection d'un vrai club
  selectedClubId = '';

  // ================= SAVE =================

  async save(): Promise<void> {
    this.equipeModel.update((equipe) => ({
      ...equipe,
      categorie: this.selectedCategorie,
      club_id: this.selectedClubId,
    }));

    await submit(this.equipeForm, async () => {
      this.equipesService.createEquipe(this.equipeModel()).subscribe({
        next: () => {
          this.confirmModal.emit(false);
          this.modalService.success('Équipe ajoutée avec succès');
        },
        error: (err) => {
          console.error(err);
          this.modalService.error("Erreur lors de la création de l'équipe.");
        },
      });
    });
  }

  // ================= CANCEL =================

  cancelModal = output<void>();
  confirmModal = output<boolean>();
}
