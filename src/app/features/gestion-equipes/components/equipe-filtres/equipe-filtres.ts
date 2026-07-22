import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equipes-filtres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipe-filtres.html',
  styleUrl: './equipe-filtres.css',
})
export class EquipesFiltresComponent {
  search = model('');
  filterCategorie = model('');
  showAddButton= input(true);
  ajouter = output<void>();
}
