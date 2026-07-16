import { Component, output } from '@angular/core';

@Component({
  selector: 'app-modal-generique',
  imports: [],
  templateUrl: './modal-generique.html',
  styleUrl: './modal-generique.css',
})
export class ModalGenerique {
  confirm = output<void>();
  cancel = output<void>();
}
