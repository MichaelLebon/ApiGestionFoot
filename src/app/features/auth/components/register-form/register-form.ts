import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

/**
 * Composant gérant le formulaire d'inscription des nouveaux membres.
 *
 * Ce composant gère la saisie des données utilisateur, la validation
 * du format de l'email, ainsi que la robustesse et la correspondance des mots de passe.
 * Il communique également avec le composant parent pour changer de vue (ex: retour à la connexion).
 */
@Component({
  selector: 'app-register-form',
  standalone: true,

  imports: [CommonModule, FormsModule, FloatLabel, InputText, Password, DatePicker, Select],

  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css'],
})
export class RegisterForm {
  /**
   * Émetteur d'événement permettant de notifier le composant parent
   * d'un changement d'état (changement de vue de la carte d'accueil).
   */
  // @Output()
  // stateToSend = new EventEmitter<CardType>();

  // ==================================
  // DONNÉES FORMULAIRE
  // ==================================

  /** Nom de famille de l'utilisateur. */
  valueLastName = '';
  /** Prénom de l'utilisateur. */
  valueName = '';

  /** Adresse email de l'utilisateur. */
  valueMail = '';
  /** Nom d'utilisateur unique. */
  valueUsername = '';

  /** Date de naissance de l'utilisateur. */
  birthdate: Date | null = null;

  /** Sexe de l'utilisateur (Homme, Femme ou Autre). */
  valueSexe: string | null = null;

  /** Mot de passe saisi. */
  valuePassword = '';
  /** Confirmation du mot de passe pour vérification. */
  valueValidationPassword = '';

  // ==================================
  // OPTIONS SELECT
  // ==================================

  /** Liste des options pour le choix du sexe. */
  genders = [
    {
      label: 'Homme',
      value: 'Homme',
    },
    {
      label: 'Femme',
      value: 'Femme',
    },
    {
      label: 'Autre',
      value: 'Autre',
    },
  ];

  // ==================================
  // ERREURS
  // ==================================

  /** Indique si le format de l'email est invalide. */
  emailError = false;
  /** Indique si les deux mots de passe saisis ne correspondent pas. */
  passwordError = false;

  // ==================================
  // RÈGLES MOT DE PASSE
  // ==================================

  /** Vérifie si le mot de passe contient au moins 8 caractères. */
  get passwordHasMinLength(): boolean {
    return this.valuePassword.length >= 8;
  }

  /** Vérifie si le mot de passe contient au moins une majuscule. */
  get passwordHasUpperCase(): boolean {
    return /[A-Z]/.test(this.valuePassword);
  }

  /** Vérifie si le mot de passe contient au moins une minuscule. */
  get passwordHasLowerCase(): boolean {
    return /[a-z]/.test(this.valuePassword);
  }

  /** Vérifie si le mot de passe contient au moins un chiffre. */
  get passwordHasNumber(): boolean {
    return /\d/.test(this.valuePassword);
  }

  /** Vérifie si les deux mots de passe sont identiques et non vides. */
  get passwordsMatch(): boolean {
    return this.valuePassword.length > 0 && this.valuePassword === this.valueValidationPassword;
  }

  // ==================================
  // VALIDATION
  // ==================================

  /**
   * Valide l'ensemble du formulaire.
   * Vérifie le format de l'email via une expression régulière et
   * applique les règles de sécurité du mot de passe.
   *
   * @returns true si le formulaire est valide, false sinon.
   */
  validateForm(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    this.emailError = !emailRegex.test(this.valueMail);

    this.passwordError = this.valuePassword !== this.valueValidationPassword;

    const strongPassword =
      this.passwordHasLowerCase &&
      this.passwordHasUpperCase &&
      this.passwordHasNumber &&
      this.passwordHasMinLength;

    return !this.emailError && !this.passwordError && strongPassword;
  }

  // ==================================
  // INSCRIPTION
  // ==================================

  /**
   * Tente d'inscrire l'utilisateur.
   * Si le formulaire est valide, les données sont collectées.
   * Réinitialise le formulaire après une inscription réussie.
   */
  register(): void {
    if (!this.validateForm()) {
      console.warn('Formulaire invalide');
      return;
    }

    const registerData = {
      nom: this.valueLastName,
      prenom: this.valueName,
      email: this.valueMail,
      username: this.valueUsername,
      dateNaissance: this.birthdate,
      sexe: this.valueSexe,
      password: this.valuePassword,
    };

    console.log('Inscription validée');
    console.log(registerData);

    // TODO :
    // Appeler ici ton service API

    // this.authService.register(registerData)
    //   .subscribe(...);

    this.resetForm();
  }

  // ==================================
  // RESET FORMULAIRE
  // ==================================

  /**
   * Réinitialise tous les champs du formulaire et les états d'erreur.
   */
  resetForm(): void {
    this.valueLastName = '';
    this.valueName = '';

    this.valueMail = '';
    this.valueUsername = '';

    this.birthdate = null;

    this.valueSexe = null;

    this.valuePassword = '';
    this.valueValidationPassword = '';

    this.emailError = false;
    this.passwordError = false;
  }

}
