import { Component, inject, input } from '@angular/core';
import { ModalServices } from '../../services/modal-services';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-info',
  imports: [NgClass],
  templateUrl: './modal-info.html',
  styleUrl: './modal-info.css',
})
export class ModalInfo {
  protected readonly modalServices = inject(ModalServices);
  protected readonly modals = this.modalServices.toasts;
}
