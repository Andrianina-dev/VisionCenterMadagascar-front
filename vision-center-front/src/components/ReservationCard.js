import React, { useState, useEffect } from 'react';
import ReservationStatusService from '../services/reservationStatusService';
import StatusMessage from './StatusMessage';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaMoneyBillWave, FaClock, FaCreditCard, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const ReservationCard = ({ reservation }) => {
  const [statusMessages, setStatusMessages] = useState({});

  // Charger les messages de statut depuis le backend
  useEffect(() => {
    const loadStatusMessages = async () => {
      const messages = await ReservationStatusService.getStatusMessages(reservation.id);
      setStatusMessages(messages);
    };
    
    loadStatusMessages();
  }, [reservation.id]);

  return (
    <div className="booking-container">
      {/* Carte de location */}
      <div className="booking-card">
        <div className="booking-header">
          <h3>{reservation.salle?.nom || 'Salle inconnue'}</h3>
          <span className={`booking-status ${reservation.statut}`}>
            {reservation.statut}
          </span>
        </div>
        
        <div className="booking-details">
          <div className="detail-row">
            <span className="icon"><FaCalendarAlt /></span>
            <span>{new Date(reservation.date_debut).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="icon"><FaClock /></span>
            <span>{new Date(reservation.heure_debut).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} → {new Date(reservation.heure_fin).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
          </div>
          <div className="detail-row price">
            <span className="icon"><FaMoneyBillWave /></span>
            <span>{parseFloat(reservation.prix_total).toLocaleString()} Ar</span>
          </div>
        </div>
        
        <div className="booking-actions">
          <button className="btn-details">
            Voir les détails
          </button>
        </div>
      </div>
      
      {/* Carte de paiement - à côté */}
      <div className="payment-card">
        <div className="payment-header">
          <h4><FaCreditCard /> Paiement</h4>
          <span className={`payment-status ${reservation.paiement_statut === 'Payé' ? 'paid' : 'pending'}`}>
            {reservation.paiement_statut === 'Payé' ? <><FaCheckCircle /> Payé</> : <><FaHourglassHalf /> En attente</>}
          </span>
        </div>
        
        <div className="payment-amount">
          <span className="amount-label">Montant à payer</span>
          <span className="amount-value">{parseFloat(reservation.prix_total).toLocaleString()} Ar</span>
        </div>
        
        {/* Messages dynamiques depuis le backend */}
        <StatusMessage message={statusMessages.pending} />
        <StatusMessage message={statusMessages.confirmed} />
        <StatusMessage message={statusMessages.cancelled} />
        <StatusMessage message={statusMessages.paid} />
      </div>
    </div>
  );
};

export default ReservationCard;
