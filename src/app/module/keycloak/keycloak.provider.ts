import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';
import { environment } from '../../../environments/environment';

// ─── Interceptors ─────────────────────────────────────────────────────────────
// ✅ Inchangé — correct tel quel.

/**
 * Condition d'interception pour ajouter le jeton Bearer aux appels vers le serveur Keycloak.
 */
const keycloakInterceptorCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  bearerPrefix: 'Bearer',
  urlPattern: new RegExp(`^(${environment.keycloak.config.url})(\\/.*)?$`, 'i'),
});

/**
 * Condition d'interception pour ajouter le jeton Bearer aux appels vers le backend Spring.
 * Couvre à la fois l'URI spécifique au backend Keycloak et l'URI générale de l'application.
 */
const backEndInterceptorCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  bearerPrefix: 'Bearer',
  urlPattern: new RegExp(
    `^(${environment.keycloak.config.backEndUri}|${environment.uri})(\\/.*)?$`,
    'i',
  ),
});

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Fournisseur Angular pour configurer et initialiser Keycloak.
 *
 * ⚠️ CHANGEMENT IMPORTANT : c'est désormais ICI, et UNIQUEMENT ici, que Keycloak
 * est initialisé (via `initOptions`). Le `KeycloakStore` ne doit plus appeler
 * `kc.init()` lui-même — il doit seulement lire l'état déjà mis en place par
 * `provideKeycloak`, via le signal d'événements `KEYCLOAK_EVENT_SIGNAL`.
 * Avoir deux appels à `kc.init()` sur la même instance provoque une erreur
 * Keycloak ("instance can only be initialized once").
 *
 * @returns Un ensemble de fournisseurs pour l'initialisation de Keycloak dans l'application.
 */
export const provideKeycloakAngular = () => {
  const { config, sessionTimeout } = environment.keycloak;
  // ⚠️ `redirectUri` retiré de la déstructuration : il n'était pas utilisé
  // dans ce fichier. S'il te sert ailleurs (ex: dans login()), garde-le côté
  // KeycloakStore plutôt qu'ici.

  return provideKeycloak({
    config: {
      url: config.url,
      realm: config.realm,
      clientId: config.clientId,
    },

    // ✅ AJOUTÉ — c'est la pièce manquante qui remplace kc.init() du store.
    initOptions: {
      // 'check-sso' : ne force pas la redirection au chargement si pas connecté
      // (laisse l'app afficher /login proprement plutôt qu'une redirection brutale
      // vers Keycloak dès l'ouverture de l'app). Passe en 'login-required' si tu
      // préfères qu'AUCUNE page ne soit jamais visible sans session active.
      onLoad: 'check-sso',

      // Nécessaire pour que 'check-sso' fonctionne sans redirection visible :
      // Keycloak vérifie la session via un iframe caché plutôt qu'un redirect complet.
      silentCheckSsoRedirectUri: window.location.origin + '/keycloak/silent-check-sso.html',

      // Recommandé avec les clients publics (SPA) pour la sécurité du flow OAuth.
      pkceMethod: 'S256',
    },

    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout,
      }),
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [keycloakInterceptorCondition, backEndInterceptorCondition],
      },
    ],
  });
};
