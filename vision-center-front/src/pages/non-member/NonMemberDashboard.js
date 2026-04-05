import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/NonMemberDashboard.css';

const NonMemberDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState({});
  const [selectedMobileProviders, setSelectedMobileProviders] = useState({});
  const [paymentAmounts, setPaymentAmounts] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const memberData = localStorage.getItem('member');
    const nonMemberData = localStorage.getItem('non-member');
    
                    
    let userData = null;
    let userId = null;
    
    if (token && memberData) {
      try {
        userData = JSON.parse(memberData);
                setUser(userData);
        userId = userData.id;
      } catch (error) {
        // Error parsing member data
      }
    } else if (nonMemberData) {
      try {
        userData = JSON.parse(nonMemberData);
                setUser(userData);
      } catch (error) {
        // Error parsing non-member data
      }
    }
    
    if (userData && userId) {
            loadReservations(userId);
    } else {
            setLoading(false);
    }
    
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
            
      const response = await fetch('http://localhost:8000/api/methodes-paiement', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPaymentMethods(data.data || []);
      } else {
                setPaymentMethods([]);
      }
    } catch (error) {
            setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async (userId) => {
    try {
            
      // Appeler l'API pour récupérer les réservations de l'utilisateur
      const response = await fetch(`http://localhost:8000/api/reservations/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('⚡ Status de la réponse:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setReservations(data.data || []);
      } else {
        setError(data.message || 'Erreur lors du chargement des réservations');
        setReservations([]);
      }
    } catch (error) {
      setError(error.message || 'Erreur de connexion au serveur');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReservations = async (userId) => {
    try {
            
      const response = await fetch(`http://localhost:8000/api/reservations/user/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const reservationData = await response.json();
            
      if (reservationData.success) {
                        setReservations(reservationData.data || []);
      } else {
                setReservations([]);
      }
    } catch (error) {
            setReservations([]);
    }
  };

  const handlePayment = async (reservationId) => {
    try {
      // Rediriger vers la page de paiement avec l'ID de réservation
      navigate(`/payment/${reservationId}`);
    } catch (error) {
            setError('Erreur lors du processus de paiement');
    }
  };

  const handlePaymentMethodChange = (reservationId, method) => {
    setSelectedPaymentMethods(prev => ({
      ...prev,
      [reservationId]: method
    }));
    
    if (method !== 'mobile-money') {
      setSelectedMobileProviders(prev => ({
        ...prev,
        [reservationId]: null
      }));
    }
  };

  const handleMobileProviderChange = (reservationId, provider) => {
    console.log('📱 Choix opérateur mobile:', { reservationId, provider });
    
    setSelectedMobileProviders(prev => ({
      ...prev,
      [reservationId]: provider
    }));
    
    setSelectedPaymentMethods(prev => ({
      ...prev,
      [reservationId]: provider
    }));
  };

  const handlePaymentAmountChange = (reservationId, amount, reservation) => {
    // Mettre à jour la valeur de l'input
    setInputValues(prev => ({
      ...prev,
      [reservationId]: amount
    }));
    
    // Mettre à jour le montant de paiement si l'input n'est pas vide
    if (amount !== '') {
      setPaymentAmounts(prev => ({
        ...prev,
        [reservationId]: parseInt(amount) || 0
      }));
    } else {
      setPaymentAmounts(prev => ({
        ...prev,
        [reservationId]: 0
      }));
    }
  };

  const handlePayNow = async (reservationId) => {
  try {
    const selectedMethod = selectedPaymentMethods[reservationId];
    const selectedProvider = selectedMobileProviders[reservationId];
    const amount = paymentAmounts[reservationId];

    if (!selectedMethod) {
      alert('Veuillez choisir une méthode de paiement');
      return;
    }

    if (!amount || amount <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    const paiementData = {
      methode_paiement_id: selectedMethod,
      operateur_id: selectedProvider && selectedProvider !== 'mobile-money' ? selectedProvider : null,
      montant: parseFloat(amount)
    };

    const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}/paiement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(paiementData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erreur HTTP: ${response.status} - ${errorData.message}`);
    }

    const result = await response.json();

    if (result.success) {
      showPaymentNotification('Paiement effectué avec succès!', 'Votre paiement est enregistré et en attente de validation par l\'administrateur.');
      
      if (user) {
        const userId = user.id || user.id_utilisateur;
        if (userId) {
          loadReservations(userId);
        }
      }
    } else {
      alert('Erreur lors du paiement: ' + result.message);
    }
  } catch (error) {
    alert('Erreur technique lors du paiement. Veuillez réessayer.');
  }
};

  // Fonction pour afficher une notification de paiement
  const showPaymentNotification = (title, message) => {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
      z-index: 10000;
      max-width: 350px;
      animation: slideInRight 0.5s ease-out;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 24px;"></div>
        <div>
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${title}</div>
          <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        </div>
      </div>
    `;

    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Ajouter la notification au DOM
    document.body.appendChild(notification);

    // Retirer la notification après 5 secondes
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.5s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 5000);
  };

  const handleNewReservation = () => {
    navigate('/location-salle');
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('non-member');
    localStorage.removeItem('token');
    
    setUser(null);
    setReservations([]);
    
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="non-member-dashboard">
        <div className="loading">
          <h2>Chargement...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="non-member-dashboard">
        <div className="error">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')}>Retour à la connexion</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* Contenu principal */}
      <div className="content">
        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h3>{reservations.length}</h3>
              <p>Mes locations</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h3>{reservations.filter(r => r.paiement === 'en attente').length}</h3>
              <p>En attente</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h3>{reservations.filter(r => r.paiement === 'payé' || r.paiement_statut === 'Payé').length > 0 ? '1' : '0'}</h3>
              <p>Confirmées</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h3>{reservations
                .filter(r => r.paiement === 'en attente')
                .reduce((sum, r) => sum + r.montant_restant, 0)
                .toLocaleString()} Ar
              </h3>
              <p>Total Dû</p>
            </div>
          </div>
        </div>

        {/* Section mes locations */}
        <section className="bookings-section">
          <div className="section-header">
            <h2>Mes locations</h2>
            <button className="btn-view-all">Voir tout</button>
          </div>
          
          {reservations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <h3>Aucune location</h3>
              <p>Commencez par louer une salle pour vos événements</p>
              <button className="btn-primary" onClick={handleNewReservation}>
                Faire une location
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="booking-container">
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
                        <span className="icon"></span>
                        <span>{new Date(reservation.date_debut).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon"></span>
                        <span>{new Date(reservation.heure_debut).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} → {new Date(reservation.heure_fin).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                      </div>
                      <div className="detail-row price">
                        <span className="icon"></span>
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
                      <h4>Paiement</h4>
                      <span className={`payment-status ${reservation.paiement_statut === 'Payé' ? 'paid' : 'pending'}`}>
                        {reservation.paiement_statut === 'Payé' ? 'Payé' : 'En attente'}
                      </span>
                    </div>
                    
                    <div className="payment-amount">
                      <span className="amount-label">Montant à payer</span>
                      <span className="amount-value">{parseFloat(reservation.prix_total).toLocaleString()} Ar</span>
                    </div>
                    
                    {/* Message pour les réservations en attente de validation */}
                    {reservation.statut === 'En attente' && (
                      <div className="validation-pending" style={{backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '12px', marginBottom: '12px'}}>
                        <div className="pending-content">
                          <span className="pending-desc" style={{color: '#856404'}}>
                            La {reservation.salle?.nom || 'salle'} est en attente de validation et l'administrateur vous contactera
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Message pour les réservations confirmées */}
                    {reservation.statut === 'Confirmée' && (
                      <div className="validation-success" style={{backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', padding: '12px', marginBottom: '12px'}}>
                        <div className="success-content">
                          <span className="success-desc" style={{color: '#155724'}}>
                            Votre location {reservation.salle?.nom || 'salle'} est validée
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Message pour les réservations annulées */}
                    {reservation.statut === 'Annulée' && (
                      <div className="validation-cancelled" style={{backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', padding: '12px', marginBottom: '12px'}}>
                        <div className="cancelled-content">
                          <span className="cancelled-desc" style={{color: '#721c24'}}>
                            Votre location {reservation.salle?.nom || 'salle'} a été annulée
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section devenir membre */}
        <section className="upgrade-section">
          <div className="upgrade-card">
            <div className="upgrade-content">
              <h3>Devenez membre</h3>
              <p>Accédez à des tarifs exclusifs et des avantages premium</p>
              <ul className="benefits">
                <li>Jusqu'à 30% de réduction</li>
                <li>Locations prioritaires</li>
                <li>Services exclusifs</li>
              </ul>
              <button className="btn-upgrade">S'abonner maintenant</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NonMemberDashboard;
