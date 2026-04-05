import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavigationSiteVitrine.css';
import AuthService from '../../services/auth.service';
import Button from '../common/Button';

const NavigationSiteVitrine = ({ scrollToSection, sections = ['hero', 'features', 'activities', 'cta', 'footer'] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Vérifier si un utilisateur est connecté
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const user = await AuthService.getCurrentUserFromAPI();
        if (user) {
          setUser(user);
        } else {
          const localUser = AuthService.getCurrentUser();
          setUser(localUser);
        }
      } catch (error) {
        console.error('Erreur checkUserStatus:', error);
        const localUser = AuthService.getCurrentUser();
        setUser(localUser);
      }
    };

    checkUserStatus();
    
    const handleStorageChange = () => {
      const localUser = AuthService.getCurrentUser();
      setUser(localUser);
    };
    
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

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate('/#' + sectionId);
    }
  };

  // Vérifier si un lien est actif
  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const isSectionActive = (section) => {
    return location.pathname === '/' && activeSection === section;
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      navigate('/login');
    }, 50);
  };

  // Déterminer les liens de navigation en fonction de la page actuelle
  const getNavLinks = () => {
    
    // EXCEPTION : pages avec navigation réduite (Espace Membre et Réservation)
    if (location.pathname === '/espace-membre' || location.pathname === '/paiement-reservation-salle') {
      return [
        { label: "Accueil", path: "/accueil" },
        { label: "Espace Membre", path: "/espace-membre" },
        { label: "Réservation", path: "/paiement-reservation-salle" },
        { label: "Location", path: "/location-salle" }
      ];
    }
    
    // PAR DÉFAUT : tous les liens normaux sur les autres pages
    return [
      { label: "Accueil", path: "/accueil" },
      { label: "À propos", path: "/a-propos" },
      { label: "Valeurs", path: "/site-vitrine" },
      { label: "Programmes & Activités", path: "/programmes-activites" },
      { label: "Galerie", path: "/galerie" },
      { label: "Location", path: "/location-salle" },
      { label: "Espace Membre", path: "/espace-membre" },
      
    ];
  };

  // État pour la langue sélectionnée
  const [selectedLanguage, setSelectedLanguage] = useState('mg');

  // Obtenir les informations de la langue sélectionnée
  const getLanguageInfo = (lang) => {
    const languages = {
      'mg': { flag: '🇲🇬', code: 'MG', name: 'Malagasy' },
      'en': { flag: '🇺🇸', code: 'EN', name: 'English' },
      'fr': { flag: '🇫🇷', code: 'FR', name: 'Français' }
    };
    return languages[lang] || languages['mg'];
  };

  const navLinks = getNavLinks();

  const handleLanguageChange = (lang) => {
    setIsLangDropdownOpen(false);
    setSelectedLanguage(lang);
    console.log('Langue changée vers:', lang);
    localStorage.setItem('language', lang);
  };

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  // Fonction pour obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    const prenom = user?.prenom_utilisateur || user?.prenom || user?.firstName || '';
    const nom = user?.nom_utilisateur || user?.nom || user?.name || '';
    
    if (prenom && nom) {
      return `${prenom.charAt(0).toUpperCase() + prenom.slice(1)} ${nom.charAt(0).toUpperCase() + nom.slice(1)}`;
    }
    return prenom || nom || user?.email?.split('@')[0] || 'Utilisateur';
  };

  const getUserInitials = () => {
    const prenom = user?.prenom_utilisateur || user?.prenom || user?.firstName || '';
    const nom = user?.nom_utilisateur || user?.nom || user?.name || '';
    
    if (prenom && nom) {
      return `${prenom.charAt(0)}${nom.charAt(0)}`;
    }
    const name = prenom || nom || user?.email?.split('@')[0] || 'U';
    return name.charAt(0).toUpperCase();
  };

  const getUserRoleLabel = () => {
    if (user?.role === 'admin') return 'Admin';
    if (user?.role === 'membre') return 'Membre';
    if (user?.role === 'non_membre') return 'Visiteur';
    return user?.role || '';
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo" onClick={() => handleNavigation('/')}>
          <div className="logo-icon">✨</div>
          <div className="logo-text">
            <h1>Vision Center Madagascar</h1>

          </div>
        </div>
        
        <nav className="nav">
          <ul className="nav-links">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.path} 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(link.path);
                  }} 
                  className={isLinkActive(link.path) ? 'active' : ''}
                >
                  {link.label}
                </a>
              </li>
            ))}
            
            {/* Profil utilisateur (si connecté) */}
            {user ? (
              <div 
                className="user-profile" 
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="profile-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${getUserInitials()}&background=019BFF&color=fff&size=34&bold=true&length=2`} 
                    alt="Profile" 
                  />
                  <div className="profile-status-dot"></div>
                </div>
                <div className="profile-info">
                  <span className="profile-name">{getUserFullName()}</span>
                  <span className="profile-role">{getUserRoleLabel()}</span>
                </div>
                <div className={`profile-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${getUserInitials()}&background=019BFF&color=fff&size=48&bold=true&length=2`} 
                        alt="Profile" 
                      />
                    </div>
                    <div className="dropdown-info">
                      <div className="dropdown-name">{getUserFullName()}</div>
                      <div className="dropdown-email">{user?.email || 'membre@visioncenter.mg'}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => handleNavigation('/profile')} className="dropdown-item">
                    Mon profil
                  </button>
                  <button onClick={() => handleNavigation('/settings')} className="dropdown-item">
                    Paramètres
                  </button>
                  {user.role === 'membre' && (
                    <button onClick={() => handleNavigation('/espace-membre')} className="dropdown-item">
                      Espace membre
                    </button>
                  )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : null}
          </ul>
          
          {/* Sélecteur de langue - à gauche du bouton Se connecter */}
              <li>
                <div className="language-selector">
                  <div className="current-language" onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}>
                    <span className="flag-icon">{getLanguageInfo(selectedLanguage).flag}</span>
                    <span className="lang-code">{getLanguageInfo(selectedLanguage).code}</span>
                    <span className="arrow">▼</span>
                  </div>
                  {isLangDropdownOpen && (
                    <div className="language-dropdown show">
                      <div className={`language-option ${selectedLanguage === 'mg' ? 'active' : ''}`} onClick={() => handleLanguageChange('mg')}>
                        <span className="flag-icon">🇲🇬</span>
                        <span className="lang-name">Malagasy</span>
                      </div>
                      <div className={`language-option ${selectedLanguage === 'en' ? 'active' : ''}`} onClick={() => handleLanguageChange('en')}>
                        <span className="flag-icon">🇺🇸</span>
                        <span className="lang-name">English</span>
                      </div>
                      <div className={`language-option ${selectedLanguage === 'fr' ? 'active' : ''}`} onClick={() => handleLanguageChange('fr')}>
                        <span className="flag-icon">🇫🇷</span>
                        <span className="lang-name">Français</span>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            {/* Bouton Se connecter séparé */}
          {!user && (
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => handleNavigation('/login')}
              className="btn-member"
            >
              Se connecter
            </Button>
          )}
          
          {/* Menu Toggle pour Mobile */}
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span>
          </div>
        </nav>
      </div>
      
      {/* Menu Mobile */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li>
            <a 
              href="/accueil" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/accueil');
              }} 
              className={isLinkActive('/accueil') ? 'active' : ''}
            >
              Accueil
            </a>
          </li>
          <li>
            <a 
              href="/a-propos" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/a-propos');
              }} 
              className={isLinkActive('/a-propos') ? 'active' : ''}
            >
              À propos
            </a>
          </li>
          <li>
            <a 
              href="/site-vitrine" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/site-vitrine');
              }} 
              className={isLinkActive('/site-vitrine') ? 'active' : ''}
            >
              Valeurs
            </a>
          </li>
          <li>
            <a 
              href="/programmes-activites" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/programmes-activites');
              }} 
              className={isLinkActive('/programmes-activites') ? 'active' : ''}
            >
              Programmes & Activités
            </a>
          </li>
          <li>
            <a 
              href="/galerie" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/galerie');
              }} 
              className={isLinkActive('/galerie') ? 'active' : ''}
            >
              Galerie
            </a>
          </li>
          <li>
            <a 
              href="/location-salle" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/location-salle');
              }} 
              className={isLinkActive('/location-salle') ? 'active' : ''}
            >
              Location de salle
            </a>
          </li>
          {user && user.role === 'membre' && (
            <>
              <li>
                <a 
                  href="/espace-membre" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/espace-membre');
                  }} 
                  className={isLinkActive('/espace-membre') ? 'active' : ''}
                >
                  Espace membre
                </a>
              </li>
              <li>
                <a 
                  href="/paiement-reservation-salle" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/paiement-reservation-salle');
                  }} 
                  className={isLinkActive('/paiement-reservation-salle') ? 'active' : ''}
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
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/paiement-reservation-salle');
                }} 
                className={isLinkActive('/paiement-reservation-salle') ? 'active' : ''}
              >
                Réservations
              </a>
            </li>
          )}
          {user ? (
            <>
              <li>
                <div className="user-profile" style={{ padding: '12px 0', marginTop: '8px', justifyContent: 'center' }}>
                  <div className="profile-avatar">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${getUserInitials()}&background=019BFF&color=fff&size=34&bold=true&length=2`} 
                      alt="Profile" 
                    />
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">{getUserFullName()}</span>
                    <span className="profile-role">{getUserRoleLabel()}</span>
                  </div>
                </div>
          

              </li>
              <li>
                <div className="profile-dropdown show" style={{ position: 'relative', width: '100%', marginTop: '8px' }}>
                  <button onClick={() => handleNavigation('/profile')} className="dropdown-item">
                    Mon profil
                  </button>
                  <button onClick={() => handleNavigation('/settings')} className="dropdown-item">
                    Paramètres
                  </button>
                  {user.role === 'membre' && (
                    <button onClick={() => handleNavigation('/espace-membre')} className="dropdown-item">
                      Espace membre
                    </button>
                  )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    Déconnexion
                  </button>
                </div>
              </li>
            </>
          ) : (
            <li>
              <Button 
                variant="primary" 
                size="medium"
                onClick={() => handleNavigation('/login')}
                fullWidth
              >
                Se connecter
              </Button>

           </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default NavigationSiteVitrine;