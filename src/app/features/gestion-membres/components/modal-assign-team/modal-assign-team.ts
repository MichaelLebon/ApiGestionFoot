import { Component, input, output, signal } from '@angular/core';
import { Equipe } from '../../../gestion-equipes/models/equipe.model';

@Component({
  selector: 'app-modal-assign-team',
  imports: [],
  templateUrl: './modal-assign-team.html',
  styleUrl: './modal-assign-team.css',
})
export class ModalAssignTeam {
  confirm = output<string>();
  cancel = output<void>();
  equipes = input.required<Equipe[]>();
  selectedValue = signal<string | null>(null);

  onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedValue.set(value);
  }
}
