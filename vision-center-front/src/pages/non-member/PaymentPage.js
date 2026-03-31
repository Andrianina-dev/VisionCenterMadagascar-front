import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);
  const [salle, setSalle] = useState(null);
  const [member, setMember] = useState(null);

  useEffect(() => {
    // Vérifier si les données viennent de l'étape 3 de réservation
    if (location.state?.fromStep3) {
      // Données depuis l'étape 3 de réservation
      const { reservation: reservationData, salle: salleData, member: memberData } = location.state;
      
      if (reservationData) {
        setReservation(reservationData);
        setSalle(salleData);
        setMember(memberData);
              }
    } else if (reservationId) {
      // Mode normal avec ID dans l'URL
      // Charger la réservation depuis l'API
            // TODO: Implémenter le chargement depuis l'API
    }
    
    setLoading(false);
  }, [reservationId, location.state]);

  const handlePayment = () => {
    // Simuler le paiement ou rediriger vers une vraie méthode de paiement
    alert('Redirection vers la méthode de paiement...');
    // TODO: Implémenter la vraie logique de paiement
    navigate('/non-member/dashboard');
  };

  const handleBack = () => {
    navigate(-1); // Revenir à la page précédente
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={handleBack}
          style={{ 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          ← Retour
        </button>
        <h2>💳 Paiement de la réservation</h2>
      </div>
      
      {location.state?.fromStep3 && (
        <div style={{ 
          background: '#e7f3ff', 
          border: '1px solid #007bff', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#004085' }}>
            🎯 <strong>Redirigé depuis l'étape 3 de réservation</strong>
          </p>
        </div>
      )}
      
      {reservation && salle && (
        <>
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
            <h3>📋 Détails de la réservation</h3>
            <p><strong>Référence:</strong> #{reservation.id}</p>
            <p><strong>Salle:</strong> {salle?.nom || reservation.salle || 'Salle non spécifiée'}</p>
            <p><strong>Date début:</strong> {new Date(reservation.date_debut).toLocaleDateString('fr-FR')}</p>
            <p><strong>Date fin:</strong> {new Date(reservation.date_fin).toLocaleDateString('fr-FR')}</p>
            <p><strong>Heures:</strong> {reservation.heure_debut} - {reservation.heure_fin}</p>
            <p><strong>Capacité:</strong> {reservation.capacite_requise} personnes</p>
            <p><strong>Description:</strong> {reservation.description || 'Non spécifiée'}</p>
            <p><strong>Statut:</strong> {reservation.statut}</p>
          </div>
          
          <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
            <h3>💰 Informations de paiement</h3>
            <p><strong>Montant total:</strong> <span style={{ fontSize: '1.2rem', color: '#28a745', fontWeight: 'bold' }}>
              {reservation.prix_total ? reservation.prix_total.toLocaleString() : 'Calcul en cours...'} Ar
            </span></p>
            <p><strong>Méthodes disponibles:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>💵 Espèce</li>
              <li style={{ marginBottom: '0.5rem' }}>📱 Mobile Money (MVola, Orange Money, Airtel Money)</li>
              <li style={{ marginBottom: '0.5rem' }}>💳 Carte bancaire</li>
            </ul>
          </div>
          
          {member && (
            <div style={{ background: '#e2e3e5', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
              <h3>👤 Informations du réservataire</h3>
              <p><strong>Nom:</strong> {member.prenom} {member.nom}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Téléphone:</strong> {member.telephone}</p>
            </div>
          )}
        </>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          onClick={handlePayment}
          style={{ 
            background: '#28a745', 
            color: 'white', 
            padding: '1rem 2rem', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          💳 Procéder au paiement
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
