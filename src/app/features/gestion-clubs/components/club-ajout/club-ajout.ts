import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, required, submit } from '@angular/forms/signals';

import { ClubService } from '../../services/club.service';
import { ClubRequest } from '../../models/club.model';
import { ModalServices } from '../../../../shared/services/modal-services';

@Component({
  selector: 'app-club-ajout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './club-ajout.html',
  styleUrls: ['./club-ajout.css'],
})
export class ClubAjoutComponent {
  // ================= SERVICES =================

  private clubService = inject(ClubService);
  private modalService = inject(ModalServices);


  // ================= DATA =================
  clubModel = signal<ClubRequest>({
    nom: '',
    local: '',
  });

  clubForm = form(this.clubModel, (schemaPath) => {
    required(schemaPath.nom, { message: 'Le nom du club est requis ' });
    required(schemaPath.local, { message: 'La localité  est requise ' });
  });
  selectedEquipe = 'PSG';

// ================= SAVE =================
async save(): Promise<void> {
  await submit(this.clubForm, async () => {
    this.clubService.create(this.clubModel()).subscribe({
      next: () => {
        this.confirmModal.emit(false);
        this.modalService.success('Membre ajouté avec succès');
      },
      error: (err) => {
        console.error(err);
        this.modalService.error('Erreur lors de la création du membre.');
      },
    });
  });
}
  // ================= OUTPUTS =================
  cancelModal = output<void>();
  confirmModal = output<boolean>();
}
