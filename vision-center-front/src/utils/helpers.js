import { DATE_FORMATS } from './constants';

// Formatage des dates
export const formatDate = (date, format = DATE_FORMATS.SHORT) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    [DATE_FORMATS.SHORT]: { day: '2-digit', month: '2-digit', year: 'numeric' },
    [DATE_FORMATS.LONG]: { day: 'numeric', month: 'long', year: 'numeric' },
    [DATE_FORMATS.WITH_TIME]: { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    [DATE_FORMATS.TIME_ONLY]: { hour: '2-digit', minute: '2-digit' }
  };
  
  return d.toLocaleDateString('fr-FR', options[format] || options[DATE_FORMATS.SHORT]);
};

// Formatage court des dates
export const formatDateShort = (date) => {
  return formatDate(date, DATE_FORMATS.SHORT);
};

// Vérification si une date est dans le futur
export const isFutureDate = (date) => {
  if (!date) return false;
  return new Date(date) > new Date();
};

// Vérification si une date est dans le passé
export const isPastDate = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

// Calcul du temps restant
export const getTimeRemaining = (date) => {
  if (!date) return null;
  
  const now = new Date();
  const target = new Date(date);
  const difference = target - now;
  
  if (difference <= 0) return null;
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return 'Quelques secondes';
};

// Gestion des erreurs
export const handleError = (error, defaultMessage = 'Une erreur est survenue') => {
  if (error.response) {
    // Erreur réponse du serveur
    return error.response.data?.message || defaultMessage;
  } else if (error.request) {
    // Erreur de réseau
    return 'Erreur de connexion. Veuillez vérifier votre connexion internet.';
  } else {
    // Erreur JavaScript
    return error.message || defaultMessage;
  }
};

// Validation d'email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validation de téléphone
export const isValidPhone = (phone) => {
  const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

// Formatage du nom
export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  if (!firstName) return lastName?.toUpperCase() || '';
  if (!lastName) return firstName;
  return `${firstName} ${lastName.toUpperCase()}`;
};

// Génération d'ID unique
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Copier dans le presse-papiers
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie:', err);
    return false;
  }
};

// Téléchargement de fichier
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Scroll vers le haut
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Scroll vers un élément
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  }
};

// Vérification si un élément est visible dans le viewport
export const isElementInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Formatage de nombre avec séparateur de milliers
export const formatNumber = (number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

// Formatage de devise
export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount);
};
