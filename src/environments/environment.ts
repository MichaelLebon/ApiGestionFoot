/**
 * Configuration de l'environnement de production.
 */
export const environment = {
  /** URI de base du backend */
  uri: 'http://localhost:8080',
  /** URL de l'API */
  apiUrl: 'http://localhost:8080/api',

  /** Configuration Keycloak */
  keycloak: {
    /** Configuration interne de Keycloak */
    config: {
      /** URL du serveur Keycloak */
      url: 'http://localhost:8088',
      /** Royaume (realm) Keycloak utilisé */
      realm: 'GestionEquipe',
      /** ID du client Keycloak pour l'application Angular */
      clientId: 'Angular-app-GestionEquipe',
      /** Informations d'identification du client */
      credentials: {
        /** Secret du client (si applicable) */
        secret: 'xxx',
      },
      /** URI du backend pour les échanges Keycloak */
      backEndUri: 'http://localhost:8080',
    },
    /** URI de redirection après authentification */
    redirectUri: 'http://localhost:4200',
    /** Durée de la session en secondes */
    sessionTimeout: 3600,
    /** Configuration du gestionnaire Keycloak */
    manager: {
      /** ID du client pour le gestionnaire */
      client_id: 'Angular-app-GestionEquipe',
      /** Secret pour le gestionnaire */
      secret: 'xxx',
    },
  },
};
