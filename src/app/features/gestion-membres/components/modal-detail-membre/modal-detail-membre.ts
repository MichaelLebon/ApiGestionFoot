import { Component, input, output } from '@angular/core';
import { Membre } from '../../models/membre.model';

@Component({
  selector: 'app-modal-detail-membre',
  standalone: true,
  imports: [],
  templateUrl: './modal-detail-membre.html',
  styleUrl: './modal-detail-membre.css',
})
export class ModalDetailMembre {
  membre = input.required<Membre>();

  close = output<void>();
  manageRoles = output<Membre>();
  delete = output<Membre>();
  removeFromTeam = output<Membre>();
}
