import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MembreService } from '../../services/membres.service';
import { MembreRequest } from '../../models/membre.model';
import { email, form, FormField, required, submit } from '@angular/forms/signals';

@Component({
  selector: 'app-membres-ajout',
  standalone: true,
  imports: [CommonModule, FormsModule, FormField],
  templateUrl: './membres-ajouts.html',
  styleUrls: ['./membres-ajouts.css'],
})
export default class MembresAjoutsComponent {
  // ================= SERVICES =================

  private membreService = inject(MembreService);
  private router = inject(Router);

  // ================= DATA =================
  membreModel = signal<MembreRequest>({
    prenom: '',
    nom: '',
    email: '',
    dateDeNaissance: '',
    roles: ['JOUEUR'],
  });

  membreForm = form(this.membreModel, (schemaPath) => {
    required(schemaPath.prenom, { message: 'Le prénom est requis' });
    required(schemaPath.nom, { message: 'Le nom est requis' });
    required(schemaPath.email, { message: "L'email est requis" });
    email(schemaPath.email, { message: 'Email invalide' });
    required(schemaPath.dateDeNaissance, { message: 'La date de naissance est requise' });
  });

  selectedRole = 'JOUEUR';

  // ================= SAVE =================
  async save(): Promise<void> {
    // sync le rôle sélectionné (hors du formField) dans le modèle
    this.membreModel.update((m) => ({ ...m, roles: [this.selectedRole] }));

    await submit(this.membreForm, async () => {
      this.membreService.create(this.membreModel()).subscribe({
        next: () => {
          this.confirmmodal.emit(false);
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la création du membre.');
        },
      });
      // return undefined; // pas d'erreurs serveur additionnelles à mapper
    });
  }

  // ================= CANCEL =================

  cancelmodal = output<void>();
  confirmmodal = output<boolean>();
}
