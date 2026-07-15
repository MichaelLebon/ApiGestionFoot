import { Component, input, model, output } from '@angular/core';
import { Membre } from '../../models/membre.model';

@Component({
  selector: 'app-modal-detail-inactif',
  imports: [],
  templateUrl: './modal-detail-inactif.html',
  styleUrl: './modal-detail-inactif.css',
})
export class ModalDetailInactif {
  selectedJoueur = input<Membre>();

  membre = input.required<Membre>();

  close = output<void>();
  activate = output<Membre>();
  assign = output<Membre>();
  delete = output<string>();
}
