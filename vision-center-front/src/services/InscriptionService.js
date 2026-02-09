// Services pour les inscriptions aux activités
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

class InscriptionService {
  // Inscrire un membre à une activité
  static async inscrire(activiteId, participantData) {
    try {
      const response = await fetch(`${API_BASE}/api/public/inscriptions/${activiteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur API: ${response.status}`);
      }
      
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Obtenir les participants d'une activité
  static async getParticipants(activiteId) {
    try {
      const response = await fetch(`${API_BASE}/api/public/inscriptions/${activiteId}/participants`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
      throw error;
    }
  }

  // Désinscrire un participant d'une activité
  static async desinscrire(activiteId, participantId) {
    try {
      const response = await fetch(`${API_BASE}/api/public/inscriptions/${activiteId}/desinscrire`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participant_id: participantId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur API: ${response.status}`);
      }
      
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      throw error;
    }
  }

  // Vérifier si un participant est inscrit à une activité
  static async verifierInscription(activiteId, participantId) {
    try {
      const response = await fetch(`${API_BASE}/api/public/inscriptions/verifier/${activiteId}/${participantId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const json = await response.json();
      return json.data || { is_inscrit: false };
    } catch (error) {
      console.error('Erreur lors de la vérification d\'inscription:', error);
      throw error;
    }
  }

  // Obtenir les activités d'un participant
  static async getMesActivites(participantId) {
    try {
      const response = await fetch(`${API_BASE}/api/member/activities/${participantId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des activités du participant:', error);
      throw error;
    }
  }
}

export default InscriptionService;
