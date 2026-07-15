/**
 * @file app.ts
 * @description Composant racine de l'application.
 * Ce composant sert de conteneur principal et structure la mise en page globale
 * en incluant la barre de navigation et le point d'insertion des routes.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarBasicDemo } from '../layout/navbar/navbar';
import { ModalInfo } from '../shared/components/modal-info/modal-info';

/**
 * @class App
 * @description Le composant principal (root) de l'application.
 * Il est défini comme composant autonome (standalone).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenubarBasicDemo, ModalInfo],
  templateUrl: './app.html',
})
export class App {}
