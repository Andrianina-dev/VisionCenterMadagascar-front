const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export async function sendMessage(message, retryCount = 0) {
  const maxRetries = 3;
  const timeout = 30000; // 30 secondes
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Utiliser le endpoint Gemini avec système de fallback
    const response = await fetch(`${API_BASE_URL}/gemini/chat`, {
      method: 'POST',
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        message: message,
        conversation_history: []
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429 && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return sendMessage(message, retryCount + 1);
      }
      
      // Gestion spécifique des erreurs CORS
      if (response.status === 0 || response.type === 'opaque') {
        throw new Error('CORS_BLOCKED');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Adapter la réponse au format attendu par le frontend
    if (data.success) {
      return {
        success: true,
        message: data.response || data.message
      };
    } else {
      return {
        success: false,
        error: data.error || "Erreur inconnue"
      };
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Le service IA met trop de temps à répondre. Veuillez réessayer.');
    }
    
    // Gestion spécifique du blocage CORS
    if (error.message === 'CORS_BLOCKED') {
      throw new Error('🔒 Erreur CORS: Le backend doit être configuré avec Access-Control-Allow-Origin. Solution temporaire: Installez l\'extension "CORS Unblock" dans votre navigateur.');
    }
    
    if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
      throw new Error('🔒 Erreur CORS: Le backend doit être configuré pour autoriser les requêtes depuis localhost:3000. Solution immédiate: Installez l\'extension "CORS Unblock" dans Chrome/Firefox.');
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Problème de connexion au serveur IA. Vérifiez que le backend fonctionne sur localhost:8000.');
    }
    
    if (retryCount < maxRetries && !error.message.includes('429')) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return sendMessage(message, retryCount + 1);
    }
    
    throw error;
  }
}
