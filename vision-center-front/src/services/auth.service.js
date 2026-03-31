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
        localStorage.setItem('member', JSON.stringify(data.data.member));
        localStorage.setItem('auth', 'true');
        
        // Log pour débogage
                
        return { success: true, member: data.data.member };
      } else {
        throw new Error(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      // Appeler l'API de déconnexion pour les membres
      await fetch(`${API_BASE_URL}/member/logout`, {
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
      localStorage.removeItem('non_membre');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
  }

  isLoggedIn() {
    return localStorage.getItem('auth') === 'true' && 
           (localStorage.getItem('member') || localStorage.getItem('non_membre'));
  }

  getCurrentUser() {
    try {
      // Vérifier les types d'utilisateurs membres et non-membres
      const nonMemberData = localStorage.getItem('non_membre');
      const memberData = localStorage.getItem('member');
      const userData = localStorage.getItem('user');

      if (nonMemberData) {
        return JSON.parse(nonMemberData);
      } else if (memberData) {
        return JSON.parse(memberData);
      } else if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return null;
    }
  }

  async getCurrentUserFromAPI() {
    try {
      // Vérifier si nous sommes en développement et si l'API n'est pas accessible
      if (window.location.hostname === 'localhost' && window.location.port === '3000') {
        // En développement, essayer de récupérer depuis localStorage en premier
        const localUser = localStorage.getItem('user');
        if (localUser) {
          try {
            const userData = JSON.parse(localUser);
            const userWithRole = {
              ...userData,
              role: this.detectRole(userData)
            };
            return userWithRole;
          } catch (error) {
            console.error('Erreur parsing localStorage user:', error);
          }
        }
        return null;
      }
      
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
    if (user.type === 'membre' || user.role === 'membre') {
      return 'membre';
    } else if (user.type === 'non_membre' || user.role === 'non_membre') {
      return 'non-membre';
    }
    return 'utilisateur';
  }

  getRole() {
    return localStorage.getItem('role');
  }

  getMemberToken() {
    // Pour l'instant, on n'utilise pas de token JWT
    // Mais cette méthode peut être ajoutée plus tard
    return null;
  }
}

export default new AuthService();
