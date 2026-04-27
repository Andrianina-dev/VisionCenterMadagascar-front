import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Badge } from '../components/UI';
import './ReservationValidation.css';

const ReservationValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Récupérer les données de réservation depuis le state ou localStorage
    const data = location.state?.reservationData || 
                 JSON.parse(localStorage.getItem('pendingReservation') || 'null');
    
    if (data) {
      setReservationData(data);
    } else {
      setError('Aucune donnée de réservation trouvée');
    }
    setLoading(false);
  }, [location.state]);

  // Validation des dates
  const validateDates = () => {
    const errors = {};
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Début de la journée actuelle

    if (reservationData?.reservation) {
      const dateDebut = new Date(reservationData.reservation.date_debut);
      const dateFin = new Date(reservationData.reservation.date_fin);

      // Validation date début
      if (dateDebut < now) {
        errors.date_debut = 'Veuillez choisir une date à venir';
      }

      // Validation date fin
      if (dateFin < now) {
        errors.date_fin = 'Veuillez choisir une date à venir';
      }

      // Validation date fin après date début
      if (dateFin < dateDebut) {
        errors.date_fin = 'La date de fin doit être après la date de début';
      }

      // Si la date fin est correcte mais qu'il y avait une erreur de date fin, on la retire
      if (dateFin >= now && dateFin >= dateDebut && errors.date_fin === 'Veuillez choisir une date à venir') {
        delete errors.date_fin;
      }

      // Si la date début est correcte mais qu'il y avait une erreur de date début, on la retire
      if (dateDebut >= now && errors.date_debut === 'Veuillez choisir une date à venir') {
        delete errors.date_debut;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Valider au chargement et à chaque modification
  useEffect(() => {
    if (reservationData) {
      validateDates();
    }
  }, [reservationData]);

  // Effacer l'erreur générale quand il n'y a plus d'erreurs de validation
  useEffect(() => {
    if (Object.keys(validationErrors).length === 0 && error === 'Veuillez corriger les erreurs avant de confirmer') {
      setError(null);
    }
  }, [validationErrors, error]);

  const handleConfirm = async () => {
    // Valider les dates avant confirmation
    if (!validateDates()) {
      setError('Veuillez corriger les erreurs avant de confirmer');
      return;
    }

    try {
      setLoading(true);
      
      // Appel API pour confirmer la réservation
      const response = await fetch('/api/reservations/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservation_id: reservationData.reservation.id
        })
      });

      const result = await response.json();

      if (result.success) {
        // Nettoyer le localStorage
        localStorage.removeItem('pendingReservation');
        
        // Rediriger vers la page de succès
        navigate('/reservation-success', { 
          state: { reservation: result.data } 
        });
      } else {
        setError(result.message || 'Erreur lors de la confirmation');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleModify = () => {
    // Revenir à l'étape 2 pour modifier
    navigate('/reservation-form', { 
      state: { reservationData, step: 2 } 
    });
  };

  const handleCancel = () => {
    // Revenir à la liste des salles
    navigate('/salles');
  };

  if (loading) {
    return (
      <div className="validation-loading">
        <div className="spinner"></div>
        <p>Chargement des détails de réservation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="validation-error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <Button onClick={() => navigate('/salles')}>
          Retour aux salles
        </Button>
      </div>
    );
  }

  if (!reservationData) {
    return (
      <div className="validation-empty">
        <h2>Aucune réservation en cours</h2>
        <Button onClick={() => navigate('/salles')}>
          Voir les salles
        </Button>
      </div>
    );
  }

  const { reservation, salle, member } = reservationData;

  return (
    <div className="reservation-validation">
      <div className="validation-header">
        <h1>Validation de votre réservation</h1>
        <Badge variant="info">Étape 3/3</Badge>
      </div>

      <div className="validation-content">
        {/* Récapitulatif de la réservation */}
        <Card className="summary-card">
          <h2>Récapitulatif de la réservation</h2>
          
          <div className="summary-section">
            <h3>Détails de la salle</h3>
            <div className="salle-info">
              <p><strong>Nom:</strong> {salle?.nom || 'Salle inconnue'}</p>
              <p><strong>Capacité:</strong> {reservation.capacite_requise} personnes</p>
              <p><strong>Prix:</strong> {salle?.prix || 0} Ar par jour</p>
            </div>
          </div>

          <div className="summary-section">
            <h3>Période de réservation</h3>
            <div className="period-info">
              <div className={`date-field ${validationErrors.date_debut ? 'has-error' : ''}`}>
                <p><strong>Date début:</strong> {new Date(reservation.date_debut).toLocaleDateString('fr-FR')}</p>
                {validationErrors.date_debut && (
                  <p className="error-message">{validationErrors.date_debut}</p>
                )}
              </div>
              <div className={`date-field ${validationErrors.date_fin ? 'has-error' : ''}`}>
                <p><strong>Date fin:</strong> {new Date(reservation.date_fin).toLocaleDateString('fr-FR')}</p>
                {validationErrors.date_fin && (
                  <p className="error-message">{validationErrors.date_fin}</p>
                )}
              </div>
              <p><strong>Heure début:</strong> {reservation.heure_debut}</p>
              <p><strong>Heure fin:</strong> {reservation.heure_fin}</p>
            </div>
          </div>

          <div className="summary-section">
            <h3>Informations du réservataire</h3>
            <div className="member-info">
              <p><strong>Nom:</strong> {member?.nom || 'N/A'}</p>
              <p><strong>Prénom:</strong> {member?.prenom || 'N/A'}</p>
              <p><strong>Email:</strong> {member?.email || 'N/A'}</p>
              <p><strong>Téléphone:</strong> {member?.telephone || 'N/A'}</p>
            </div>
          </div>

          <div className="summary-section">
            <h3>Prix total</h3>
            <div className="price-info">
              <p className="price-total">
                {reservation.prix_total || 'Calcul en cours...'} Ar
              </p>
            </div>
          </div>

          {reservation.description && (
            <div className="summary-section">
              <h3>Description</h3>
              <p>{reservation.description}</p>
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card className="actions-card">
          <h2>Actions</h2>
          <div className="validation-actions">
            <Button 
              variant="primary" 
              size="large"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Confirmation en cours...' : 'Confirmer la réservation'}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleModify}
              disabled={loading}
            >
              Modifier la réservation
            </Button>
            
            <Button 
              variant="danger" 
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </Card>

        {/* Informations importantes */}
        <Card className="info-card">
          <h2>Informations importantes</h2>
          <ul>
            <li>Une confirmation par email vous sera envoyée après validation</li>
            <li>La réservation sera effective après paiement</li>
            <li>Vous pouvez modifier votre réservation jusqu'à 24h avant</li>
            <li>En cas d'annulation tardive, des frais peuvent s'appliquer</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ReservationValidation;
