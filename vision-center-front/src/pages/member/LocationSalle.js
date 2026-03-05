import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSiteVitrine from '../../components/vitrine/NavigationSiteVitrine';
import FooterSiteVitrine from '../../components/vitrine/FooterSiteVitrine';
import ApiService from '../../services/api';
import '../../styles/pages/LocationSalle.css';
import '../../styles/pages/ReservationValidation.css';

const LocationSalle = () => {
  const navigate = useNavigate();
  
  const [salles, setSalles] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalle, setSelectedSalle] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [formData, setFormData] = useState({
    salle_id: '',
    date_debut: '',
    date_fin: '',
    heure_debut: '09:00',
    heure_fin: '18:00',
    capacite_requise: '',
    description: ''
  });

  // État pour les infos du non-membre
  const [memberInfo, setMemberInfo] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    numero_carte_identite: '',
    id: null
  });

  // État pour le résultat de réservation (étape 3)
  const [reservationResult, setReservationResult] = useState(null);
  
  // État pour la popup de confirmation
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // Fonction pour afficher la popup de confirmation
  const handleConfirmReservation = () => {
    setShowConfirmPopup(true);
  };

  // Fonction pour confirmer réellement la réservation
  const confirmReservation = async () => {
    try {
      // Préparer les données de réservation
      const reservationData = {
        salle_id: selectedSalle.id,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin,
        capacite_requise: formData.capacite_requise,
        description: formData.description,
        statut: 'En attente'
      };

      console.log('Données de réservation initiales:', reservationData);
      console.log('selectedSalle:', selectedSalle);
      console.log('formData:', formData);
      console.log('isMember:', isMember, 'isLoggedIn:', isLoggedIn);

      let result;

      if (isMember && isLoggedIn) {
        // Réservation pour un membre connecté - ajouter utilisateur_id
        reservationData.utilisateur_id = memberInfo.id || 1; // Adapter selon ton système
        console.log('Création réservation pour membre avec utilisateur_id:', reservationData.utilisateur_id);
        result = await ApiService.createReservation(reservationData);
      } else {
        // Utiliser l'ID du non-membre créé à l'étape 1
        console.log('memberInfo complet:', memberInfo);
        console.log('memberInfo.id:', memberInfo.id);
        
        if (!memberInfo.id) {
          console.error('ERREUR: memberInfo.id est null ou undefined!');
          console.error('memberInfo complet pour debug:', JSON.stringify(memberInfo, null, 2));
          throw new Error('ID du non-membre non trouvé. Veuillez recommencer depuis l\'étape 1.');
        }
        
        // Ajouter l'ID de l'utilisateur aux données de réservation
        reservationData.utilisateur_id = memberInfo.id;
        console.log('Utilisation utilisateur_id de l\'étape 1:', memberInfo.id);
        console.log('Données de réservation finales:', reservationData);
        console.log('DataJSON envoyé à l\'API:', JSON.stringify(reservationData, null, 2));
        
        // Créer la réservation avec l'ID de l'utilisateur
        result = await ApiService.createReservation(reservationData);
      }

      console.log('Résultat de l API:', result);

      if (result.success) {
        // Mettre à jour le résultat de réservation
        console.log('selectedSalle au moment de la confirmation:', selectedSalle);
        console.log('result.data (réservation créée):', result.data);
        
        const validationData = {
          reservation: result.data,
          salle: selectedSalle,
          member: memberInfo
        };
        
        console.log('validationData complet:', validationData);
        setReservationResult(validationData);
        
        // Rediriger vers la page de succès
        navigate('/reservation-success', { 
          state: { 
            reservation: result.data, 
            salle: selectedSalle 
          } 
        });
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      alert('Erreur lors de la confirmation. Veuillez réessayer.');
    }
    setShowConfirmPopup(false);
  };

  // Fonction pour annuler la confirmation
  const cancelConfirmation = () => {
    setShowConfirmPopup(false);
  };

  // État pour les infos de connexion membre
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  // État pour savoir si l'utilisateur est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // État pour savoir si l'utilisateur est un membre
  const [isMember, setIsMember] = useState(false);

  // État pour gérer les étapes de réservation
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState(null);

  // Fetch salles from API
  const fetchSalles = async () => {
    try {
      setError(null);
      
      const result = await ApiService.getSalles();
      
      if (result.success) {
        // Format the data to match the expected structure
        const formattedSalles = result.data.map(salle => ({
          id: salle.id,
          nom: salle.nom,
          capacite: salle.capacite,
          prix: `${salle.prix.toLocaleString()} Ar/jour`,
          image: salle.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&auto=format',
          disponibilite: salle.disponibilite,
          equipements: salle.equipements || []
        }));
        
        setSalles(formattedSalles);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement des salles');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des salles:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberInfoChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonctions pour gérer les étapes
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

  const handleStep1Submit = async () => {
    // Valider les informations personnelles
    if (!isMember) {
      if (!memberInfo.nom || !memberInfo.prenom || !memberInfo.email || !memberInfo.telephone) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      try {
        // Créer le non-membre dès l'étape 1
        const memberData = {
          nom: memberInfo.nom,
          prenom: memberInfo.prenom,
          email: memberInfo.email,
          telephone: memberInfo.telephone,
          numero_carte_identite: memberInfo.numero_carte_identite
        };
        
        const result = await ApiService.createOrFindNonMember(memberData);
        
        if (result.success) {
          console.log('Non-membre créé/trouvé:', result.data);
          console.log('Structure complète de result.data:', JSON.stringify(result.data, null, 2));
          console.log('ID du non-membre:', result.data.id_utilisateur);
          
          // Stocker l'ID de l'utilisateur créé pour l'utiliser plus tard
          setMemberInfo(prev => ({ 
            ...prev, 
            id: result.data.id_utilisateur  // Utiliser id_utilisateur au lieu de id
          }));
          
          console.log('memberInfo mis à jour avec ID:', { ...memberInfo, id: result.data.id_utilisateur });
          nextStep();
        } else {
          alert(`Erreur: ${result.message}`);
        }
      } catch (error) {
        console.error('Erreur lors de la création du non-membre:', error);
        alert('Erreur lors de la création du non-membre. Veuillez réessayer.');
      }
    } else if (!isLoggedIn) {
      alert('Veuillez vous connecter pour continuer');
      return;
    } else {
      nextStep();
    }
  };

  const handleStep2Submit = async () => {
    // Valider le formulaire de réservation
    if (!formData.date_debut || !formData.date_fin || !formData.capacite_requise) {
      alert('Veuillez remplir tous les champs de réservation');
      return;
    }
    
    // Passer à l'étape 3 (validation) sans créer la réservation
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    try {
      // Debug: vérifier si selectedSalle est défini
      console.log('selectedSalle:', selectedSalle);
      console.log('formData:', formData);
      
      if (!selectedSalle || !selectedSalle.id) {
        alert('Erreur: Veuillez sélectionner une salle');
        return;
      }
      
      // Soumettre la réservation finale
      const reservationData = {
        salle_id: selectedSalle.id,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin,
        capacite_requise: formData.capacite_requise || selectedSalle.capacite,
        description: formData.description || ''
      };
      
      console.log('reservationData à envoyer:', reservationData);
      
      let result;
      
      if (isMember) {
        // Réservation pour un membre
        result = await ApiService.createReservation(reservationData);
      } else {
        // Réservation pour un non membre déjà créé à l'étape 1
        // Utiliser l'ID de l'utilisateur déjà stocké dans memberInfo.id
        reservationData.utilisateur_id = memberInfo.id;
        
        console.log('Réservation pour non-membre avec utilisateur_id:', memberInfo.id);
        console.log('Données de réservation finales:', reservationData);
        
        // Utiliser la route normale avec utilisateur_id
        result = await ApiService.createReservation(reservationData);
      }
      
      if (result.success) {
        // Stocker les données de réservation pour l'étape 3
        const validationData = {
          reservation: result.data,
          salle: selectedSalle,
          member: memberInfo
        };
        
        // Passer à l'étape 3 (validation) dans la même page
        setReservationResult(validationData);
        setCurrentStep(3);
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert('Erreur lors de la création de la réservation. Veuillez réessayer.');
    }
  };

  const handleLogin = async () => {
    if (!loginInfo.email || !loginInfo.password) {
      alert('Veuillez remplir l\'email et le mot de passe');
      return;
    }
    
    try {
      const result = await ApiService.login(loginInfo.email, loginInfo.password);
      
      if (result.success) {
        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        setIsLoggedIn(true);
        alert('Connexion réussie !');
      } else {
        alert(`Erreur de connexion: ${result.message}`);
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      alert('Erreur lors de la connexion. Veuillez réessayer.');
    }
  };

  const handleSalleClick = (salle) => {
    setSelectedSalle(salle);
    setFormData(prev => ({
      ...prev,
      salle_id: salle.id,
      capacite_requise: salle.capacite
    }));
  };

  const filteredSalles = salles.filter(salle =>
    salle.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="location-salle-container">
        <div className="error-container">
          <div className="error-message">
            Erreur lors du chargement des salles
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="location-salle-container">
      {/* Header via NavigationSiteVitrine */}
      <NavigationSiteVitrine scrollToSection={scrollToSection} />
      
      {/* Contenu Location Salle */}
      <div className="location-salle-content">
        {/* Header spécifique à Location Salle */}
        <header className="location-header">
          <div className="header-content">
            <h1>🏢 Location de Salles</h1>
            <p>Réservez une salle pour vos activités spirituelles et réunions</p>
          </div>
        </header>

        {/* Section Suivi Location - Bouton visible */}
        <div className="suivi-location-section">
          <div className="suivi-content">
            <h3>📋 Vous avez déjà une réservation ?</h3>
            <p>Suivez l'état de votre location de salle et vos paiements</p>
            <button onClick={() => navigate('/acces-non-membre')} className="btn-outline btn-medium">
              <span>📋 Suivre ma location de salle</span>
            </button>
          </div>
        </div>

        {/* Affichage détaillé de la salle sélectionnée */}
        {selectedSalle ? (
          <div className="salle-detail-container">
            {/* Animation d'entrée */}
            <div className="salle-detail-animation">
              {/* Section gauche - Détails de la salle */}
              <div className="salle-detail-left">
                <button 
                  className="back-btn" 
                  onClick={() => setSelectedSalle(null)}
                >
                  ← Retour aux salles
                </button>
                
                <div className="salle-detail-card">
                  <div className="salle-detail-image">
                    <img src={selectedSalle.image} alt={selectedSalle.nom} />
                    <div className={`salle-status ${selectedSalle.disponibilite.toLowerCase()}`}>
                      {selectedSalle.disponibilite}
                    </div>
                  </div>
                  
                  <div className="salle-detail-info">
                    <h2>{selectedSalle.nom}</h2>
                    
                    <div className="salle-detail-details">
                      <div className="detail-item">
                        <span className="detail-icon">👥</span>
                        <span>{selectedSalle.capacite} personnes</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">💰</span>
                        <span>{selectedSalle.prix}</span>
                      </div>
                    </div>
                    
                    <div className="equipements">
                      <h4>Équipements</h4>
                      <div className="equipements-list">
                        {selectedSalle.equipements.map((equip, index) => (
                          <span key={`detail-equip-${index}`} className="equipement-tag">{equip}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section droite - Formulaire de réservation */}
              <div className="salle-detail-right">
                <div className="reservation-card">
                  <h3>📅 Réserver cette salle</h3>
                  
                  {/* Toggle Membre/Non-membre */}
                  <div className="member-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={isMember}
                        onChange={(e) => setIsMember(e.target.checked)}
                        className="toggle-input"
                      />
                      <span className="toggle-slider"></span>
                      <span className="toggle-text">
                        {isMember ? 'Je suis un membre' : 'Je ne suis pas membre'}
                      </span>
                    </label>
                  </div>
                  
                  {/* Formulaire de connexion pour les membres */}
                  {isMember && !isLoggedIn && (
                    <div className="member-login-section">
                      <h4>🔐 Connexion membre</h4>
                      <div className="login-form">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={loginInfo.email}
                            onChange={handleLoginChange}
                            placeholder="votre@email.com"
                            className="form-input"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Mot de passe</label>
                          <input
                            type="password"
                            name="password"
                            value={loginInfo.password}
                            onChange={handleLoginChange}
                            placeholder="••••••••"
                            className="form-input"
                            required
                          />
                        </div>
                        
                        <button 
                          type="button" 
                          className="btn btn-primary login-btn"
                          onClick={handleLogin}
                        >
                          Se connecter
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Message de bienvenue pour membre connecté */}
                  {isMember && isLoggedIn && (
                    <div className="member-welcome-section">
                      <h4>✅ Connecté en tant que membre</h4>
                      <p>Vous pouvez maintenant procéder à votre réservation.</p>
                    </div>
                  )}
                  
                  <div className="reservation-form">
                    {/* Indicateur d'étapes */}
                    <div className="steps-indicator">
                      <div className={`step ${currentStep === 1 ? 'current' : ''} ${currentStep > 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Identification</div>
                      </div>
                      <div className="step-connector"></div>
                      <div className={`step ${currentStep === 2 ? 'current' : ''} ${currentStep > 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Réservation</div>
                      </div>
                      <div className="step-connector"></div>
                      <div className={`step ${currentStep === 3 ? 'current' : ''} ${currentStep > 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Validation</div>
                      </div>
                    </div>

                    {/* Étape 1 : Identification */}
                    {currentStep === 1 && (
                      <div className="step-content">
                        <h3>👤 Étape 1 : Identification</h3>
                        
                        {!isMember ? (
                          <div className="member-info-section">
                            <h4>Informations personnelles</h4>
                            <div className="form-grid">
                              <div className="form-group">
                                <label>Nom *</label>
                                <input
                                  type="text"
                                  name="nom"
                                  value={memberInfo.nom}
                                  onChange={handleMemberInfoChange}
                                  placeholder="Votre nom"
                                  className="form-input"
                                  required
                                />
                              </div>
                              
                              <div className="form-group">
                                <label>Prénom *</label>
                                <input
                                  type="text"
                                  name="prenom"
                                  value={memberInfo.prenom}
                                  onChange={handleMemberInfoChange}
                                    placeholder="Votre prénom"
                                  className="form-input"
                                  required
                                />
                              </div>
                              
                              <div className="form-group">
                                <label>Email *</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={memberInfo.email}
                                  onChange={handleMemberInfoChange}
                                  placeholder="votre@email.com"
                                  className="form-input"
                                  required
                                />
                              </div>
                              
                              <div className="form-group">
                                <label>Téléphone *</label>
                                <input
                                  type="tel"
                                  name="telephone"
                                  value={memberInfo.telephone}
                                  onChange={handleMemberInfoChange}
                                  placeholder="Votre téléphone"
                                  className="form-input"
                                  required
                                />
                              </div>
                              
                              <div className="form-group full-width">
                                <label>Numéro de carte d'identité *</label>
                                <input
                                  type="text"
                                  name="numero_carte_identite"
                                  value={memberInfo.numero_carte_identite}
                                  onChange={handleMemberInfoChange}
                                  placeholder="Ex: 1234567890123"
                                  className="form-input"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="member-login-section">
                            <h4>Connexion membre</h4>
                            <div className="form-grid">
                              <div className="form-group">
                                <label>Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={loginInfo.email}
                                  onChange={handleLoginChange}
                                  placeholder="votre@email.com"
                                  className="form-input"
                                />
                              </div>
                              
                              <div className="form-group">
                                <label>Mot de passe</label>
                                <input
                                  type="password"
                                  name="password"
                                  value={loginInfo.password}
                                  onChange={handleLoginChange}
                                  placeholder="Votre mot de passe"
                                  className="form-input"
                                />
                              </div>
                            </div>
                            
                            <button className="btn btn-primary" onClick={handleLogin}>
                              Se connecter
                            </button>
                          </div>
                        )}
                        
                        <div className="step-actions">
                          <button className="btn btn-primary" onClick={handleStep1Submit}>
                            Suivant →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Étape 2 : Réservation */}
                    {currentStep === 2 && (
                      <div className="step-content">
                        <h3>📅 Étape 2 : Détails de la réservation</h3>
                        
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Date de début *</label>
                            <input
                              type="date"
                              name="date_debut"
                              value={formData.date_debut}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Date de fin *</label>
                            <input
                              type="date"
                              name="date_fin"
                              value={formData.date_fin}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Heure de début *</label>
                            <input
                              type="time"
                              name="heure_debut"
                              value={formData.heure_debut}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Heure de fin *</label>
                            <input
                              type="time"
                              name="heure_fin"
                              value={formData.heure_fin}
                              onChange={handleInputChange}
                              className="form-input"
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Capacité requise *</label>
                            <input
                              type="number"
                              name="capacite_requise"
                              value={formData.capacite_requise}
                              onChange={handleInputChange}
                              placeholder="Nombre de personnes"
                              className="form-input"
                              required
                            />
                          </div>
                          
                          <div className="form-group full-width">
                            <label>Description</label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              placeholder="Description de l'événement..."
                              className="form-textarea"
                              rows="3"
                            />
                          </div>
                        </div>
                        
                        <div className="step-actions">
                          <button className="btn btn-secondary" onClick={prevStep}>
                            ← Précédent
                          </button>
                          <button className="btn btn-primary" onClick={handleStep2Submit}>
                            Suivant →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Étape 3 : Validation */}
                    {currentStep === 3 && (
                      <div className="step-content">
                        <h3>🎯 Étape 3 : Validation de la réservation</h3>
                        
                        {!reservationResult ? (
                          <div className="validation-container">
                            <div className="validation-summary">
                              <h4>Résumé de votre réservation</h4>
                              
                              <div className="summary-section">
                                <h5>📍 Salle réservée</h5>
                                <div className="info-row">
                                  <span className="info-label">Nom:</span>
                                  <span className="info-value">{selectedSalle?.nom}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Capacité:</span>
                                  <span className="info-value">{selectedSalle?.capacite} personnes</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Prix:</span>
                                  <span className="info-value">{selectedSalle?.prix} Ar</span>
                                </div>
                              </div>
                              
                              <div className="summary-section">
                                <h5>📅 Période de réservation</h5>
                                <div className="info-row">
                                  <span className="info-label">Date début:</span>
                                  <span className="info-value">{new Date(formData?.date_debut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Date fin:</span>
                                  <span className="info-value">{new Date(formData?.date_fin).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Horaires:</span>
                                  <span className="info-value">
                                    {formData?.heure_debut && formData?.heure_fin ? 
                                      (() => {
                                        const formatHeure = (heure) => {
                                          if (typeof heure === 'string' && heure.includes('T')) {
                                            const date = new Date(heure);
                                            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
                                          }
                                          else if (typeof heure === 'string' && heure.includes(':')) {
                                            return heure.split(':').slice(0, 2).join(':');
                                          }
                                          else {
                                            const date = new Date(heure);
                                            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
                                          }
                                        };
                                        return `${formatHeure(formData.heure_debut)} à ${formatHeure(formData.heure_fin)}`;
                                      })()
                                      : 'Non défini'
                                    }
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Durée:</span>
                                  <span className="info-value">{Math.ceil((new Date(formData?.date_fin) - new Date(formData?.date_debut)) / (1000 * 60 * 60 * 24)) + 1} jour(s)</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Capacité:</span>
                                  <span className="info-value">{formData?.capacite_requise} personnes</span>
                                </div>
                              </div>
                              
                              <div className="summary-section">
                                <h5>👤 Informations du réservataire</h5>
                                <div className="info-row">
                                  <span className="info-label">Nom:</span>
                                  <span className="info-value">{memberInfo?.nom} {memberInfo?.prenom}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Email:</span>
                                  <span className="info-value">{memberInfo?.email}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Téléphone:</span>
                                  <span className="info-value">{memberInfo?.telephone}</span>
                                </div>
                              </div>
                              
                              {formData?.description && (
                                <div className="summary-section">
                                  <h5>📝 Description</h5>
                                  <div className="info-row">
                                    <span className="info-value">{formData.description}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="validation-container">
                            <div className="validation-summary">
                              <h4>Réservation créée avec succès!</h4>
                              
                              <div className="summary-section">
                                <h5>📍 Salle réservée</h5>
                                <div className="info-row">
                                  <span className="info-label">Nom:</span>
                                  <span className="info-value">{reservationResult.salle?.nom}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Capacité:</span>
                                  <span className="info-value">{reservationResult.salle?.capacite} personnes</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Prix:</span>
                                  <span className="info-value">{reservationResult.salle?.prix} Ar</span>
                                </div>
                              </div>
                              
                              <div className="summary-section">
                                <h5>📅 Période de réservation</h5>
                                <div className="info-row">
                                  <span className="info-label">Date début:</span>
                                  <span className="info-value">{new Date(reservationResult.reservation?.date_debut).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Date fin:</span>
                                  <span className="info-value">{new Date(reservationResult.reservation?.date_fin).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Horaires:</span>
                                  <span className="info-value">
                                    {reservationResult.reservation?.heure_debut && reservationResult.reservation?.heure_fin ? 
                                      (() => {
                                        const formatHeure = (heure) => {
                                          // Si c'est une chaîne ISO comme "2026-03-02T10:00:00.000Z"
                                          if (typeof heure === 'string' && heure.includes('T')) {
                                            const date = new Date(heure);
                                            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
                                          }
                                          // Si c'est juste une heure comme "10:00"
                                          else if (typeof heure === 'string' && heure.includes(':')) {
                                            return heure.split(':').slice(0, 2).join(':');
                                          }
                                          // Sinon, essayer de convertir en date
                                          else {
                                            const date = new Date(heure);
                                            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
                                          }
                                        };
                                        return `${formatHeure(reservationResult.reservation.heure_debut)} à ${formatHeure(reservationResult.reservation.heure_fin)}`;
                                      })()
                                      : 'Non défini'
                                    }
                                  </span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Durée:</span>
                                  <span className="info-value">{Math.ceil((new Date(reservationResult.reservation?.date_fin) - new Date(reservationResult.reservation?.date_debut)) / (1000 * 60 * 60 * 24)) + 1} jour(s)</span>
                                </div>
                                <div className="info-row">
                                  <span className="info-label">Capacité:</span>
                                  <span className="info-value">{reservationResult.reservation?.capacite_requise} personnes</span>
                                </div>
                                <div className="info-row highlight">
                                  <span className="info-label">Référence:</span>
                                  <span className="info-value">#{reservationResult.reservation?.id}</span>
                                </div>
                              </div>
                              
                              <div className="summary-section">
                                <h5>👤 Informations du réservataire</h5>
                                {!isMember ? (
                                  <>
                                    <div className="info-row">
                                      <span className="info-label">Nom:</span>
                                      <span className="info-value">{reservationResult.member?.prenom} {reservationResult.member?.nom}</span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">Email:</span>
                                      <span className="info-value">{reservationResult.member?.email}</span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">Téléphone:</span>
                                      <span className="info-value">{reservationResult.member?.telephone}</span>
                                    </div>
                                    <div className="info-row">
                                      <span className="info-label">Carte d'identité:</span>
                                      <span className="info-value status">✅ Validée</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="info-row">
                                    <span className="info-label">Statut membre:</span>
                                    <span className="info-value status">✅ Connecté</span>
                                  </div>
                                )}
                              </div>

                              <div className="summary-section">
                                <h5>💰 Prix total</h5>
                                <p className="price-total">{reservationResult.reservation?.prix_total || 'Calcul en cours...'} Ar</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="step-actions">
                          <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                            ← Revenir en arrière
                          </button>
                          <button className="btn btn-success" onClick={handleConfirmReservation}>
                            ✅ Valider
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Popup de confirmation */}
                    {showConfirmPopup && (
                      <div className="confirm-popup-overlay">
                        <div className="confirm-popup">
                          <h3>Confirmez-vous votre réservation ?</h3>
                          <div className="confirm-popup-actions">
                            <button className="btn btn-secondary" onClick={cancelConfirmation}>
                              Non
                            </button>
                            <button className="btn btn-success" onClick={confirmReservation}>
                              Oui
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Barre de recherche */}
            <div className="search-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                <button className="search-btn">
                  <span>🔍</span>
                </button>
              </div>
            </div>

            {/* Grille des salles */}
            <div className="salles-grid">
              {filteredSalles.map((salle, index) => (
                <div
                  key={`${salle.id}-${index}`}
                  className="salle-card"
                  onClick={() => handleSalleClick(salle)}
                >
                  <div className="salle-image">
                    <img src={salle.image} alt={salle.nom} />
                    <div className={`salle-status ${salle.disponibilite.toLowerCase()}`}>
                      {salle.disponibilite}
                    </div>
                  </div>
                  
                  <div className="salle-info">
                    <h3>{salle.nom}</h3>
                    
                    <div className="salle-details">
                      <div className="detail-item">
                        <span className="detail-icon">👥</span>
                        <span>{salle.capacite} personnes</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">💰</span>
                        <span>{salle.prix}</span>
                      </div>
                    </div>
                    
                    <div className="equipements">
                      <h4>Équipements</h4>
                      <div className="equipements-list">
                        {salle.equipements.map((equip, index) => (
                          <span key={`${salle.id}-equip-${index}`} className="equipement-tag">{equip}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
      <FooterSiteVitrine />
    </div>
  );
};

export default LocationSalle;
