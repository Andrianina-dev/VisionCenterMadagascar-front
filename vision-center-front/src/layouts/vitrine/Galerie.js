import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './accueilVitrineSimple.css';

function Galerie() {
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const mediaItems = [
    {
      id: 1,
      type: 'image',
      title: 'Formation Leadership Chrétien',
      description: 'Session intensive sur les principes bibliques du leadership pour les jeunes leaders de demain.',
      thumbnail: 'https://picsum.photos/400/300?random=1',
      date: '15 Février 2026'
    },
    {
      id: 2,
      type: 'video',
      title: 'Retraite Spirituelle Annuelle',
      description: '3 jours de ressourcement, prière et communion dans un cadre naturel loin de l\'agitation quotidienne.',
      thumbnail: 'https://picsum.photos/400/300?random=2',
      date: '10 Février 2026',
      videoUrl: 'https://sample-videos.com/zip/10/mp4'
    },
    {
      id: 3,
      type: 'image',
      title: 'Journée Communautaire',
      description: 'Moment de partage, d\'entraide et de fraternité entre les membres de notre communauté.',
      thumbnail: 'https://picsum.photos/400/300?random=3',
      date: '20 Février 2026'
    },
    {
      id: 4,
      type: 'video',
      title: 'Culte et Louange',
      description: 'Moment d\'adoration collective avec chants traditionnels et louange contemporaine.',
      thumbnail: 'https://picsum.photos/400/300?random=4',
      date: '25 Février 2026',
      videoUrl: 'https://sample-videos.com/zip/10/mp4'
    },
    {
      id: 5,
      type: 'image',
      title: 'Camp d\'Été des Jeunes',
      description: 'Camp de 5 jours avec formations, activités sportives et temps de prière pour les 15-25 ans.',
      thumbnail: 'https://picsum.photos/400/300?random=5',
      date: '5 Février 2026'
    },
    {
      id: 6,
      type: 'image',
      title: 'Étude Biblique Approfondie',
      description: 'Session d\'étude approfondie des Écritures avec focus sur l\'application pratique dans la vie quotidienne.',
      thumbnail: 'https://picsum.photos/400/300?random=6',
      date: '12 Février 2026'
    },
    {
      id: 7,
      type: 'video',
      title: 'Témoignages de Transformation',
      description: 'Histoires inspirantes de jeunes dont la vie a été transformée par leur engagement au Vision Center.',
      thumbnail: 'https://picsum.photos/400/300?random=7',
      date: '8 Février 2026',
      videoUrl: 'https://sample-videos.com/zip/10/mp4'
    },
    {
      id: 8,
      type: 'image',
      title: 'Culte du Dimanche',
      description: 'Célébration hebdomadaire avec message biblique, louange et communion fraternelle.',
      thumbnail: 'https://picsum.photos/400/300?random=8',
      date: '2 Février 2026'
    }
  ];

  const openMediaModal = (media) => {
    setSelectedMedia(media);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="accueil-simple">
      {/* Header */}
      <header className="header-simple">
        <div className="container">
          <div className="logo">
            <h1>Vision Center Madagascar</h1>
          </div>
          <nav className="nav-simple">
            <ul className="nav-links">
              <li><a href="#activites" onClick={(e) => { e.preventDefault(); scrollToSection('activites'); }}>Activités</a></li>
              <li><a href="#a-propos" onClick={(e) => { e.preventDefault(); scrollToSection('a-propos'); }}>À Propos</a></li>
              <li><a href="#galerie" onClick={(e) => { e.preventDefault(); scrollToSection('galerie'); }}>Galerie</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              <li><button onClick={() => navigate('/login')} className="btn-connexion">Espace Membre</button></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-simple" id="accueil">
        <div className="container">
          <div className="hero-content">
            <h2>Galerie</h2>
            <p>Photos et vidéos des activités de Vision Center Madagascar</p>
          </div>
        </div>
      </section>

      {/* Galerie Grid */}
      <section className="features-simple" id="galerie">
        <div className="container">
          <div className="galerie-grid">
            {mediaItems.map((item) => (
              <div key={item.id} className="galerie-item" onClick={() => openMediaModal(item)}>
                <div className="media-type">
                  {item.type === 'video' ? '🎥' : '📸'}
                </div>
                <div className="galerie-image">
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="galerie-overlay">
                    <div className="galerie-info">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="galerie-meta">
                        <span className="galerie-date">{item.date}</span>
                        {item.type === 'video' && (
                          <span className="galerie-duration">▶ Vidéo</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-simple">
        <div className="container">
          <h2>Partagez vos souvenirs</h2>
          <p>Téléchargez et partagez les photos de nos activités</p>
          <div className="cta-buttons">
            <button className="btn-primary">Télécharger les photos</button>
            <button onClick={() => navigate('/')} className="btn-secondary">Retour à l'accueil</button>
          </div>
        </div>
      </section>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="media-modal-overlay" onClick={closeMediaModal}>
          <div className="media-modal">
            <div className="modal-header">
              <h3>{selectedMedia.title}</h3>
              <button className="modal-close" onClick={closeMediaModal}>×</button>
            </div>
            <div className="modal-content">
              {selectedMedia.type === 'video' ? (
                <video controls autoPlay>
                  <source src={selectedMedia.videoUrl} type="video/mp4" />
                  Votre navigateur ne supporte pas cette vidéo.
                </video>
              ) : (
                <img src={selectedMedia.thumbnail} alt={selectedMedia.title} />
              )}
              <div className="modal-info">
                <p>{selectedMedia.description}</p>
                <p className="modal-date">{selectedMedia.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-simple" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Vision Center</h4>
              <p>Un centre chrétien au service de la communauté malgache.</p>
            </div>
            <div className="footer-section">
              <h4>Liens Rapides</h4>
              <ul>
                <li><a href="#activites">Activités</a></li>
                <li><a href="#a-propos">À Propos</a></li>
                <li><a href="#galerie">Galerie</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><button onClick={() => navigate('/login')}>Espace Membre</button></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>contact@visioncenter.mg</li>
                <li>+261 34 123 456</li>
                <li>Antananarivo, Madagascar</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Vision Center Madagascar. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Galerie;
