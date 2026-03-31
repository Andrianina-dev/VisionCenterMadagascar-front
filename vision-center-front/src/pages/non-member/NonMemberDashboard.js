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
    const storedUser = localStorage.getItem('non-member');
    console.log('🔄 useEffect - Début, storedUser:', storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Charger les réservations de l'utilisateur
        loadReservations(userData.email);
      } catch (error) {
        console.error('Erreur parsing storedUser:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    
    // Charger les méthodes de paiement
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      console.log('🔍 Chargement des méthodes de paiement...');
      
      // Appel API pour récupérer les méthodes de paiement
      const response = await fetch('http://localhost:8000/api/methodes-paiement', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Status réponse méthodes paiement:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Méthodes de paiement reçues:', data);

      if (data.success) {
        console.log('✅ Méthodes de paiement chargées:', data.data);
        setPaymentMethods(data.data || []);
      } else {
        console.error('❌ Erreur API méthodes de paiement:', data.message);
        setPaymentMethods([]);
      }
    } catch (error) {
      console.error('💥 Erreur chargement méthodes paiement:', error);
      setPaymentMethods([]);
    } finally {
      // Arrêter le chargement même s'il y a une erreur
      setLoading(false);
    }
  };

  const loadReservations = async (email) => {
    try {
      console.log('🔍 Chargement des réservations pour:', email);
      
      // Pour les non-membres, on envoie seulement l'email
      // Les autres champs ne sont plus nécessaires car le statut est "en attente"
      const userData = {
        email: email
      };
      
      console.log('� Données envoyées au backend (brut JSON):', JSON.stringify(userData));
      console.log('📤 Données envoyées au backend (formaté):', userData);
      
      // Utiliser la route de login pour les non-membres (avec mot de passe par défaut)
      const response = await fetch(`http://localhost:8000/api/member/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: '1234567' // Mot de passe par défaut pour les non-membres
        })
      });

      console.log('⚡ Status de la réponse:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 Données reçues:', data);
      
      if (data.success) {
        console.log('✅ Succès - Utilisateur créé/trouvé:', data.data);
        
        // Stocker l'utilisateur créé dans localStorage
        if (data.data) {
          localStorage.setItem('non-member', JSON.stringify(data.data));
        }
        
        // Charger les réservations existantes pour cet utilisateur
        await loadUserReservations(data.data.id_utilisateur);
        
      } else {
        console.log('❌ Erreur création utilisateur:', data.message);
        setError(data.message || 'Erreur lors de la création du compte');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('💥 Erreur complète:', error);
      setError('Erreur lors de la création du compte: ' + error.message);
      setLoading(false);
    }
  };

  // Fonction pour charger les réservations d'un utilisateur
  const loadUserReservations = async (userId) => {
    try {
      console.log('🔍 Chargement des réservations pour utilisateur ID:', userId);
      
      // Utiliser l'API Laravel officielle pour les réservations
      const response = await fetch(`http://localhost:8000/api/reservations/user/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Status réponse réservations:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const reservationData = await response.json();
      console.log('📊 Données réservations reçues:', reservationData);
      
      if (reservationData.success) {
        console.log('✅ Succès - Nombre de réservations:', reservationData.data?.length || 0);
        console.log('📋 Structure complète des réservations:', JSON.stringify(reservationData.data, null, 2));
        setReservations(reservationData.data || []);
      } else {
        console.log('❌ Erreur chargement réservations:', reservationData.message);
        setReservations([]);
      }
    } catch (error) {
      console.error('💥 Erreur chargement réservations:', error);
      setReservations([]);
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

  const handlePayNow = async (reservationId) => {
    try {
      // Debug: Vérifier l'ID de réservation
      console.log('Frontend - ID de réservation:', reservationId);
      console.log('Frontend - Type de l\'ID:', typeof reservationId);
      
      // Récupérer les données de paiement
      const selectedMethod = selectedPaymentMethods[reservationId];
      const selectedProvider = selectedMobileProviders[reservationId];
      const amount = paymentAmounts[reservationId];

      console.log('Frontend - Méthode sélectionnée:', selectedMethod);
      console.log('Frontend - Opérateur sélectionné:', selectedProvider);
      console.log('Frontend - Montant:', amount);

      // Validation des données
      if (!selectedMethod) {
        alert('Veuillez choisir une méthode de paiement');
        return;
      }

      if (!amount || amount <= 0) {
        alert('Veuillez entrer un montant valide');
        return;
      }

      // Préparer les données pour l'API
      const paiementData = {
        methode_paiement_id: selectedMethod,
        operateur_id: selectedProvider && selectedProvider !== 'mobile-money' ? selectedProvider : null,
        montant: parseFloat(amount)
      };

      console.log('Frontend - Données de paiement:', paiementData);
      console.log('Frontend - URL de l\'API:', `http://localhost:8000/api/reservations/${reservationId}/paiement`);

      // Appel API pour faire le paiement
      const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}/paiement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paiementData)
      });

      console.log('📡 Status réponse paiement:', response.status);
      console.log('📊 Données envoyées au backend:', JSON.stringify(paiementData, null, 2));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur réponse paiement:', errorData);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorData.message}`);
      }

      const result = await response.json();
      console.log('✅ Réponse paiement reçue:', result);
      console.log('Frontend - Réponse API:', result);

      if (result.success) {
        // Notification élégante de succès
        showPaymentNotification('✅ Paiement effectué avec succès!', 'Votre paiement est enregistré et en attente de validation par l\'administrateur.');
        
        // Mettre à jour l'affichage pour montrer "En attente"
        // Optionnel: recharger les réservations pour voir le nouveau statut
        if (user) {
          loadReservations(user.email);
        }
      } else {
        alert('Erreur lors du paiement: ' + result.message);
      }

} catch (error) {
      console.error('Frontend - Erreur lors du paiement:', error);
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
        <div style="font-size: 24px;">✅</div>
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
    // Nettoyer localStorage
    localStorage.removeItem('non-member');
    localStorage.removeItem('token');
    
    // Réinitialiser les états
    setUser(null);
    setReservations([]);
    
    // Rediriger vers la page de login
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
    <div className="dashboard">
      {/* Header moderne */}
      <header className="header">
        <div className="user-welcome">
          <h1>Bonjour, {user?.email ? user.email.split('@')[0] : 'Utilisateur'}</h1>
        </div>
        <div className="header-actions">
          <button className="btn-book" onClick={handleNewReservation}>
            <span>+</span> Réserver une salle
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>
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
              <h3>{reservations.filter(r => r.paiement === 'payé' || r.paiement_statut === 'Payé').length > 0 ? '1' : '0'}</h3>
              <p>Confirmées</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
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
                      <h3>{reservation.salle?.nom || 'Salle inconnue'}</h3>
                      <span className={`booking-status ${reservation.statut}`}>
                        {reservation.statut}
                      </span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="icon">📅</span>
                        <span>{new Date(reservation.date_debut).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">⏰</span>
                        <span>{new Date(reservation.heure_debut).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} → {new Date(reservation.heure_fin).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                      </div>
                      <div className="detail-row price">
                        <span className="icon">💰</span>
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
                      <h4>💳 Paiement</h4>
                      <span className={`payment-status ${reservation.paiement_statut === 'Payé' ? 'paid' : 'pending'}`}>
                        {reservation.paiement_statut === 'Payé' ? '✅ Payé' : '⏳ En attente'}
                      </span>
                    </div>
                    
                    <div className="payment-amount">
                      <span className="amount-label">Montant à payer</span>
                      <span className="amount-value">{parseFloat(reservation.prix_total).toLocaleString()} Ar</span>
                    </div>
                    
                    {/* Méthodes de paiement - données de la base de données avec design actuel */}
                    {reservation.paiement_statut !== 'en_attente_validation' && reservation.paiement_statut !== 'Payé' && (
                      <div className="payment-methods-simple">
                        <span className="simple-title">Comment payer ?</span>
                        
                        {/* Debug - Afficher les méthodes chargées */}
                        {paymentMethods.length === 0 && (
                          <div style={{color: 'orange', fontSize: '12px', marginBottom: '10px'}}>
                            📋 Méthodes de paiement en cours de chargement...
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
                    )}
                    
                    {/* Champ de saisie et bouton Payez - seulement si pas en attente de validation et pas payé */}
                    {reservation.paiement_statut !== 'en_attente_validation' && reservation.paiement_statut !== 'Payé' && (
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
                    )}
                    
                    {/* Message pour les réservations en attente de validation */}
                    {reservation.paiement_statut === 'en_attente_validation' && (
                      <div className="validation-pending">
                        <div className="pending-icon">⏳</div>
                        <div className="pending-content">
                          <span className="pending-desc">Votre réservation est en cours de traitement</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Message pour les réservations payées */}
                    {reservation.paiement_statut === 'Payé' && (
                      <div className="payment-success">
                        <div className="success-icon">✅</div>
                        <div className="success-content">
                          <span className="success-title">Votre paiement est fait</span>
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
