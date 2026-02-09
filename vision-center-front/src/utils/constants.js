// URLs de l'API
export const API_URLS = {
  BASE: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  INSCRIPTIONS: '/public/inscriptions',
  ACTIVITES: '/public/activites',
  MEMBRES: '/api/membres',
  AUTH: '/api/auth'
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
  AUTH_REQUIRED: 'Vous devez être connecté pour effectuer cette action.',
  INSCRIPTION_FAILED: 'L\'inscription a échoué. Veuillez réessayer.',
  DESINSCRIPTION_FAILED: 'La désinscription a échoué. Veuillez réessayer.',
  INVALID_DATA: 'Les données fournies sont invalides.',
  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  INSCRIPTION_SUCCESS: 'Inscription réussie !',
  DESINSCRIPTION_SUCCESS: 'Désinscription réussie !',
  LOGIN_SUCCESS: 'Connexion réussie !',
  LOGOUT_SUCCESS: 'Déconnexion réussie !',
  PROFILE_UPDATED: 'Profil mis à jour avec succès !'
};

// État de chargement
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'membre',
  PUBLIC: 'public'
};

// Statuts d'inscription
export const INSCRIPTION_STATUS = {
  REGISTERED: 'registered',
  NOT_REGISTERED: 'not_registered',
  PENDING: 'pending'
};

// Types d'activités
export const ACTIVITY_TYPES = {
  WORKSHOP: 'workshop',
  CONFERENCE: 'conference',
  MEETING: 'meeting',
  EVENT: 'event'
};

// Formats de date
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  TIME_ONLY: 'HH:mm'
};

// Limites de pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  DEFAULT_PAGE: 1
};

// Timeout en millisecondes
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 secondes
  AUTO_LOGOUT: 3600000, // 1 heure
  NOTIFICATION: 5000 // 5 secondes
};

// Clés localStorage
export const STORAGE_KEYS = {
  AUTH: 'auth',
  MEMBER: 'member',
  TOKEN: 'token',
  PREFERENCES: 'user_preferences',
  THEME: 'theme'
};
