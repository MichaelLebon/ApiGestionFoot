import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Club } from '../../models/club.model';

@Component({
  selector: 'app-modal-detail-club',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detail-club.html',
  styleUrl: './modal-detail-club.css',
})
export class ModalDetailClubComponent {
  @Input({ required: true })
  visible = false;
  @Input()
  club: Club | null = null;
  @Output()
  close = new EventEmitter<void>();
  fermer(): void {
    this.close.emit();
  }
}
