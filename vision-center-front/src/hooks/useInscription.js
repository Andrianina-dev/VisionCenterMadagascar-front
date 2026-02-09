import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useInscription = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { getUserId } = useAuth();

  const inscrire = useCallback(async (activiteId) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/public/inscriptions/${activiteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id_utilisateur: userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      return {
        success: true,
        message: 'Inscription réussie !',
        data: data.data
      };
      
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [getUserId]);

  const desinscrire = useCallback(async (activiteId) => {
    setSubmitting(true);
    setError(null);
    
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/public/inscriptions/${activiteId}/desinscrire`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          participant_id: userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la désinscription');
      }

      return {
        success: true,
        message: 'Désinscription réussie !',
        data: data.data
      };
      
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la désinscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [getUserId]);

  const verifierInscription = useCallback(async (activiteId) => {
    try {
      const userId = getUserId();
      if (!userId) {
        return { isRegistered: false };
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/public/inscriptions/verifier/${activiteId}/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la vérification');
      }

      return {
        isRegistered: data.isRegistered,
        data: data.data
      };
      
    } catch (err) {
      console.error('Erreur lors de la vérification d\'inscription:', err);
      return { isRegistered: false };
    }
  }, [getUserId]);

  const clearError = () => {
    setError(null);
  };

  return {
    inscrire,
    desinscrire,
    verifierInscription,
    submitting,
    error,
    clearError
  };
};
