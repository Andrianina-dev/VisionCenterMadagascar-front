const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/member/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'omit', // Changé pour éviter les conflits CORS
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Stocker les informations du membre dans localStorage
        localStorage.setItem('member', JSON.stringify(data.member));
        localStorage.setItem('auth', 'true');
        return { success: true, member: data.member };
      } else {
        throw new Error(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async loginAdmin(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Stocker les informations de l'admin dans localStorage
        localStorage.setItem('admin', JSON.stringify(data.data.admin));
        localStorage.setItem('auth', 'true');
        localStorage.setItem('role', 'admin');
        return { success: true, admin: data.data.admin };
      } else {
        throw new Error(data.message || 'Erreur de connexion admin');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      const role = localStorage.getItem('role');
      const endpoint = role === 'admin' ? '/admin/logout' : '/member/logout';
      
      // Appeler l'API de déconnexion
      await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include' // Important pour les cookies de session
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Nettoyer le localStorage même si l'API échoue
      localStorage.removeItem('auth');
      localStorage.removeItem('member');
      localStorage.removeItem('admin');
      localStorage.removeItem('role');
    }
  }

  isLoggedIn() {
    return localStorage.getItem('auth') === 'true' && 
           (localStorage.getItem('member') || localStorage.getItem('admin'));
  }

  getCurrentMember() {
    const member = localStorage.getItem('member');
    return member ? JSON.parse(member) : null;
  }

  getCurrentAdmin() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isAdmin() {
    return this.getRole() === 'admin';
  }

  getMemberToken() {
    // Pour l'instant, on n'utilise pas de token JWT
    // Mais cette méthode peut être ajoutée plus tard
    return null;
  }
}

export default new AuthService();
