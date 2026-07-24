import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Club } from '../../models/club.model';
import { Equipe } from '../../../gestion-equipes/models/equipe.model';
import { ClubTableComponent } from '../club-table/club-table';

@Component({
  selector: 'app-modal-detail-club',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detail-club.html',
  styleUrl: './modal-detail-club.css',
})
export class ModalDetailClubComponent {
  club = input.required<Club>();
  close = output<void>();
  delete = output<Club>();
}
