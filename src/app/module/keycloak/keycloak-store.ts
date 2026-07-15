/**
 * ============================================================================
 * KEYCLOAK STORE
 * ============================================================================
 *
 * Store global de l'authentification.
 *
 * Responsabilités :
 *  - Conserver l'état courant de Keycloak.
 *  - Exposer les informations de l'utilisateur.
 *  - Fournir les méthodes login / logout / refresh.
 *  - Réagir automatiquement aux événements Keycloak.
 *
 * IMPORTANT
 * ----------
 * Depuis keycloak-angular 21, l'initialisation est réalisée uniquement
 * par provideKeycloak() dans keycloak.provider.ts.
 *
 * Ce store n'appelle donc JAMAIS kc.init().
 * Il écoute uniquement les événements émis par KEYCLOAK_EVENT_SIGNAL.
 * ============================================================================
 */

import {
  computed,
  effect,
  inject,
} from '@angular/core';

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

import { withDevtools } from '@angular-architects/ngrx-toolkit';

import Keycloak from 'keycloak-js';

import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
} from 'keycloak-angular';

/* ============================================================================
 * STORE
 * ========================================================================== */

export const KeycloakStore = signalStore(
  /**
   * Injection globale
   */
  {
    providedIn: 'root',
  },

  /**
   * DevTools
   */
  withDevtools('KeycloakStore'),

  /* ==========================================================================
   * STATE
   * ======================================================================== */

  withState({
    /**
     * Instance Keycloak.
     */
    keycloak: null as Keycloak | null,

    /**
     * Keycloak a terminé son initialisation.
     */
    initialized: false,

    /**
     * Store prêt.
     */
    ready: false,

    /**
     * Utilisateur connecté ?
     */
    authenticated: false,

    /**
     * Token décodé.
     */
    tokenParsed: null as Keycloak.KeycloakTokenParsed | null,

    /**
     * Profil utilisateur.
     */
    user: null as Awaited<ReturnType<Keycloak['loadUserProfile']>> | null,
  }),

  /* ==========================================================================
   * COMPUTED
   * ======================================================================== */

  withComputed((state) => ({
    /**
     * Nom d'utilisateur.
     */
    username: computed(() => {
      const token = state.tokenParsed() as any;
      return token?.preferred_username ?? null;
    }),

    /**
     * Email.
     */
    email: computed(() => {
      const token = state.tokenParsed() as any;
      return token?.email ?? null;
    }),

    /**
     * Nom complet.
     */
    fullName: computed(() => {
      const user = state.user();

      if (!user) {
        return null;
      }

      return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    }),

    /**
     * Prénom.
     */
    firstName: computed(() => state.user()?.firstName ?? null),

    /**
     * Nom.
     */
    lastName: computed(() => state.user()?.lastName ?? null),

    /**
     * Rôles du Realm.
     */
    roles: computed(() => {
      const token = state.tokenParsed() as any;
      return token?.realm_access?.roles ?? [];
    }),

    /**
     * JWT brut.
     */
    token: computed(() => state.keycloak()?.token ?? null),
  })),
  /* ==========================================================================
   * METHODS
   * ======================================================================== */

  withMethods((state, kc = inject(Keycloak)) => ({
    /**
     * =========================================================================
     * LOGIN
     * =========================================================================
     */
    login: async (opts?: { redirectUri?: string }) => {
      await kc.login({
        redirectUri: opts?.redirectUri ?? window.location.origin + '/dashboard',
      });
    },

    /**
     * =========================================================================
     * LOGOUT
     * =========================================================================
     */
    logout: async () => {
      patchState(state, {
        authenticated: false,
        tokenParsed: null,
        user: null,
      });

      await kc.logout({
        redirectUri: window.location.origin,
      });
    },

    /**
     * =========================================================================
     * REGISTER
     * =========================================================================
     */
    register: async () => {
      await kc.register();
    },

    /**
     * =========================================================================
     * HAS ROLE
     * =========================================================================
     */
    hasRole: (role: string): boolean => {
      return kc.hasRealmRole(role) || kc.hasResourceRole(role);
    },

    /**
     * =========================================================================
     * REFRESH TOKEN
     * =========================================================================
     *
     * Rafraîchit le token si celui-ci expire dans moins de 30 secondes.
     */
    refresh: async () => {
      if (!kc.authenticated) {
        return;
      }

      try {
        const refreshed = await kc.updateToken(30);

        if (refreshed) {
          console.info('✅ Token rafraîchi.');

          patchState(state, {
            tokenParsed: kc.tokenParsed ?? null,
          });
        }
      } catch (err) {
        console.error('❌ Échec du refresh du token', err);

        patchState(state, {
          authenticated: false,
          tokenParsed: null,
          user: null,
        });

        await kc.logout({
          redirectUri: window.location.origin,
        });
      }
    },

    /**
     * =========================================================================
     * SYNCHRONISATION DU STORE
     * =========================================================================
     *
     * Recharge complètement les informations de Keycloak.
     */
    syncState: async () => {
      let profile = null;

      if (kc.authenticated) {
        try {
          profile = await kc.loadUserProfile();
        } catch (err) {
          console.error('Impossible de charger le profil.', err);
        }
      }

      patchState(state, {
        keycloak: kc,

        initialized: true,

        ready: true,

        authenticated: !!kc.authenticated,

        tokenParsed: kc.tokenParsed ?? null,

        user: profile,
      });
    },

    /**
     * =========================================================================
     * FORCE LOGOUT
     * =========================================================================
     *
     * Appelé lorsqu'une session devient invalide.
     */
    forceLogout: async () => {
      console.warn('⚠️ Session Keycloak perdue.');

      patchState(state, {
        authenticated: false,

        tokenParsed: null,

        user: null,
      });

      await kc.logout({
        redirectUri: window.location.origin,
      });
    },
  })),
  /* ==========================================================================
   * HOOKS
   * ======================================================================== */

  withHooks({
    /**
     * Exécuté une seule fois lors de la création du Store.
     */
    onInit(store) {
      console.info('🚀 KeycloakStore initialisé');

      const eventSignal = inject(KEYCLOAK_EVENT_SIGNAL);

      effect(() => {
        const event = eventSignal();

        /**
         * Si aucun événement n'est encore disponible,
         * on attend simplement.
         */
        if (!event) {
          return;
        }

        console.info('📢 KEYCLOAK EVENT :', event.type);

        switch (event.type) {
          /**
           * Keycloak a terminé son initialisation.
           */
          case KeycloakEventType.Ready:
            store.syncState();
            break;

          /**
           * Connexion réussie.
           */
          case KeycloakEventType.AuthSuccess:
            store.syncState();
            break;

          /**
           * Rafraîchissement du token réussi.
           */
          case KeycloakEventType.AuthRefreshSuccess:
            store.syncState();
            break;

          /**
           * Déconnexion.
           */
          case KeycloakEventType.AuthLogout:
            store.syncState();
            break;

          /**
           * Le refresh token a échoué.
           * (session supprimée, expirée, révoquée...)
           */
          case KeycloakEventType.AuthRefreshError:
            console.error('❌ Refresh Token Error');

            store.forceLogout();

            break;

          /**
           * Erreur d'authentification.
           */
          case KeycloakEventType.AuthError:
            console.error('❌ Auth Error');

            store.forceLogout();

            break;

          default:
            break;
        }
      });
    },
  }),
);
