import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaCheckCircle, FaClipboardList, FaSearch } from 'react-icons/fa';

import ApiService from '../../services/api';

import Card from '../../components/cards/Card';

import '../../styles/pages/LocationSalle.css';

import '../../styles/pages/ReservationValidation.css';



const LocationSalle = () => {

  const navigate = useNavigate();

  

  const [salles, setSalles] = useState([]);

  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedSalle, setSelectedSalle] = useState(() => {

    const savedSalle = sessionStorage.getItem('selectedSalle');

    return savedSalle ? JSON.parse(savedSalle) : null;

  });



  // Gérer l'animation du label flottant

  const handleSearchChange = (e) => {

    const value = e.target.value;

    setSearchQuery(value);
    
    const container = document.querySelector('.search-container');

    if (value) {

      container.classList.add('has-value');

    } else {

      container.classList.remove('has-value');

    }

  };



  // Sauvegarder selectedSalle dans sessionStorage quand il change

  useEffect(() => {

    if (selectedSalle) {

      sessionStorage.setItem('selectedSalle', JSON.stringify(selectedSalle));

    } else {

      sessionStorage.removeItem('selectedSalle');

    }

  }, [selectedSalle]);



  // Réinitialiser selectedSalle seulement quand on arrive via navigation (pas au rechargement)

  useEffect(() => {

    // Vérifier si on arrive via navigation (pas un rechargement)

    const navigationEntries = performance.getEntriesByType('navigation');

    const isNavigation = navigationEntries.length > 0 && 

                        navigationEntries[0].type === 'navigate';

    

    if (isNavigation) {

      // Forcer l'affichage de la liste des salles seulement si on arrive via navigation

      setSelectedSalle(null);

    }

  }, []);



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

  

  // État pour les notifications

  const [notification, setNotification] = useState(null);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  

  // État pour le message de survol du bouton

  const [hoveredButton, setHoveredButton] = useState(null);



  // Fonction pour afficher une notification

  const showNotification = (message, type = 'warning') => {

    setNotification({ message, type });

    setTimeout(() => setNotification(null), 3000); // Disparaît après 3 secondes

  };



  // Fonction pour afficher la popup de confirmation

  const handleConfirmReservation = () => {

    // Vérifier si la salle sélectionnée est occupée

    if (selectedSalle && selectedSalle.disponibilite === 'occupée') {

      showNotification('Impossible de réserver une salle occupée', 'warning');

      return; // Bloquer l'accès à la réservation

    }

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



                        

      let result;



      if (isMember && isLoggedIn) {

        // Réservation pour un membre connecté - ajouter utilisateur_id

        reservationData.utilisateur_id = memberInfo.id || 1; // Adapter selon ton système

                result = await ApiService.createReservation(reservationData);

      } else {

        // Utiliser l'ID du non-membre créé à l'étape 1

                        

        if (!memberInfo.id) {

                    console.error('memberInfo complet pour debug:', JSON.stringify(memberInfo, null, 2));

          throw new Error('ID du non-membre non trouvé. Veuillez recommencer depuis l\'étape 1.');

        }

        

        // Ajouter l'ID de l'utilisateur aux données de réservation

        reservationData.utilisateur_id = memberInfo.id;

                                

        // Créer la réservation avec l'ID de l'utilisateur

        result = await ApiService.createReservation(reservationData);

      }



      

      if (result.success) {

        // Mettre à jour le résultat de réservation

                        

        const validationData = {

          reservation: result.data,

          salle: selectedSalle,

          member: memberInfo

        };

        

                setReservationResult(validationData);

        

        // Rediriger tout de suite vers paiement-reservation-salle après confirmation

        navigate('/paiement-reservation-salle', { 

          state: { 

            reservation: result.data, 

            salle: selectedSalle,

            member: memberInfo,

            fromConfirmation: true // Indiquer que ça vient de la confirmation

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

          image: salle.image_url || salle.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&auto=format',

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

    

    // Vérifier si l'utilisateur est déjà connecté au chargement

    const checkUserConnection = () => {

      const token = localStorage.getItem('token');

      const user = localStorage.getItem('user') || localStorage.getItem('member'); // Chercher dans les deux clés

      

                  

      if (token && user) {

                setIsLoggedIn(true);

        // Si l'utilisateur est un membre, mettre isMember à true

        try {

          const userData = JSON.parse(user);

                    if (userData.role === 'membre') {

                        setIsMember(true);

            setMemberInfo({

              id: userData.id,

              nom: userData.nom || userData.lastName || '',

              prenom: userData.prenom || userData.firstName || '',

              email: userData.email || ''

            });

          }

        } catch (error) {

          console.error('Erreur parsing user data:', error);

        }

      } else {

              }

    };

    

    checkUserConnection();

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

                                        

          // Stocker les données complètes du non-membre dans localStorage

          const nonMemberData = {

            id_utilisateur: result.data.id_utilisateur,

            nom: memberInfo.nom,

            prenom: memberInfo.prenom,

            email: memberInfo.email,

            telephone: memberInfo.telephone,

            numero_carte_identite: memberInfo.numero_carte_identite

          };

          localStorage.setItem('non-member', JSON.stringify(nonMemberData));

          

          // Stocker l'ID de l'utilisateur créé pour l'utiliser plus tard

          setMemberInfo(prev => ({ 

            ...prev, 

            id: result.data.id_utilisateur  // Utiliser id_utilisateur au lieu de id

          }));

          

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

    

    // Passer à l'étape 2 (confirmation) pour afficher les données à confirmer

    setCurrentStep(2);

  };



  const handleFinalSubmit = async () => {

    try {

      // Debug: vérifier si selectedSalle est défini

                  

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

      

            

      let result;

      

      if (isMember) {

        // Réservation pour un membre - ajouter utilisateur_id

        reservationData.utilisateur_id = memberInfo.id || 1;

                result = await ApiService.createReservation(reservationData);

      } else {

        // Réservation pour un non membre déjà créé à l'étape 1

        // Utiliser l'ID de l'utilisateur déjà stocké dans memberInfo.id

        reservationData.utilisateur_id = memberInfo.id;

        

                        

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

    // Ne plus permettre la sélection directe depuis la liste

    // Seul le bouton "Réservez" peut déclencher la réservation

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

    <div className="location-salle-content">

      {/* Composant de notification */}

      {notification && (

        <div className={`notification notification-${notification.type}`}>

          <span className="notification-icon">

            {notification.type === 'warning' ? '⚠️' : '✅'}

          </span>

          <span className="notification-message">{notification.message}</span>

        </div>

      )}

      

      {/* Contenu Location Salle */}

      <div className="location-salle-content">

        {/* Header spécifique à Location Salle */}

        <header className="location-header">

          <div className="header-content">

            <h1>Location de Salles</h1>

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

                        <span className="detail-icon"><FaUsers /></span>

                        <span>{selectedSalle.capacite} personnes</span>

                      </div>

                      <div className="detail-item">

                        <span className="detail-icon"><FaMoneyBillWave /></span>

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

                  <h3><FaCalendarAlt /> Réserver cette salle</h3>

                  

                  {/* Utilisateur déjà connecté - afficher ses informations */}

                  <div className="member-info-display">

                    <h4>👤 Informations du réservant</h4>

                    <div className="info-display-grid">

                      <div className="info-item">

                        <span className="info-label">Nom:</span>

                        <span className="info-value">{memberInfo.prenom} {memberInfo.nom}</span>

                      </div>

                      {memberInfo.telephone && (

                        <div className="info-item">

                          <span className="info-label">Téléphone:</span>

                          <span className="info-value">{memberInfo.telephone}</span>

                        </div>

                      )}

                    </div>

                  </div>



                  <div className="reservation-form">

                    {/* Indicateur d'étapes */}

                    <div className="steps-indicator">

                      <div className={`step ${currentStep === 1 ? 'current' : ''} ${currentStep > 1 ? 'active' : ''}`}>

                        <div className="step-number">1</div>

                        <div className="step-label">Détails de réservation</div>

                      </div>

                      <div className="step-connector"></div>

                      <div className={`step ${currentStep === 2 ? 'current' : ''}`}>

                        <div className="step-number">2</div>

                        <div className="step-label">Confirmation</div>

                      </div>

                    </div>



                    {/* Étape 1 : Détails de réservation */}

                    {currentStep === 1 && (

                      <div className="step-content">

                        <h3><FaCalendarAlt /> Étape 1 : Détails de réservation</h3>

                        

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

                        

                        <div className="step-actions single-action">

                          <button className="btn btn-primary" onClick={handleStep2Submit}>

                            Suivant →

                          </button>

                        </div>

                      </div>

                    )}



                    {/* Étape 2 : Confirmation */}

                    {currentStep === 2 && (

                      <div className="step-content">

                        <h3><FaCheckCircle /> Étape 2 : Confirmation</h3>

                        

                        <div className="confirmation-summary">

                          <h4><FaClipboardList /> Récapitulatif de votre réservation</h4>

                          

                          {/* Informations de la salle */}

                          <div className="summary-section">

                            <h5><FaMapMarkerAlt /> Salle réservée</h5>

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

                          

                          {/* Informations du réservant */}

                          <div className="summary-section">

                            <h5>👤 Informations du réservant</h5>

                            <div className="info-row">

                              <span className="info-label">Nom:</span>

                              <span className="info-value">{memberInfo.prenom} {memberInfo.nom}</span>

                            </div>

                            {memberInfo.telephone && (

                              <div className="info-row">

                                <span className="info-label">Téléphone:</span>

                                <span className="info-value">{memberInfo.telephone}</span>

                              </div>

                            )}

                          </div>

                          

                          {/* Détails de réservation */}

                          <div className="summary-section">

                            <h5><FaCalendarAlt /> Détails de réservation</h5>

                            <div className="info-row">

                              <span className="info-label">Date de début:</span>

                              <span className="info-value">{formData.date_debut}</span>

                            </div>

                            <div className="info-row">

                              <span className="info-label">Date de fin:</span>

                              <span className="info-value">{formData.date_fin}</span>

                            </div>

                            <div className="info-row">

                              <span className="info-label">Heure de début:</span>

                              <span className="info-value">{formData.heure_debut}</span>

                            </div>

                            <div className="info-row">

                              <span className="info-label">Heure de fin:</span>

                              <span className="info-value">{formData.heure_fin}</span>

                            </div>

                            <div className="info-row">

                              <span className="info-label">Capacité requise:</span>

                              <span className="info-value">{formData.capacite_requise} personnes</span>

                            </div>

                            {formData.description && (

                              <div className="info-row">

                                <span className="info-label">Description:</span>

                                <span className="info-value">{formData.description}</span>

                              </div>

                            )}

                          </div>

                        </div>

                        

                        <div className="step-actions dual-action">

                          <button className="btn btn-secondary" onClick={prevStep}>

                            ← Précédent

                          </button>

                          <button className="btn btn-success" onClick={handleConfirmReservation}>

                            Confirmer la réservation

                          </button>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        ) : null}

        

        {/* Grille des salles */}

        {!selectedSalle && (

          <>

            <div className="salles-header">

              <h2><FaMapMarkerAlt /> Salles disponibles</h2>

              <div className="search-container">
                <label className="search-label">Rechercher une salle...</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    document.querySelector('.search-container').classList.add('focused');
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      document.querySelector('.search-container').classList.remove('focused');
                    }
                  }}
                  className="search-input"
                />

                <button className="search-btn">

                  <FaSearch />

                </button>

              </div>

            </div>



            <div className="salles-grid">

              {filteredSalles.map((salle, index) => (

                <div

                  key={`${salle.id}-${index}`}

                  className={`salle-card ${salle.disponibilite === 'occupée' ? 'occupied' : ''}`}

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

                    <p className="salle-description">{salle.description}</p>

                    

                    <div className="salle-details">

                      <div className="detail-item">

                        <span className="detail-icon"><FaUsers /></span>

                        <span>{salle.capacite} personnes</span>

                      </div>

                      <div className="detail-item">

                        <span className="detail-icon"><FaMoneyBillWave /></span>

                        <span>{salle.prix}</span>

                      </div>

                    </div>

                    

                    <div className="equipements">

                      <h4>Équipements</h4>

                      <div className="equipements-list">

                        {salle.equipements.map((equip, index) => (

                          <span key={`equip-${index}`} className="equipement-tag">{equip}</span>

                        ))}

                      </div>

                    </div>

                    

                    {/* Bouton Réservez */}

                    <button 

                      className={`btn-reserve ${

                        salle.disponibilite === 'occupée' ? 'disabled' : 

                        !isLoggedIn ? 'disabled' : 

                        'primary'

                      }`}

                      onClick={(e) => {

                                                                        e.stopPropagation(); // Empêcher la propagation pour ne pas déclencher handleSalleClick

                        if (salle.disponibilite !== 'occupée' && isLoggedIn) {

                                                    // Sélectionner la salle et afficher le formulaire

                          setSelectedSalle(salle);

                          setFormData(prev => ({

                            ...prev,

                            salle_id: salle.id,

                            capacite_requise: salle.capacite

                          }));

                        } else {

                                                  }

                      }}

                      disabled={salle.disponibilite === 'occupée' || !isLoggedIn}

                      onMouseEnter={() => setHoveredButton(salle.id)}

                      onMouseLeave={() => setHoveredButton(null)}

                    >

                      {salle.disponibilite === 'occupée' ? 'Occupée' : 

                       !isLoggedIn ? 'Réservez' : 

                       'Réservez'}

                    </button>

                    

                    {/* Message au survol pour non-connectés */}

                    {hoveredButton === salle.id && !isLoggedIn && (

                      <div className="reserve-tooltip">

                        Veuillez vous connecter si vous voulez louer une salle

                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

      {/* Popup de confirmation de réservation */}

      {showConfirmPopup && (

        <div className="confirm-popup-overlay">

          <div className="confirm-popup">

            <h3><FaClipboardList /> Confirmation</h3>

            <p>Voulez-vous confirmer votre location sur : {selectedSalle?.nom} ?</p>

            

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

  );

};



export default LocationSalle;

