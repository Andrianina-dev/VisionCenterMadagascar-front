import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Inscription.css';

const Inscription = () => {
  const { activiteId } = useParams();
  const navigate = useNavigate();
  const [activite, setActivite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_utilisateur: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchActivite = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/public/activites/${activiteId}`);
        
        if (!response.ok) {
          throw new Error('Activité non trouvée');
        }
        
        const data = await response.json();
        setActivite(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Pré-remplir le formulaire avec les infos de l'utilisateur connecté
    const memberData = localStorage.getItem('member') || sessionStorage.getItem('member');
    if (memberData) {
      try {
        const member = JSON.parse(memberData);
        setFormData({
          id_utilisateur: member.id_utilisateur || ''
        });
      } catch (e) {
        console.error('Erreur parsing member data:', e);
      }
    }

    fetchActivite();
  }, [activiteId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/public/inscriptions/${activiteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      setSuccess('Inscription réussie ! Vous allez recevoir un email de confirmation.');
      
      // Réinitialiser le formulaire
      setFormData({
        id_utilisateur: ''
      });

      // Rediriger vers la page de détails après 3 secondes
      setTimeout(() => {
        navigate(`/activite/${activiteId}`);
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="inscription-container">
        <div className="loading">Chargement de l'activité...</div>
      </div>
    );
  }

  if (!activite) {
    return (
      <div className="inscription-container">
        <div className="error">Activité non trouvée</div>
      </div>
    );
  }

  return (
    <div className="inscription-container">
      <div className="inscription-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Retour au dashboard
        </button>
        <h1>Inscription à l'activité</h1>
      </div>

      <div className="activite-summary">
        <div className="activite-card">
          <div className="activite-image">
            {activite.image_url ? (
              <img src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/${activite.image_url}`} alt={activite.titre} />
            ) : (
              <div className="placeholder-image">🎯</div>
            )}
          </div>
          <div className="activite-info">
            <h2>{activite.titre}</h2>
            <p className="activite-description">{activite.description}</p>
            <div className="activite-details">
              <p><strong>📅 Date:</strong> {new Date(activite.date).toLocaleDateString('fr-FR')}</p>
              <p><strong>📍 Lieu:</strong> {activite.lieu}</p>
              <p><strong>👥 Capacité:</strong> {activite.capacite} places</p>
              <p><strong>📊 Statut:</strong> 
                <span className={`status ${activite.statut}`}>
                  {activite.statut === 'ouverte' ? 'Ouverte aux inscriptions' : 'Fermée'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="inscription-form">
        <h2>Formulaire d'inscription</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="confirmation-message">
            <h3>Confirmer votre inscription</h3>
            <p>Vous êtes sur le point de vous inscrire à l'activité :</p>
            <div className="activity-summary">
              <strong>{activite?.titre_activite}</strong><br/>
              📅 {activite ? new Date(activite.date_heure_activite).toLocaleDateString('fr-FR') : ''}<br/>
              📍 {activite?.lieu_activite}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting || activite?.statut !== 'ouverte'}
            >
              {submitting ? 'Inscription en cours...' : 'Confirmer mon inscription'}
            </button>
            
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate(`/activite/${activiteId}`)}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inscription;
