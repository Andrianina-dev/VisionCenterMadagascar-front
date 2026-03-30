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
        
        // Log pour débogage
        console.log('AuthService - Données stockées:', {
          member: data.member,
          memberString: localStorage.getItem('member')
        });
        
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

  getCurrentUser() {
    try {
      // Vérifier tous les types d'utilisateurs connectés
      const adminData = localStorage.getItem('admin');
      const memberData = localStorage.getItem('member');
      const nonMemberData = localStorage.getItem('non-member');
      const userData = localStorage.getItem('user');

      if (adminData) {
        return { ...JSON.parse(adminData), role: 'admin' };
      } else if (memberData) {
        return { ...JSON.parse(memberData), role: 'membre' };
      } else if (nonMemberData) {
        return { ...JSON.parse(nonMemberData), role: 'non-membre' };
      } else if (userData) {
        return { ...JSON.parse(userData), role: 'utilisateur' };
      }
      return null;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return null;
    }
  }

  async getCurrentUserFromAPI() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/member/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Ajouter le rôle depuis les données utilisateur
          const userWithRole = {
            ...data.user,
            role: this.detectRole(data.user)
          };
          return userWithRole;
        }
      }
      return null;
    } catch (error) {
      console.error('Erreur getCurrentUserFromAPI:', error);
      return null;
    }
  }

  detectRole(user) {
    // Détecter le rôle selon les propriétés de l'utilisateur
    if (user.type === 'admin' || user.role === 'admin') {
      return 'admin';
    } else if (user.type === 'membre' || user.role === 'membre') {
      return 'membre';
    } else if (user.type === 'non-membre' || user.role === 'non-membre') {
      return 'non-membre';
    }
    return 'utilisateur';
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
