// Services pour la galerie
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

class GalerieService {
  // Récupérer tous les médias
  static async getAllMedias() {
    try {
      const response = await fetch(`${API_BASE}/api/public/medias`);
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      const json = await response.json();

      const result = Array.isArray(json) ? json : (json?.data || []);
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des médias:', error);
      throw error;
    }
  }

  // Récupérer les médias par galerie
  static async getMediasByGalerie(idGalerie) {
    try {
      const response = await fetch(`${API_BASE}/api/public/medias/galerie/${idGalerie}`);
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      const json = await response.json();
      return Array.isArray(json) ? json : (json?.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des médias par galerie:', error);
      throw error;
    }
  }

  // Récupérer un média par ID
  static async getMediaById(id) {
    try {
      const response = await fetch(`${API_BASE}/api/public/medias/${id}`);
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du média:', error);
      throw error;
    }
  }
}

export default GalerieService;
