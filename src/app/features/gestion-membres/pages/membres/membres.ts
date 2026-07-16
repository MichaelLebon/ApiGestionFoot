import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembreService } from '../../services/membres.service';
import { Membre } from '../../models/membre.model';
import { ModalServices } from '../../../../shared/services/modal-services';
import { ModalConfirm } from '../../../../shared/components/modal-confirm/modal-confirm';
import { MembresFiltresComponent } from '../../components/membres-filtres/membres-filtres';
import { MembresTableComponent } from '../../components/membres-table/membres-table';
import { ModalDetailMembre } from '../../components/modal-detail-membre/modal-detail-membre';

export type RoleType = 'COACH' | 'JOUEUR' | 'ADMIN';

const ROLES: RoleType[] = ['COACH', 'JOUEUR', 'ADMIN'];

function isRoleType(value: string): value is RoleType {
  return (ROLES as string[]).includes(value);
}

@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [
    CommonModule,
    ModalConfirm,
    MembresFiltresComponent,
    MembresTableComponent,
    ModalDetailMembre,
  ],
  templateUrl: './membres.html',
  styleUrls: ['./membres.css'],
})
export default class MembresComponent {
  membreService = inject(MembreService);
  modalService = inject(ModalServices);

  membersAffectes = this.membreService.membresAffectes;

  search = signal('');
  filterRole = signal('');

  filteredList = computed(() => this.filterList(this.membersAffectes()));

  // selectedMember dérive de la liste + de l'id sélectionné : si la liste
  // se recharge après une action, le modal reflète automatiquement
  // les données à jour, sans logique de synchronisation manuelle.
  selectedId = signal<string | null>(null);
  selectedMember = computed(
    () => this.membersAffectes().find((m) => m.id === this.selectedId()) ?? null,
  );

  modalConfirmIsOpen = signal(false);
  confirmMessage = signal('');
  private pendingConfirmAction = signal<(() => void) | null>(null);

  filterList(listMembre: Membre[]): Membre[] {
    const term = this.search().toLowerCase();
    const role = this.filterRole();

    return (listMembre ?? []).filter((membre) => {
      const fullName = `${membre.prenom} ${membre.nom}`.toLowerCase();
      return (!term || fullName.includes(term)) && (!role || membre.roles.includes(role));
    });
  }

  openDetail(membre: Membre): void {
    this.selectedId.set(membre.id);
  }

  closeModal(): void {
    this.selectedId.set(null);
  }

  private openConfirm(message: string, action: () => void): void {
    this.confirmMessage.set(message);
    this.pendingConfirmAction.set(action);
    this.modalConfirmIsOpen.set(true);
  }

  closeConfirm(): void {
    this.modalConfirmIsOpen.set(false);
    this.pendingConfirmAction.set(null);
  }

  confirmAction(): void {
    this.pendingConfirmAction()?.();
    this.closeConfirm();
  }

  deleteMember(membre: Membre): void {
    this.openConfirm(`Supprimer ${membre.prenom} ${membre.nom} ?`, () => {
      this.membreService.deleteMember(membre.id).subscribe({
        next: () => {
          this.modalService.success('Membre supprimé avec succès.');
          this.closeModal();
          this.membreService.membresAffectesResource.reload();
        },
        error: () => this.modalService.error('Erreur lors de la suppression du membre.'),
      });
    });
  }

  assignTeam(membre: Membre): void {
    const id = prompt('ID équipe ?');
    if (!id) return;
    this.membreService.assignMemberToTeam(membre, id).subscribe({
      next: () => this.membreService.membresAffectesResource.reload(),
      error: () => this.modalService.error("Impossible d'assigner l'équipe."),
    });
  }

  removeFromTeam(membre: Membre): void {
    this.openConfirm(`Retirer ${membre.prenom} ${membre.nom} de son équipe ?`, () => {
      this.membreService.removeFromTeam(membre).subscribe({
        next: () => this.membreService.membresAffectesResource.reload(),
        error: () => this.modalService.error("Impossible de retirer le membre de l'équipe."),
      });
    });
  }

  manageRoles(membre: Membre): void {
    const action = prompt('1 = Ajouter / 2 = Supprimer');
    if (!action) return;

    const roleInput = prompt('ROLE (JOUEUR / COACH / ADMIN)');
    if (!roleInput) return;

    const role = roleInput.trim().toUpperCase();
    if (!isRoleType(role)) {
      this.modalService.error(`Rôle invalide : ${roleInput}`);
      return;
    }

    if (action === '1') {
      this.membreService.addRole(membre, role).subscribe({
        next: () => this.membreService.membresAffectesResource.reload(),
        error: () => this.modalService.error("Impossible d'ajouter le role : " + role),
      });
    } else if (action === '2') {
      this.membreService.removeRole(membre, role).subscribe({
        next: () => this.membreService.membresAffectesResource.reload(),
        error: () => this.modalService.error('Impossible de retirer le role : ' + role),
      });
    }
  }
}
