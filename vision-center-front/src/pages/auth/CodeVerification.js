import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CodeVerification.css';

const CodeVerification = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Veuillez entrer un code de vérification');
      return;
    }
    
    if (code.length !== 4) {
      setError('Le code doit contenir 4 chiffres');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulation d'API pour vérifier le code
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Code vérifié avec succès ! Redirection...');
        setTimeout(() => {
          // Rediriger vers le dashboard admin
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Code invalide');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/signup');
  };

  return (
    <div className="code-verification-container">
      <div className="code-verification-card">
        <h1 className="code-verification-title">Vérification du Code</h1>
        <p className="code-verification-subtitle">Entrez votre code d'accès à 4 chiffres</p>
        
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

        <form onSubmit={handleSubmit} className="code-form">
          <div className="code-input-container">
            <input
              type="text"
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="0000"
              maxLength={4}
              disabled={isLoading}
              pattern="[0-9]{4}"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>
          
          <div className="code-actions">
            <button
              type="button"
              className="back-button"
              onClick={handleBack}
              disabled={isLoading}
            >
              Retour
            </button>
            
            <button
              type="submit"
              className="verify-button"
              disabled={isLoading || code.length !== 4}
            >
              {isLoading ? 'Vérification...' : 'Vérifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodeVerification;
