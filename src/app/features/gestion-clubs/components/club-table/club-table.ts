import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Club } from '../../models/club.model';

@Component({
  selector: 'app-club-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './club-table.html',
  styleUrl: './club-table.css',
})
export class ClubTableComponent {
  @Input({ required: true })
  clubs: Club[] = [];
  @Output()
  detail = new EventEmitter<Club>();
  @Output()
  delete = new EventEmitter<Club>();
  voirDetail(club: Club): void {
    this.detail.emit(club);
  }
  supprimer(club: Club): void {
    this.delete.emit(club);
  }
}
