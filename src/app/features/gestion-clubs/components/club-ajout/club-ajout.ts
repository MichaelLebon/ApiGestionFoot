import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClubService } from '../../services/club.service';
import { Club } from '../../models/club.model';

@Component({
  selector: 'app-club-ajout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './club-ajout.html',
  styleUrl: './club-ajout.css',
})
export class ClubAjoutComponent {
  private readonly clubService = inject(ClubService);
  @Output()
  clubAjoute = new EventEmitter<void>();
  loading = false;
  club: Partial<Club> = {
    nom: '',
    local: '',
  };
  ajouterClub(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.clubService.create(this.club).subscribe({
      next: () => {
        this.loading = false;
        this.reset();
        this.clubAjoute.emit();
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur lors de la création du club', err);
      },
    });
  }
  reset(): void {
    this.club = {
      nom: '',
      local: '',
    };
  }
}
