import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    // Simuler le chargement de la réservation
    const mockReservation = {
      id: reservationId,
      salle: 'Salle A',
      date: '2024-03-20',
      heure: '10:00',
      duree: '3 heures',
      prix: 75000
    };
    setReservation(mockReservation);
    setLoading(false);
  }, [reservationId]);

  const handlePayment = () => {
    // Simuler le paiement
    alert('Paiement simulé avec succès!');
    navigate('/non-member/dashboard');
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Paiement de la réservation</h2>
      <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
        <p><strong>Salle:</strong> {reservation.salle}</p>
        <p><strong>Date:</strong> {reservation.date}</p>
        <p><strong>Heure:</strong> {reservation.heure}</p>
        <p><strong>Durée:</strong> {reservation.duree}</p>
        <p><strong>Montant:</strong> {reservation.prix.toLocaleString()} Ar</p>
      </div>
      <button 
        onClick={handlePayment}
        style={{ 
          background: '#28a745', 
          color: 'white', 
          padding: '1rem 2rem', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Confirmer le paiement
      </button>
    </div>
  );
};

export default PaymentPage;
