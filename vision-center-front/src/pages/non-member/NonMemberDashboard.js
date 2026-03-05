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
    // Récupérer les infos du non-membre depuis localStorage
    const nonMemberData = localStorage.getItem('non-member');
    if (nonMemberData) {
      const userData = JSON.parse(nonMemberData);
      setUser(userData);
      loadReservations(userData.email);
      loadPaymentMethods();
    } else {
      setError('Aucune information utilisateur trouvée');
      setLoading(false);
    }
  }, []);

  const loadPaymentMethods = async () => {
    try {
      console.log('🔍 Chargement des méthodes de paiement...');
      
      // Appel API pour récupérer les méthodes de paiement
      const response = await fetch('http://localhost:8000/api/methodes-paiement', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // credentials: 'include', // Enlevé pour contourner CORS
      });

      console.log('📡 Status API méthodes paiement:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Méthodes de paiement reçues:', data);

      if (data.success) {
        setPaymentMethods(data.data || []);
        console.log('✅ Méthodes de paiement chargées:', data.data?.length || 0);
      } else {
        console.error('❌ Erreur API méthodes de paiement:', data.message);
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error('💥 Erreur lors du chargement des méthodes de paiement:', error);
      setPaymentMethods([]);
    }
  };

  const loadReservations = async (email) => {
    try {
      console.log('🔍 Chargement des réservations pour:', email);
      
      // Appel API complètement isolée - PAS DE MIDDLEWARE LARAVEL
      const response = await fetch(`http://localhost:8000/cors-free-api.php?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('📡 Status de la réponse:', response.status);
      console.log('📡 Headers de la réponse:', response.headers);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Données reçues:', data);
      
      if (data.success) {
        console.log('✅ Succès - Nombre de réservations:', data.reservations?.length || 0);
        console.log('📋 Debug info:', data.debug);
        setReservations(data.reservations || []);
      } else {
        console.log('❌ Erreur API:', data.message);
        console.log('🐛 Debug info:', data.debug);
        setError(data.message || 'Erreur inconnue');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('💥 Erreur complète:', error);
      setError('Erreur lors du chargement des réservations: ' + error.message);
      setLoading(false);
    }
  };

  const handlePayment = async (reservationId) => {
    try {
      // Rediriger vers la page de paiement avec l'ID de réservation
      navigate(`/payment/${reservationId}`);
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setError('Erreur lors du processus de paiement');
    }
  };

  const handlePaymentMethodChange = (reservationId, method) => {
    setSelectedPaymentMethods(prev => ({
      ...prev,
      [reservationId]: method
    }));
    
    // Réinitialiser l'opérateur mobile si on change de méthode
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
    
    // Mettre à jour aussi la méthode de paiement principale avec l'ID de l'opérateur choisi
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

  const handlePayNow = (reservationId) => {
    // Logique de paiement ici
    console.log('Paiement pour réservation:', reservationId);
    console.log('Méthode:', selectedPaymentMethods[reservationId]);
    console.log('Opérateur:', selectedMobileProviders[reservationId]);
    console.log('Montant:', paymentAmounts[reservationId]);
    
    // Rediriger vers la page de paiement ou traiter le paiement
    navigate(`/payment/${reservationId}`);
  };

  const handleNewReservation = () => {
    navigate('/location-salle');
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
    <div className="dashboard">
      {/* Header moderne */}
      <header className="header">
        <div className="user-welcome">
          <h1>Bonjour, {user?.email?.split('@')[0]}</h1>
        </div>
        <button className="btn-book" onClick={handleNewReservation}>
          <span>+</span> Réserver une salle
        </button>
      </header>

      {/* Contenu principal */}
      <div className="content">
        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{reservations.length}</h3>
              <p>Réservations</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{reservations.filter(r => r.paiement === 'en attente').length}</h3>
              <p>En attente</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{reservations.filter(r => r.paiement === 'payé').length}</h3>
              <p>Confirmées</p>
            </div>
          </div>
        </div>

        {/* Section réservations */}
        <section className="bookings-section">
          <div className="section-header">
            <h2>Mes réservations</h2>
            <button className="btn-view-all">Voir tout</button>
          </div>
          
          {reservations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Aucune réservation</h3>
              <p>Commencez par réserver une salle pour vos événements</p>
              <button className="btn-primary" onClick={handleNewReservation}>
                Faire une réservation
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="booking-container">
                  {/* Carte de réservation */}
                  <div className="booking-card">
                    <div className="booking-header">
                      <h3>{reservation.salle}</h3>
                      <span className={`booking-status ${reservation.statut}`}>
                        {reservation.statut}
                      </span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="icon">📅</span>
                        <span>{reservation.date}</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">⏰</span>
                        <span>{reservation.heure_debut} → {reservation.heure_fin} ({reservation.duree})</span>
                      </div>
                      <div className="detail-row price">
                        <span className="icon">💰</span>
                        <span>{reservation.prix.toLocaleString()} Ar</span>
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
                      <h4>💳 Paiement</h4>
                      <span className={`payment-status ${reservation.paiement === 'payé' ? 'paid' : 'pending'}`}>
                        {reservation.paiement === 'payé' ? '✅ Payé' : '⏳ En attente'}
                      </span>
                    </div>
                    
                    <div className="payment-amount">
                      <span className="amount-label">Montant à payer</span>
                      <span className="amount-value">{reservation.prix.toLocaleString()} Ar</span>
                    </div>
                    
                    {/* Méthodes de paiement - données de la base de données avec design actuel */}
                    <div className="payment-methods-simple">
                      <span className="simple-title">Comment payer ?</span>
                      
                      {/* Debug - Afficher les méthodes chargées */}
                      {paymentMethods.length === 0 && (
                        <div style={{color: 'red', fontSize: '12px', marginBottom: '10px'}}>
                          Aucune méthode de paiement chargée (API: /api/methodes-paiement)
                        </div>
                      )}
                      
                      <div className="simple-options">
                        {/* Espèce - depuis la base de données */}
                        {paymentMethods.filter(m => m.nom.toLowerCase().includes('espèce')).map((method) => (
                          <button 
                            key={method.id}
                            className={`simple-option cash ${selectedPaymentMethods[reservation.id] === method.id ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodChange(reservation.id, method.id)}
                          >
                            <span className="option-text">{method.nom}</span>
                          </button>
                        ))}
                        
                        {/* Mobile Money - bouton principal avec fond de couleur et contour si un opérateur est choisi */}
                        <button 
                          className={`simple-option mobile-money ${
                            selectedMobileProviders[reservation.id] ? 'selected' : 
                            selectedPaymentMethods[reservation.id] === 'mobile-money' ? 'selected' : ''
                          }`}
                          style={{
                            border: selectedMobileProviders[reservation.id] ? '2px solid #007bff' : 
                                   selectedPaymentMethods[reservation.id] === 'mobile-money' ? '2px solid #007bff' : '1px solid #ddd'
                          }}
                          onClick={() => handlePaymentMethodChange(reservation.id, 'mobile-money')}
                        >
                          <span className="option-text">
                            Mobile Money
                            {selectedMobileProviders[reservation.id] && (
                              <span style={{marginLeft: '8px', fontSize: '12px', fontWeight: 'bold'}}>
                                → {paymentMethods.find(m => m.id === selectedMobileProviders[reservation.id])?.nom}
                              </span>
                            )}
                          </span>
                        </button>
                      </div>
                      
                      {/* Options Mobile Money - toujours visibles quand Mobile Money est choisi ou si un opérateur est sélectionné */}
                      {(selectedPaymentMethods[reservation.id] === 'mobile-money' || selectedMobileProviders[reservation.id]) && (
                        <div className="mobile-money-simple">
                          <div className="provider-buttons">
                            {paymentMethods
                              .filter(m => 
                                m.nom.toLowerCase().includes('mvola') || 
                                m.nom.toLowerCase().includes('orange') || 
                                m.nom.toLowerCase().includes('airtel')
                              )
                              .map((method) => (
                                <button 
                                  key={method.id}
                                  className={`provider-btn ${selectedMobileProviders[reservation.id] === method.id ? 'selected' : ''}`}
                                  style={{
                                    border: selectedMobileProviders[reservation.id] === method.id ? '2px solid #007bff' : '1px solid #ddd'
                                  }}
                                  onClick={() => handleMobileProviderChange(reservation.id, method.id)}
                                >
                                  {method.nom}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Champ de saisie et bouton Payez - toujours affichés */}
                    <div className="payment-actions">
                      {/* Champ de saisie du montant */}
                      <div className="payment-input-section">
                        <span className="input-label">Montant à payer</span>
                        <div className="input-group">
                          <span className="currency">Ar</span>
                          <input
                            type="text"
                            className="payment-input"
                            placeholder="0"
                            value={inputValues[reservation.id] !== undefined ? inputValues[reservation.id] : reservation.prix}
                            onChange={(e) => handlePaymentAmountChange(reservation.id, e.target.value, reservation)}
                          />
                        </div>
                      </div>
                      
                      {/* Bouton Payez */}
                      <button 
                        className="btn-pay-final"
                        onClick={() => handlePayNow(reservation.id)}
                      >
                        {reservation.paiement === 'payé' ? 'Payer à nouveau' : 'Payez'}
                      </button>
                      
                      <div className="payment-security">
                        <span className="security-icon">🔒</span>
                        <span className="security-text">Paiement sécurisé</span>
                      </div>
                    </div>
                    
                    {reservation.paiement === 'payé' && (
                      <div className="payment-success">
                        <div className="success-icon">✅</div>
                        <div className="success-content">
                          <span className="success-title">Paiement confirmé</span>
                          <span className="success-desc">Votre réservation est validée</span>
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
              <h3>🌟 Devenez membre</h3>
              <p>Accédez à des tarifs exclusifs et des avantages premium</p>
              <ul className="benefits">
                <li>✨ Jusqu'à 30% de réduction</li>
                <li>🎯 Réservations prioritaires</li>
                <li>🎁 Services exclusifs</li>
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
