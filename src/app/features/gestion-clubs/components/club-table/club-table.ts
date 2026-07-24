import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Club } from '../../models/club.model';
import { Equipe } from '../../../gestion-equipes/models/equipe.model';

@Component({
  selector: 'app-club-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './club-table.html',
  styleUrl: './club-table.css',
})
export class ClubTableComponent {
  clubs = input.required<Club[]>();
  detail = output<Club>();
  delete = output<Club>();
  modalIsOpen = output<Club>();
}
