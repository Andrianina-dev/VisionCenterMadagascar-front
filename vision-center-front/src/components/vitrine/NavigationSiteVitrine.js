import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavigationSiteVitrine.css';
import AuthService from '../../services/auth.service';

const NavigationSiteVitrine = ({ scrollToSection, sections = ['hero', 'features', 'activities', 'cta', 'footer'] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [user, setUser] = useState(null);

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
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
                href="#features" 
                onClick={(e) => handleNavClick(e, 'features')} 
                className={isActive('features') ? 'active' : ''}
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
                    href="/dashboard" 
                    onClick={() => navigate('/dashboard')} 
                    className="nav-link"
                  >
                    Espace membre
                  </a>
                </li>
                <li>
                  <a 
                    href="/reservations" 
                    onClick={() => navigate('/reservations')} 
                    className="nav-link"
                  >
                    Réservations
                  </a>
                </li>
              </>
            )}
            <li>
              {user ? (
                <div className="user-profile">
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
                       user.role === 'non-membre' ? 'Non-membre' :
                       user.role || 'Utilisateur'}
                    </span>
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
