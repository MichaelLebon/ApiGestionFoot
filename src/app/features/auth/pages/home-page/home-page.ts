import { Component } from '@angular/core';
import { HomeCard } from '../../components/home-card/home-card';

/**
 * =========================================================
 * COMPONENT : HOME PAGE
 * =========================================================
 * Page d'accueil de l'application.
 *
 * Fonctionnalités :
 * - affichage des cartes de navigation principales
 * - point d'entrée pour la gestion des membres et sites
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HomeCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export default class HomePage {}
