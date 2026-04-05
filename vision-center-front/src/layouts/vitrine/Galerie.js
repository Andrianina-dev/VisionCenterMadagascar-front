import React, { useEffect, useState } from 'react';
import { FaVideo, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import GalerieService from '../../services/GalerieService';
import '../../styles/pages/Galerie.css';

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
    <div className="galerie-content">
      {/* Hero Section */}
      <section className="galerie-header" id="accueil">
        <div className="container">
          <div className="galerie-hero-content">
            <h1 className="galerie-title">Galerie</h1>
            <p className="galerie-subtitle">Photos et vidéos des activités du Centre de Vision</p>
          </div>
        </div>
      </section>

      {/* Galerie Grid */}
      <section className="galerie-section" id="galerie">
        <div className="container">
          {loading && (
            <div className="galerie-loading">
              <div className="loading-spinner"></div>
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
                <div className="galerie-media-type">
                  {item.type === 'video' ? <FaVideo /> : <FaCamera />}
                </div>
                <div className="galerie-image">
                  <img src={item.thumbnail} alt={item.title} />
                  <span className="galerie-categorie">{item.type === 'video' ? 'Vidéo' : 'Photo'}</span>
                </div>
                <div className="galerie-contenu">
                  <div className="galerie-meta">
                    <span className="galerie-date">{item.date}</span>
                    <span className="galerie-auteur">Vision Center</span>
                  </div>
                  <h3 className="galerie-titre">{item.title}</h3>
                  <div className="galerie-description">
                    <p>{item.description}</p>
                  </div>
                  <button className="galerie-lien" onClick={(e) => { e.stopPropagation(); navigate(`/galerie/${item.id}`); }}>
                    Voir les détails →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="galerie-actions">
        <div className="container">
          <h2>Partagez vos souvenirs</h2>
          <p>Téléchargez et partagez les photos de nos activités</p>
          <div className="galerie-cta-buttons">
            <button className="btn-galerie">Télécharger les photos</button>
            <button onClick={() => navigate('/')} className="btn-galerie btn-secondary">Retour à l'accueil</button>
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
                <button className="btn-galerie" onClick={() => navigate(`/galerie/${selectedMedia.id}`)}>
                  Voir les détails complets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Galerie;
