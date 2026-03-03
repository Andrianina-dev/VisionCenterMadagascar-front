import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MesReservations.css';

const MesReservations = () => {
  const navigate = useNavigate();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Vérifier l'accès
    const accessData = localStorage.getItem('nonMemberAccess');
    if (!accessData) {
      navigate('/acces-non-membre');
      return;
    }

    const { email, expiresAt } = JSON.parse(accessData);
    
    // Vérifier si l'accès a expiré
    if (new Date() > new Date(expiresAt)) {
      localStorage.removeItem('nonMemberAccess');
      navigate('/acces-non-membre');
      return;
    }

    setUserInfo({ email });
    fetchReservations(email);
  }, [navigate]);

  const fetchReservations = async (email) => {
    try {
      setLoading(true);
      
      // Simulation API - données de démonstration
      setTimeout(() => {
        setReservations([
          {
            id: 123,
            salle_nom: "Salle Conférence A",
            salle_image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=400&h=250&fit=crop&auto=format",
            date_debut: "2026-03-15",
            date_fin: "2026-03-17",
            heure_debut: "09:00",
            heure_fin: "18:00",
            prix_total: 150000,
            statut_paiement: "en_attente",
            montant_paye: 0,
            montant_restant: 150000,
            created_at: "2026-03-03T10:30:00Z"
          },
          {
            id: 124,
            salle_nom: "Salle Réunion B",
            salle_image: "https://images.unsplash.com/photo-1497366216546-3ec112da57a1?w=400&h=250&fit=crop&auto=format",
            date_debut: "2026-02-20",
            date_fin: "2026-02-20",
            heure_debut: "14:00",
            heure_fin: "17:00",
            prix_total: 75000,
            statut_paiement: "paye",
            montant_paye: 75000,
            montant_restant: 0,
            created_at: "2026-02-15T14:20:00Z"
          }
        ]);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger vos réservations. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nonMemberAccess');
    navigate('/showcase');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHeure = (heureString) => {
    if (typeof heureString === 'string' && heureString.includes(':')) {
      return heureString.split(':').slice(0, 2).join(':');
    }
    return heureString;
  };

  const calculerDuree = (dateDebut, dateFin) => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const jours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
    return jours;
  };

  if (loading) {
    return (
      <div className="mes-reservations-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mes-reservations-container">
      {/* Header */}
      <div className="reservations-header">
        <div className="header-content">
          <h1 className="page-title">📋 Mes Réservations</h1>
          <div className="user-info">
            <span className="user-email">{userInfo?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{reservations.length}</div>
          <div className="stat-label">Total Réservations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reservations.filter(r => r.statut_paiement === 'en_attente').length}
          </div>
          <div className="stat-label">En Attente</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {reservations
              .filter(r => r.statut_paiement === 'en_attente')
              .reduce((sum, r) => sum + r.montant_restant, 0)
              .toLocaleString()} Ar
          </div>
          <div className="stat-label">Total Dû</div>
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="reservations-list">
        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Aucune réservation</h3>
            <p>Vous n'avez pas encore de réservation.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/location-salle')}
            >
              🏢 Réserver une salle
            </button>
          </div>
        ) : (
          reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-image">
                <img src={reservation.salle_image} alt={reservation.salle_nom} />
                <div className={`status-badge ${reservation.statut_paiement}`}>
                  {reservation.statut_paiement === 'en_attente' ? '💰 À payer' : '✅ Payé'}
                </div>
              </div>
              
              <div className="reservation-content">
                <div className="reservation-header">
                  <h3>{reservation.salle_nom}</h3>
                  <span className="reservation-ref">#{reservation.id}</span>
                </div>
                
                <div className="reservation-details">
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span>{formatDate(reservation.date_debut)}</span>
                    {calculerDuree(reservation.date_debut, reservation.date_fin) > 1 && (
                      <span> - {formatDate(reservation.date_fin)}</span>
                    )}
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-icon">⏰</span>
                    <span>{formatHeure(reservation.heure_debut)} - {formatHeure(reservation.heure_fin)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-icon">⏱️</span>
                    <span>{calculerDuree(reservation.date_debut, reservation.date_fin)} jour(s)</span>
                  </div>
                </div>
                
                <div className="reservation-payment">
                  <div className="payment-info">
                    <div className="payment-row">
                      <span>Total:</span>
                      <span className="amount">{reservation.prix_total.toLocaleString()} Ar</span>
                    </div>
                    <div className="payment-row">
                      <span>Payé:</span>
                      <span className="amount paid">{reservation.montant_paye.toLocaleString()} Ar</span>
                    </div>
                    <div className="payment-row highlight">
                      <span>Restant:</span>
                      <span className="amount remaining">{reservation.montant_restant.toLocaleString()} Ar</span>
                    </div>
                  </div>
                  
                  {reservation.statut_paiement === 'en_attente' && (
                    <button className="btn-payer">
                      💳 Payer maintenant
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="page-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/location-salle')}
        >
          🏢 Nouvelle réservation
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/showcase')}
        >
          🏠 Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default MesReservations;
