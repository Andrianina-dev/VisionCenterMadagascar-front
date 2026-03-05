// Service API pour communiquer avec le backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Salles endpoints
  async getSalles() {
    return this.get('/salles/all');
  }

  async getSalle(id) {
    return this.get(`/salles/${id}`);
  }

  async searchSalles(criteria) {
    const params = new URLSearchParams();
    Object.keys(criteria).forEach(key => {
      if (criteria[key]) {
        params.append(key, criteria[key]);
      }
    });
    return this.get(`/salles/search?${params}`);
  }

  async getSallesDisponibles() {
    return this.get('/salles/disponibles');
  }

  async checkDisponibilite(salleId, dateDebut, dateFin) {
    return this.get(`/salles/${salleId}/check-disponibilite?date_debut=${dateDebut}&date_fin=${dateFin}`);
  }

  // Reservations endpoints
  async createReservation(data) {
    return this.post('/reservations', data);
  }

  async createReservationForNonMember(reservationData, memberData) {
    return this.post('/reservations/for-non-member', {
      reservation: reservationData,
      member: memberData
    });
  }

  async createOrFindNonMember(memberData) {
    return this.post('/member/auth/create-non-membre', {
      email: memberData.email,
      nom: memberData.nom,
      prenom: memberData.prenom,
      numero_carte_identite: memberData.numero_carte_identite
    });
  }

  async getReservations() {
    return this.get('/reservations');
  }

  async getReservation(id) {
    return this.get(`/reservations/${id}`);
  }

  async updateReservation(id, data) {
    return this.put(`/reservations/${id}`, data);
  }

  async deleteReservation(id) {
    return this.delete(`/reservations/${id}`);
  }

  // Auth endpoints
  async login(credentials) {
    return this.post('/login', credentials);
  }

  async register(userData) {
    return this.post('/register', userData);
  }

  async logout() {
    return this.post('/logout');
  }

  async getUser() {
    return this.get('/user');
  }
}

export default new ApiService();
