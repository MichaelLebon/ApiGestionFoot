import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Equipe } from '../../models/equipe.model';

@Component({
  selector: 'app-modal-detail-equipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detail-equipe.html',
  styleUrl: './modal-detail-equipe.css',
})
export class ModalDetailEquipeComponent {
  equipe = input.required<Equipe>();
  close = output<void>();
  delete = output<string>();
}
