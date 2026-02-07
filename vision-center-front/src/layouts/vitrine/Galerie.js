import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GalerieService from '../../services/GalerieService';
import './accueilVitrineSimple.css';

function Galerie() {
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await GalerieService.getAllMedias();

        const mapped = (raw || []).map((m, index) => {
          const type = m.type_media;
          const createdAt = m.date_ajout || m.created_at || null;
          const date = createdAt
            ? new Date(createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
            : '';

          const stableId = m.id_media ?? m.id ?? null;
          const stableKey = stableId ? `media-${stableId}` : `media-idx-${index}`;

          return {
            key: stableKey,
            id: stableId ?? index,
            type,
            title: m.titre_media,
            description: m.description,
            thumbnail: type === 'image' ? m.chemin_media : 'https://picsum.photos/400/300?random=2',
            date,
            videoUrl: type === 'video' ? m.chemin_media : null,
            galerieId: m.id_galerie,
          };
        });

        if (!cancelled) {
          setMediaItems(mapped);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Erreur lors du chargement');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

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
          {loading && (
            <div style={{ padding: '16px 0' }}>
              Chargement...
            </div>
          )}

          {!loading && error && (
            <div style={{ padding: '16px 0', color: '#b00020' }}>
              {error}
            </div>
          )}

          <div className="galerie-grid">
            {mediaItems.map((item) => (
              <div key={item.key || item.id} className="galerie-item" onClick={() => openMediaModal(item)}>
                <div className="media-type">
                  {item.type === 'video' ? '🎥' : '📸'}
                </div>
                <div className="galerie-image">
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <div className="galerie-content">
                  <h3>{item.title}</h3>
                  <div className="galerie-description">
                    <p>{item.description}</p>
                  </div>
                  <div className="galerie-meta">
                    <span className="galerie-date">{item.date}</span>
                    {item.type === 'video' && (
                      <span className="galerie-duration">▶ Vidéo</span>
                    )}
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
