import { Component, EventEmitter, model, output, Output } from '@angular/core';
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
  search = model<string>();
  local = model<string>();
  openAddModal=output();
}
