import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccesNonMembre.css';

const AccesNonMembre = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulation de connexion directe
      setTimeout(() => {
        // Stocker temporairement l'accès
        localStorage.setItem('nonMemberAccess', JSON.stringify({
          email: email,
          token: 'demo-token',
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 heures
        }));

        navigate('/mes-reservations');
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="acces-non-membre-container">
      <div className="acces-non-membre-card">
        {/* Header */}
        <div className="acces-header">
          <h1 className="acces-title">Accès Non-Membre</h1>
          <p className="acces-subtitle">
            Entrez votre email pour accéder à vos réservations
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="acces-form">
          {/* Email */}
          <div className="form-group">
            <label className="form-label">
              Adresse Email *
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/location-salle')}
              disabled={isLoading}
            >
              Retour
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccesNonMembre;
