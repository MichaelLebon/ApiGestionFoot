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
  bearerPrefix: 'Bearer', // ✅ uniformisé en 'Bearer' (majuscule)
  urlPattern: new RegExp(
    `^(${environment.keycloak.config.backEndUri}|${environment.uri})(\\/.*)?$`,
    'i',
  ),
});

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Fournisseur Angular pour configurer et initialiser Keycloak.
 * Configure le rafraîchissement automatique du jeton et les intercepteurs HTTP pour l'authentification.
 * 
 * @returns Un ensemble de fournisseurs pour l'initialisation de Keycloak dans l'application.
 */
export const provideKeycloakAngular = () => {
  const { config, redirectUri, sessionTimeout } = environment.keycloak;

  return provideKeycloak({
    config: {
      url: config.url,
      realm: config.realm,
      clientId: config.clientId,
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
