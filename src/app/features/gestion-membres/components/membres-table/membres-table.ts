import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Membre } from '../../models/membre.model';

@Component({
  selector: 'app-membres-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './membres-table.html',
  styleUrls: ['./membres-table.css'],
})
export class MembresTableComponent {
  membres = input.required<Membre[]>();
  type = input<'libre' | 'inactif' | 'affecte'>('libre');
  emptyMessage = input('Aucun membre trouvé.');

  detail = output<Membre>();
  assign = output<Membre>();
  delete = output<Membre>();
  activate = output<Membre>();
  manageRoles = output<Membre>();
  modalIsOpen = output<Membre>();
}
