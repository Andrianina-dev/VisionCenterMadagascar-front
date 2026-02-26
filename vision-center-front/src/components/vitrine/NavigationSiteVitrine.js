import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavigationSiteVitrine.css';

const NavigationSiteVitrine = ({ scrollToSection, sections = ['hero', 'features', 'activities', 'cta', 'footer'] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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
            <li>
              <button onClick={() => navigate('/login')} className="btn-primary btn-member">
                Espace Membre
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavigationSiteVitrine;
