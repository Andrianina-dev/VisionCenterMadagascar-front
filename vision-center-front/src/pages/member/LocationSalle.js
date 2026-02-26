import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSiteVitrine from '../../components/vitrine/NavigationSiteVitrine';
import FooterSiteVitrine from '../../components/vitrine/FooterSiteVitrine';
import ApiService from '../../services/api';
import '../../styles/pages/LocationSalle.css';

const LocationSalle = () => {
  const navigate = useNavigate();
  
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // État pour les infos non-membre
  const [memberInfo, setMemberInfo] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    carte_identite_recto: null,
    carte_identite_verso: null
  });

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReserver = async () => {
    if (!selectedSalle) {
      alert('Veuillez sélectionner une salle');
      return;
    }
    
    // Validate form data
    if (!formData.date_debut || !formData.date_fin) {
      alert('Veuillez remplir les dates de début et de fin');
      return;
    }
    
    // Validation pour les non-membres
    if (!isMember) {
      if (!memberInfo.nom || !memberInfo.prenom || !memberInfo.email) {
        alert('Veuillez remplir vos informations personnelles');
        return;
      }
    }
    
    try {
      // Préparer les données de réservation selon la structure de la table
      const reservationData = {
        salle_id: selectedSalle.id,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        heure_debut: formData.heure_debut,
        heure_fin: formData.heure_fin,
        capacite_requise: formData.capacite_requise || selectedSalle.capacite,
        description: formData.description || ''
      };
      
      let result;
      
      if (isMember) {
        // Réservation pour un membre
        result = await ApiService.createReservation(reservationData);
      } else {
        // Réservation pour un non-membre
        result = await ApiService.createReservationForNonMember(reservationData, memberInfo);
      }
      
      if (result.success) {
        alert(`Réservation de la salle ${selectedSalle.nom} effectuée avec succès!`);
        // Reset form
        setFormData({
          salle_id: '',
          date_debut: '',
          date_fin: '',
          heure_debut: '09:00',
          heure_fin: '18:00',
          capacite_requise: '',
          description: ''
        });
        setMemberInfo({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          numero_carte_identite: ''
        });
        setSelectedSalle(null);
        // Refresh salles to update availability
        fetchSalles();
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setMemberInfo(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
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

  const handleStep1Submit = () => {
    // Valider les informations personnelles
    if (!isMember) {
      if (!memberInfo.nom || !memberInfo.prenom || !memberInfo.email || !memberInfo.telephone) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }
    } else if (!isLoggedIn) {
      alert('Veuillez vous connecter pour continuer');
      return;
    }
    
    nextStep();
  };

  const handleStep2Submit = () => {
    // Valider le formulaire de réservation
    if (!formData.date_debut || !formData.date_fin || !formData.capacite_requise) {
      alert('Veuillez remplir tous les champs de réservation');
      return;
    }
    
    nextStep();
  };

  const handleFinalSubmit = async () => {
    try {
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
      
      let result;
      
      if (isMember) {
        // Réservation pour un membre
        result = await ApiService.createReservation(reservationData);
      } else {
        // Réservation pour un non-membre avec fichiers
        const formDataWithFiles = new FormData();
        
        // Ajouter les données de réservation
        Object.keys(reservationData).forEach(key => {
          formDataWithFiles.append(key, reservationData[key]);
        });
        
        // Ajouter les infos du non-membre
        formDataWithFiles.append('nom', memberInfo.nom);
        formDataWithFiles.append('prenom', memberInfo.prenom);
        formDataWithFiles.append('email', memberInfo.email);
        formDataWithFiles.append('telephone', memberInfo.telephone);
        
        // Ajouter les fichiers de carte d'identité
        formDataWithFiles.append('carte_identite_recto', memberInfo.carte_identite_recto);
        formDataWithFiles.append('carte_identite_verso', memberInfo.carte_identite_verso);
        
        result = await ApiService.createReservationForNonMember(formDataWithFiles);
      }
      
      if (result.success) {
        alert(`Réservation de la salle ${selectedSalle.nom} effectuée avec succès!`);
        
        // Reset form et retour à l'étape 1
        setFormData({
          salle_id: '',
          date_debut: '',
          date_fin: '',
          heure_debut: '09:00',
          heure_fin: '18:00',
          capacite_requise: '',
          description: ''
        });
        setMemberInfo({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          carte_identite_recto: null,
          carte_identite_verso: null
        });
        setSelectedSalle(null);
        setCurrentStep(1);
        
        // Refresh salles to update availability
        fetchSalles();
      } else {
        alert(`Erreur: ${result.message}`);
      }
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    }
  };

  const handleLogin = async () => {
    if (!loginInfo.email || !loginInfo.password) {
      alert('Veuillez remplir votre email et mot de passe');
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

  if (loading) {
    return (
      <div className="location-salle-container">
        <div className="loading-container">
          <div className="loading-spinner">Chargement des salles...</div>
        </div>
      </div>
    );
  }

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
                                <label>Carte d'identité (recto) *</label>
                                <input
                                  type="file"
                                  name="carte_identite_recto"
                                  onChange={handleFileChange}
                                  accept="image/*"
                                  className="form-input"
                                  required
                                />
                                {memberInfo.carte_identite_recto && (
                                  <small>Fichier sélectionné : {memberInfo.carte_identite_recto.name}</small>
                                )}
                              </div>
                              
                              <div className="form-group full-width">
                                <label>Carte d'identité (verso) *</label>
                                <input
                                  type="file"
                                  name="carte_identite_verso"
                                  onChange={handleFileChange}
                                  accept="image/*"
                                  className="form-input"
                                  required
                                />
                                {memberInfo.carte_identite_verso && (
                                  <small>Fichier sélectionné : {memberInfo.carte_identite_verso.name}</small>
                                )}
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
                        
                        <div className="validation-summary">
                          <h4>Récapitulatif de votre réservation</h4>
                          
                          <div className="summary-section">
                            <h5>📍 Salle sélectionnée</h5>
                            <p><strong>{selectedSalle?.nom}</strong></p>
                            <p>Capacité : {selectedSalle?.capacite} personnes</p>
                            <p>Prix : {selectedSalle?.prix}</p>
                          </div>
                          
                          <div className="summary-section">
                            <h5>📅 Période de réservation</h5>
                            <p>Du {formData.date_debut} au {formData.date_fin}</p>
                            <p>De {formData.heure_debut} à {formData.heure_fin}</p>
                            <p>Capacité requise : {formData.capacite_requise} personnes</p>
                          </div>
                          
                          <div className="summary-section">
                            <h5>👤 Informations personnelles</h5>
                            {!isMember ? (
                              <>
                                <p><strong>{memberInfo.prenom} {memberInfo.nom}</strong></p>
                                <p>Email : {memberInfo.email}</p>
                                <p>Téléphone : {memberInfo.telephone}</p>
                                <p>Carte d'identité : ✅ Fichiers uploadés</p>
                              </>
                            ) : (
                              <p>Membre connecté : ✅</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="step-actions">
                          <button className="btn btn-secondary" onClick={prevStep}>
                            ← Précédent
                          </button>
                          <button className="btn btn-success" onClick={handleFinalSubmit}>
                            ✅ Confirmer la réservation
                          </button>
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
