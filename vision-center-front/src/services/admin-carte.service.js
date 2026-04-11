const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

class AdminCarteService {
  async getMapData() {
    const response = await fetch(`${BACKEND_BASE_URL}/admin/carte/data`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Impossible de charger les donnees de la carte admin.');
    }

    return response.json();
  }

  async getOpenActivities() {
    const response = await fetch(`${API_BASE_URL}/public/activites/ouvertes`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Impossible de charger les activites ouvertes.');
    }

    return response.json();
  }

  async updateCoordinates(activityId, latitude, longitude) {
    const response = await fetch(`${BACKEND_BASE_URL}/admin/carte/activite/${activityId}/coordinates`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'include',
      body: JSON.stringify({ latitude, longitude }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error || data?.message || 'Mise a jour des coordonnees impossible.';
      throw new Error(message);
    }

    return data;
  }
}

export default new AdminCarteService();
