import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavigationSiteVitrine.css';
import AuthService from '../../services/auth.service';

const NavigationSiteVitrine = ({ scrollToSection, sections = ['hero', 'features', 'activities', 'cta', 'footer'] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Vérifier si un utilisateur est connecté
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Utiliser l'API pour récupérer l'utilisateur connecté
        const user = await AuthService.getCurrentUserFromAPI();
        
        if (user) {
          setUser(user);
        } else {
          // Fallback: vérifier localStorage si l'API ne fonctionne pas
          const localUser = AuthService.getCurrentUser();
          setUser(localUser);
        }
      } catch (error) {
        console.error('Erreur checkUserStatus:', error);
        // Fallback: vérifier localStorage
        const localUser = AuthService.getCurrentUser();
        setUser(localUser);
      }
    };

    checkUserStatus();
    
    // Écouter les changements dans localStorage (pour compatibilité)
    const handleStorageChange = () => {
      const localUser = AuthService.getCurrentUser();
      setUser(localUser);
    };
    
    // Écouter l'événement de déconnexion
    const handleLogoutEvent = () => {
      setUser(null);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-logged-out', handleLogoutEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-logged-out', handleLogoutEvent);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Only track active sections on home page
      if (location.pathname === '/') {
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        setActiveSection(current || '');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, location.pathname]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate('/#' + sectionId);
    }
  };

  const isActive = (section) => {
    return location.pathname === '/' && activeSection === section;
  };

  const handleLogout = () => {
    // Déconnecter immédiatement
    AuthService.logout();
    
    // Mettre à jour l'état local immédiatement
    setUser(null);
    
    // Nettoyer le localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Rediriger après un court délai pour assurer la mise à jour
    setTimeout(() => {
      navigate('/login');
    }, 50);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <div className="logo-icon">✨</div>
          <div className="logo-text">
            <h1>Vision Center</h1>
            <span className="tagline">Madagascar</span>
          </div>
        </div>
        <nav className="nav">
          <ul className="nav-links">
            <li>
              <a 
                href="/accueil" 
                onClick={() => navigate('/accueil')} 
                className={location.pathname === '/accueil' ? 'active' : ''}
              >
                Accueil
              </a>
            </li>
            <li>
              <a 
                href="/site-vitrine" 
                onClick={() => navigate('/site-vitrine#features')} 
                className="nav-link"
              >
                Valeurs
              </a>
            </li>
            <li>
              <a 
                href="#activities" 
                onClick={(e) => handleNavClick(e, 'activities')} 
                className={isActive('activities') ? 'active' : ''}
              >
                Événements
              </a>
            </li>
            <li>
              <a 
                href="/galerie" 
                onClick={() => navigate('/galerie')} 
                className="nav-link"
              >
                Galerie
              </a>
            </li>
            <li>
              <a 
                href="/location-salle" 
                onClick={() => navigate('/location-salle')} 
                className="nav-link"
              >
                Location de salle
              </a>
            </li>
            {user && user.role === 'membre' && (
              <>
                <li>
                  <a 
                    href="/espace-membre" 
                    onClick={() => navigate('/espace-membre')} 
                    className="nav-link"
                  >
                    Espace membre
                  </a>
                </li>
                <li>
                  <a 
                    href="/paiement-reservation-salle" 
                    onClick={() => navigate('/paiement-reservation-salle')} 
                    className="nav-link"
                  >
                    Réservations
                  </a>
                </li>
              </>
            )}
            {user && user.role === 'non_membre' && (
              <li>
                <a 
                  href="/paiement-reservation-salle" 
                  onClick={() => navigate('/paiement-reservation-salle')} 
                  className="nav-link"
                >
                  Réservations
                </a>
              </li>
            )}
            <li>
              {user && (user.role === 'membre' || user.role === 'non_membre') ? (
                <div 
                  className="user-profile" 
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="profile-avatar">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.prenom && user.nom ? `${user.prenom}+${user.nom}` : user.firstName || user.name || user.email?.split('@')[0] || 'U'}&background=random&color=fff&size=28`} 
                      alt="Profile" 
                    />
                    <div className="profile-status-dot"></div>
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">
                      {(() => {
                        const prenom = user.prenom_utilisateur || user.prenom || user.firstName || '';
                        const nom = user.nom_utilisateur || user.nom || user.name || '';
                        
                        if (prenom && nom) {
                          return (
                            <>
                              <span>{prenom.charAt(0).toUpperCase() + prenom.slice(1)}</span>
                              <span className="name-separator"></span>
                              <span>{nom.charAt(0).toUpperCase() + nom.slice(1)}</span>
                            </>
                          );
                        } else {
                          const fallbackName = prenom || nom || user.email?.split('@')[0] || 'Utilisateur';
                          return fallbackName;
                        }
                      })()}
                    </span>
                    <span className="profile-role">
                      {user.role === 'admin' ? 'Administrateur' : 
                       user.role === 'membre' ? 'Membre' :
                       user.role === 'non_membre' ? 'non membre' :
                       user.role || 'Utilisateur'}
                    </span>
                  </div>
                  <div className={`profile-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            (user.prenom_utilisateur || user.prenom || user.firstName || '') + ' ' + 
                            (user.nom_utilisateur || user.nom || user.name || '')
                          )}&background=random&color=fff&size=60`} 
                          alt="Profile" 
                        />
                      </div>
                      <div className="dropdown-info">
                        <div className="dropdown-name">
                          {(() => {
                            const prenom = user.prenom_utilisateur || user.prenom || user.firstName || '';
                            const nom = user.nom_utilisateur || user.nom || user.name || '';
                            
                            if (prenom && nom) {
                              return `${prenom.charAt(0).toUpperCase() + prenom.slice(1)} ${nom.charAt(0).toUpperCase() + nom.slice(1)}`;
                            } else {
                              const fallbackName = prenom || nom || user.email?.split('@')[0] || 'Utilisateur';
                              return fallbackName;
                            }
                          })()}
                        </div>
                        <div className="dropdown-email">{user.email || 'membre@visioncenter.mg'}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button onClick={() => navigate('/profile')} className="dropdown-item">
                      Profil
                    </button>
                    <button onClick={() => navigate('/settings')} className="dropdown-item">
                      Paramètres
                    </button>
                    <button onClick={() => navigate('/espace-membre')} className="dropdown-item">
                      Espace Membre
                    </button>
                    <button onClick={() => navigate('/member/messages')} className="dropdown-item">
                      Messages
                    </button>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className="btn-primary btn-member">
                  Se connecter
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavigationSiteVitrine;
