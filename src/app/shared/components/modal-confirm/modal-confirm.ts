import { Component, Input, input, output } from '@angular/core';
import { Membre } from '../../../features/gestion-membres/models/membre.model';

@Component({
  selector: 'app-modal-confirm',
  imports: [],
  templateUrl: './modal-confirm.html',
  styleUrl: './modal-confirm.css',
})
export class ModalConfirm {
  confirm = output<void>();
  cancel =output<void>();
  message = input.required<string>();

}
