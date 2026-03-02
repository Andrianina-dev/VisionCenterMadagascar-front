import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge } from '../components/UI';
import './ReservationSuccess.css';

const ReservationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state?.reservation;
  const salle = location.state?.salle || {};
  const [paymentMethod, setPaymentMethod] = useState('mobile-money');

  const handleViewReservations = () => {
    navigate('/mes-reservations');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de traitement du paiement selon la méthode
    if (paymentMethod === 'cash') {
      // Logique pour paiement en espèces
      console.log('Paiement en espèces sélectionné');
    } else {
      // Logique pour Mobile Money
      console.log('Paiement Mobile Money sélectionné');
    }
  };

  return (
    <div className="reservation-success">
      <div className="success-content">
        <div className="success-message">
          <h2>Merci pour votre réservation</h2>
          <p>
            Votre réservation a été confirmée et sera traitée dans les plus brefs délais. 
            Un email de confirmation vous a été envoyé avec tous les détails.
          </p>
        </div>

        {reservation && (
          <div className="reservation-details">
            <h3>Détails de votre réservation</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Référence:</strong>
                <span>{reservation.id}</span>
              </div>
              <div className="detail-item">
                <strong>Salle:</strong>
                <span>{salle?.nom || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <strong>Date:</strong>
                <span>{new Date(reservation.date_debut).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="detail-item">
                <strong>Heure:</strong>
                <span>{reservation.heure_debut} - {reservation.heure_fin}</span>
              </div>
              <div className="detail-item">
                <strong>Statut:</strong>
                <span>{reservation.statut}</span>
              </div>
              <div className="detail-item">
                <strong>Prix total:</strong>
                <span>{reservation.prix_total} Ar</span>
              </div>
            </div>
          </div>
        )}

        <div className="payment-section">
          <h3>Finaliser votre paiement</h3>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Méthode de paiement</label>
              <div className="payment-methods">
                <label className="payment-method">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="mobile-money" 
                    checked={paymentMethod === 'mobile-money'}
                    onChange={() => handlePaymentMethodChange('mobile-money')}
                  />
                  <span className="radio-label">📱 Mobile Money</span>
                </label>
                <label className="payment-method">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cash" 
                    checked={paymentMethod === 'cash'}
                    onChange={() => handlePaymentMethodChange('cash')}
                  />
                  <span className="radio-label">💵 Espèces</span>
                </label>
              </div>
            </div>

            {paymentMethod === 'mobile-money' && (
              <>
                <div className="form-group">
                  <label>Opérateur Mobile Money</label>
                  <select className="form-select">
                    <option value="">Sélectionner un opérateur</option>
                    <option value="telma">Telma (MVola)</option>
                    <option value="orange">Orange Money</option>
                    <option value="airtel">Airtel Money</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Numéro de téléphone</label>
                  <input type="tel" placeholder="034 XX XXX XX" maxLength="10" />
                </div>
              </>
            )}

            {paymentMethod === 'cash' && (
              <div className="form-group">
                <label>Informations de paiement</label>
                <div className="cash-instructions">
                  <p>💰 Présentez-vous à notre accueil pour payer en espèces</p>
                  <p>📍 Adresse: Antananarivo, Madagascar</p>
                  <p>⏰ Horaires: Lundi - Vendredi (8h - 17h)</p>
                </div>
              </div>
            )}

            <div className="payment-amount">
              <strong>Montant à payer:</strong>
              <span className="amount">{reservation?.prix_total || 0} Ar</span>
            </div>
            <Button variant="primary" size="large" type="submit" className="pay-button">
              {paymentMethod === 'cash' ? 'Confirmer la réservation' : 'Confirmer le paiement'}
            </Button>
          </form>
        </div>

        <div className="success-actions">
          <Button variant="primary" size="large" onClick={handleViewReservations}>
            Voir mes réservations
          </Button>
          <Button variant="secondary" onClick={handleBackToHome}>
            Retour à l'accueil
          </Button>
        </div>

        <div className="help-section">
          <h3>Besoin d'aide?</h3>
          <p>
            Notre équipe est disponible pour répondre à vos questions.
            Contactez-nous par téléphone au +261 34 00 000 00 
            ou par email à contact@visioncenter.mg
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccess;
