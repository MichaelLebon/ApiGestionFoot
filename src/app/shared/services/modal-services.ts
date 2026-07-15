import { Injectable, signal } from '@angular/core';
import { ModalInfo } from '../components/modal-info/modal-info';

export type ModalType = "success" | "error" | "warning" | "info";

interface Modal{
  id: number,
  message: string,
  type: ModalType
}

@Injectable({
  providedIn: 'root',
})
export class ModalServices {
  private nextId = 0;
  readonly toasts = signal<Modal[]>([]);

  show(message: string, type: ModalType = 'info', duration = 4000): void {
    const id = this.nextId++;
    this.toasts.update((current) => [...current, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }
  error(message: string): void {
    this.show(message, 'error', 6000);
  }
  info(message: string): void {
    this.show(message, 'info');
  }
  warning(message: string): void {
    this.show(message, 'warning');
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
