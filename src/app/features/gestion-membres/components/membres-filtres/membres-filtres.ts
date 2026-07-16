import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-membres-filtres',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './membres-filtres.html',
  styleUrls: ['./membres-filtres.css'],
})
export class MembresFiltresComponent {
  search = model('');
  filterRole = model('');
  showAddButton = input(true);
  ajouter = output<void>();
}
