import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

// ─── STORE ──────────────────────────────────────────────
/**
 * Store Signal gérant l'état de l'authentification Keycloak.
 * Ce store permet de centraliser les informations de l'utilisateur et les méthodes d'authentification.
 */
export const KeycloakStore = signalStore(
  { providedIn: 'root' },

  withDevtools('keycloak'),

  /**
   * État initial du store Keycloak.
   */
  withState({
    /** Instance de Keycloak JS */
    keycloak: null as Keycloak | null,
    /** Indique si Keycloak a été initialisé */
    initialized: false,
    /** Indique si le store est prêt à être utilisé */
    ready: false,
    /** Indique si l'utilisateur est authentifié */
    authenticated: false,
    /** Le jeton (token) décodé */
    tokenParsed: null as any,
    /** Profil de l'utilisateur */
    user: null as any,
  }),

  /**
   * Propriétés calculées à partir de l'état.
   */
  withComputed((state) => ({
    /** Nom d'utilisateur extrait du token */
    username: computed(() => state.tokenParsed()?.preferred_username ?? null),

    /** Email de l'utilisateur extrait du token */
    email: computed(() => state.tokenParsed()?.email ?? null),

    /** Liste des rôles de l'utilisateur (realm roles) */
    roles: computed(() => state.tokenParsed()?.realm_access?.roles ?? []),
  })),

  /**
   * Méthodes permettant d'interagir avec Keycloak.
   */
  withMethods((state, kc = inject(Keycloak)) => ({
    /**
     * Initialise l'instance Keycloak.
     * Configure le SSO silencieux et charge le profil utilisateur si authentifié.
     */
    init: async () => {
      try {
        const authenticated = await kc.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          silentCheckSsoRedirectUri: window.location.origin + '/keycloak/silent-check-sso.html',
        });

        let user = null;

        if (authenticated) {
          user = await kc.loadUserProfile();
        }

        patchState(state, {
          keycloak: kc,
          authenticated,
          initialized: true,
          ready: true,
          tokenParsed: kc.tokenParsed ?? null,
          user,
        });
      } catch (err) {
        console.error('Keycloak init error:', err);

        patchState(state, {
          keycloak: kc,
          authenticated: false,
          initialized: true,
          ready: true,
          tokenParsed: null,
          user: null,
        });
      }
    },

    /**
     * Redirige l'utilisateur vers la page de connexion Keycloak.
     * @param opts Options de redirection
     */
    login: (opts?: { redirectUri?: string }) =>
      kc.login({
        redirectUri: opts?.redirectUri ?? window.location.origin + '/dashboard',
      }),

    /**
     * Déconnecte l'utilisateur de Keycloak.
     * @param opts Options de déconnexion (ex: redirectUri)
     */
    logout: (opts: Partial<{ redirectUri: string }> = {}) =>
      kc.logout({
        redirectUri: window.location.origin,
        ...opts,
      }),

    /**
     * Redirige l'utilisateur vers la page d'inscription Keycloak.
     */
    register: () => kc.register(),

    /**
     * Vérifie si l'utilisateur possède un rôle spécifique (realm ou resource).
     * @param role Le nom du rôle à vérifier
     */
    hasRole: (role: string) => kc.hasRealmRole(role) || kc.hasResourceRole(role),

    /**
     * Rafraîchit le jeton d'accès si nécessaire.
     * Met à jour l'état du store avec le nouveau token parsé.
     */
    refresh: async () => {
      if (!kc.authenticated) return;

      try {
        const refreshed = await kc.updateToken(30);

        if (refreshed) {
          patchState(state, {
            tokenParsed: kc.tokenParsed ?? null,
          });
        }
      } catch (err) {
        console.error('Token refresh error:', err);
      }
    },
  })),
);
