import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-club-filtres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './club-filtres.html',
  styleUrl: './club-filtres.css',
})
export class ClubFiltresComponent {
  @Output()
  filtersChange = new EventEmitter<{
    nom: string;
    local: string;
  }>();
  nom = '';
  local = '';
  emitFilters(): void {
    this.filtersChange.emit({
      nom: this.nom,
      local: this.local,
    });
 }
}
