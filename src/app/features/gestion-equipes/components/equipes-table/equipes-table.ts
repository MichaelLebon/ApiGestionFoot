import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Equipe } from '../../models/equipe.model';

@Component({
  selector: 'app-equipes-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipes-table.html',
  styleUrls: ['./equipes-table.css'],
})
export class EquipesTableComponent {
  equipes = input.required<Equipe[]>();
  emptyMessage = input('Aucune équipe trouvée.');
  detail = output<Equipe>();
  delete = output<string>();
  modalIsOpen = output<Equipe>();
}
