import React, { useState, useEffect } from 'react';
import { 
  FaPalette, FaMobileAlt, FaCreditCard, FaMapMarkerAlt, FaCalendarAlt, 
  FaUsers, FaInfoCircle, FaPhone, FaFacebook, FaEnvelope, 
  FaCamera, FaMusic, FaGamepad, FaMoneyBillWave, 
  FaCheckCircle, FaHourglassHalf, FaClipboardList, FaUserTie, FaLink, FaPlane
} from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

import MadagascarMap from "../../component/map/MadagascarMap";

import activiteService from "../../services/activite.service";

import AuthService from "../../services/auth.service";

import "../../styles/pages/Home.css";

import "../../styles/components/couleur/couleur.css";



const Home = () => {

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const [showMap, setShowMap] = useState(false);

  const [activitesOuvertes, setActivitesOuvertes] = useState([]);

  const [activitesPopulaires, setActivitesPopulaires] = useState([]);

  const [activitesPopulairesFiltrees, setActivitesPopulairesFiltrees] = useState([]);

  const [packagesData, setPackagesData] = useState([]);

  const [error, setError] = useState(null);

  const [typesActivites, setTypesActivites] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [submittingId, setSubmittingId] = useState(null);

  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  const [exigencesByType, setExigencesByType] = useState({});

  const [showExigences, setShowExigences] = useState(false);

  const [mediaActivities, setMediaActivities] = useState([]);

  const [registrationCache, setRegistrationCache] = useState({});
  const [participantsCache, setParticipantsCache] = useState({});

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [methodesPaiement, setMethodesPaiement] = useState([]);
  const [showMobileMoneyOptions, setShowMobileMoneyOptions] = useState(false);
  const [selectedMethodePaiement, setSelectedMethodePaiement] = useState('Mobile Money');



  const loadMethodesPaiement = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/methodes-paiement`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const methodesGroup = groupMethodesPaiement(data.data);
          setMethodesPaiement(methodesGroup);
                  }
      }
    } catch (error) {
      console.error('Erreur chargement méthodes de paiement:', error);
      setMethodesPaiement([
        { id: 'mobile_money', nom: 'Mobile Money', displayIcon: <FaMobileAlt />, types: ['MVola', 'Airtel Money', 'Orange Money'] },
        { id: 'espece', nom: 'Espèce', displayIcon: <FaMoneyBillWave /> }
      ]);
    }
  };

  const groupMethodesPaiement = (methodes) => {
    const mobileMoneyMethods = [];
    const otherMethods = [];
    
    methodes.forEach(methode => {
      const lowerNom = methode.nom.toLowerCase();
      if (lowerNom.includes('mvola') || lowerNom.includes('airtel') || lowerNom.includes('orange')) {
        mobileMoneyMethods.push(methode.nom);
      } else {
        otherMethods.push({
          ...methode,
          displayIcon: getIconForMethode(methode.nom)
        });
      }
    });
    
    const result = [];
    if (mobileMoneyMethods.length > 0) {
      result.push({
        id: 'mobile_money',
        nom: 'Mobile Money',
        displayIcon: <FaMobileAlt />,
        types: mobileMoneyMethods
      });
    }
    
    result.push(...otherMethods);
    
    return result;
  };

  const getIconForMethode = (nom) => {
    const lowerNom = nom.toLowerCase();
    
    if (lowerNom.includes('mvola') || lowerNom.includes('airtel') || lowerNom.includes('orange')) return <FaMobileAlt />;
    if (lowerNom.includes('espece')) return <FaMoneyBillWave />;
    if (lowerNom.includes('carte')) return <FaCreditCard />;
    
    return <FaCreditCard />;
  };



  useEffect(() => {

    const user = AuthService.getCurrentUser();

    if (user) {

      setCurrentUser(user);

    }

  }, []);



  const displayName = currentUser ? `${currentUser.prenom_utilisateur || currentUser.prenom} ${currentUser.nom_utilisateur?.charAt(0) || currentUser.nom?.charAt(0) || ''}.` : 'Membre';

  

  const userAvatar = currentUser ? currentUser.avatar : null;

  const userEmail = currentUser ? currentUser.email : null;



  const spiritualImages = {
    vision: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=40&fit=crop&auto=format",
    prayer: "https://images.unsplash.com/photo-1596424986036-55096d083be1?w=60&h=40&fit=crop&auto=format",
    bible: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=40&fit=crop&auto=format",
    cross: "https://images.unsplash.com/photo-1544620334-9fc037e0935b?w=60&h=40&fit=crop&auto=format",
    church: "https://images.unsplash.com/photo-1515940326542-7736d91b918c?w=60&h=40&fit=crop&auto=format",
    nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=60&h=40&fit=crop&auto=format",
    community: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&h=40&fit=crop&auto=format",
    meditation: "https://images.unsplash.com/photo-1588266835491-1b1b5e05c2c7?w=60&h=40&fit=crop&auto=format",
    sunset: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=60&h=40&fit=crop&auto=format",
    light: "https://images.unsplash.com/photo-1579532585360-1e8b0b3d4a0e?w=60&h=40&fit=crop&auto=format",
    peace: "https://images.unsplash.com/photo-1540206395-6880857c32f6?w=60&h=40&fit=crop&auto=format",
    worship: "https://images.unsplash.com/photo-1494232410401-ad00d543542e?w=60&h=40&fit=crop&auto=format",
    dove: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=60&h=40&fit=crop&auto=format",
    candles: "https://images.unsplash.com/photo-1549286088-27ee7c637a6a?w=60&h=40&fit=crop&auto=format",
    mountains: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=40&fit=crop&auto=format",
    water: "https://images.unsplash.com/photo-1540206395-6880857c32f6?w=60&h=40&fit=crop&auto=format",
    sky: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=40&fit=crop&auto=format",
    garden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60&h=40&fit=crop&auto=format",
    stainedGlass: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&h=40&fit=crop&auto=format",
    sunrise: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=60&h=40&fit=crop&auto=format"
  };

  const improvedImageBase64 = spiritualImages.vision;



  const checkIfAlreadyRegistered = async (activiteId) => {
    if (registrationCache[activiteId] !== undefined) {
      return registrationCache[activiteId];
    }

    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    const member = localStorage.getItem('member') || sessionStorage.getItem('member');
    
    if (!auth || auth !== 'true' || !member) {
      return false;
    }
    
    try {
      const memberData = JSON.parse(member);
      const utilisateurId = memberData.id;
      
      if (!utilisateurId) {
        return false;
      }
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/public/inscriptions/verifier/${activiteId}/${utilisateurId}`);
      
      if (response.ok) {
        const data = await response.json();
        setRegistrationCache(prev => ({ ...prev, [activiteId]: data.isRegistered }));
        return data.isRegistered;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur vérification inscription:', error);
      return false;
    }
  };



  const countParticipants = async (activiteId) => {
    if (participantsCache[activiteId] !== undefined) {
      return participantsCache[activiteId];
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/public/inscription_activite/${activiteId}/count`);

      if (response.ok) {
        const data = await response.json();
        const count = data.success ? data.data : 0;
        
        setParticipantsCache(prev => ({ ...prev, [activiteId]: count }));
        
                return count;
      }
      
      console.warn('Endpoint count non disponible - 0 participant pour', activiteId);
      setParticipantsCache(prev => ({ ...prev, [activiteId]: 0 }));
      return 0;
      
    } catch (error) {
      console.error('Erreur comptage participants dans inscription_activite pour', activiteId, ':', error);
      setParticipantsCache(prev => ({ ...prev, [activiteId]: 0 }));
      return 0;
    }
  };



  const loadActivites = async () => {
    try {
      
      const [activitesOuvertes, activitesPopulaires, typesResponse, mediaResponse] = await Promise.all([
        activiteService.getActivitesOuvertes(),
        activiteService.getActivitesPopulaires(),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/public/types-activites`),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/admin/ressources/activites-media-only`)
      ]);
      
      let typesData = [];
      if (typesResponse.ok) {
        typesData = await typesResponse.json();
        setTypesActivites(typesData);
              } else {
        console.error('Erreur chargement types:', typesResponse.status, typesResponse.statusText);
      }
      
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        const mediaActivitiesWithStatus = await Promise.all(
          mediaData.map(async (activite) => {
            const [isRegistered, participantsCount] = await Promise.all([
              checkIfAlreadyRegistered(activite.id_activite),
              countParticipants(activite.id_activite)
            ]);
            
            return {
              ...activite,
              isRegistered,
              nombre_participants: participantsCount
            };
          })
        );
        
        setMediaActivities(mediaActivitiesWithStatus);
      } else {
        console.error('Erreur chargement activités M.E.DI.A:', mediaResponse.status, mediaResponse.statusText);
        setMediaActivities([]);
      }
      
      const limitedOuvertes = activitesOuvertes.slice(0, 8);
      const limitedPopulaires = activitesPopulaires.slice(0, 6);
      
      const activitesOuvertesWithStatus = await Promise.all(
        limitedOuvertes.map(async (activite) => {
          const [isRegistered, participantsCount] = await Promise.all([
            checkIfAlreadyRegistered(activite.id_activite),
            countParticipants(activite.id_activite)
          ]);
          
          return {
            ...activite,
            isRegistered,
            nombre_participants: participantsCount
          };
        })
      );
      
      const activitesPopulairesWithStatus = await Promise.all(
        limitedPopulaires.map(async (activite) => {
          const [isRegistered, participantsCount] = await Promise.all([
            checkIfAlreadyRegistered(activite.id_activite),
            countParticipants(activite.id_activite)
          ]);
          
          return {
            ...activite,
            isRegistered,
            nombre_participants: participantsCount
          };
        })
      );
      
      setActivitesOuvertes(activitesOuvertesWithStatus);
      setActivitesPopulaires(activitesPopulairesWithStatus);
      
    } catch (err) {
      setError(err.message);
    }
  };



  useEffect(() => {

    loadActivites();
    loadMethodesPaiement();

  }, []);



  useEffect(() => {

    setActivitesPopulairesFiltrees(activitesPopulaires);

  }, [activitesPopulaires]);



  const destinations = [
    { id: 1, name: "Centre de Prière", image: spiritualImages.prayer },
    { id: 2, name: "Église Locale", image: spiritualImages.church },
    { id: 3, name: "Méditation Spirituelle", image: spiritualImages.meditation },
    { id: 4, name: "Communauté Foi", image: spiritualImages.community }
  ];

  const mediaFallbackImage = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&h=520&fit=crop&auto=format";
  const normalizeSearchText = (value) =>
    (value || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalizedQuery = normalizeSearchText(searchQuery.trim());

  const matchesSearch = (activite) => {
    if (!normalizedQuery) return true;

    const searchableFields = [
      activite?.titre_activite,
      activite?.description,
      activite?.lieu_activite,
      activite?.prix,
      activite?.devise,
      activite?.prix_formate
    ];

    return searchableFields.some((field) =>
      normalizeSearchText(field).includes(normalizedQuery)
    );
  };

  const mediaActivitiesFiltered = mediaActivities.filter(matchesSearch);
  const activitesPopulairesSearchFiltered = activitesPopulairesFiltrees.filter(matchesSearch);

  const packagesFiltered = activitesPopulairesSearchFiltered.slice(0, 4).map((activite) => ({
    id: activite.id_activite,
    name: activite.titre_activite,
    price: activite.capacite ? `${activite.nombre_participants || 0}/${activite.capacite} places` : "Illimité",
    rating: "★★★★★",
    reviews: activite.nombre_participants || 0,
    discount: "Disponible",
    image: activite.image_url || improvedImageBase64,
    date: activite.date_heure_activite,
    lieu: activite.lieu_activite,
    isBase64: true,
    isRegistered: activite.isRegistered || false
  }));


  const infoGuide = [

    { icon: <FaMoneyBillWave />, title: "Inscription Gratuite" },

    { icon: <FaPlane />, title: "Activités Variées" },

    { icon: <FaCalendarAlt />, title: "Événements Réguliers" },

    { icon: <FaInfoCircle />, title: "Assistance Permanente" },

    { icon: <FaMobileAlt />, title: "Contact Facile" }

  ];

  const heroHighlights = [

    { icon: <FaPalette />, label: "Formations M.E.DI.A" },

    { icon: <FaCheckCircle />, label: "Activités ouvertes" },

    { icon: <FaCalendarAlt />, label: "Inscription rapide" }

  ];



  const handleActiviteClick = (activiteId) => {

    navigate(`/activite/${activiteId}`);

  };



  const handleParticiper = async (activiteId) => {

    let activite = mediaActivities.find(a => a.id_activite === activiteId);
    if (!activite) {
      activite = activitesOuvertes.find(a => a.id_activite === activiteId);
    }

    if (activite && activite.est_payante === true) {
            
      const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      if (auth) {
        try {
          const authData = JSON.parse(auth);
                              
          let utilisateurConnecte = null;
          if (authData.utilisateur) {
            utilisateurConnecte = authData.utilisateur;
          } else if (authData.user) {
            utilisateurConnecte = authData.user;
          } else if (authData.data && authData.data.user) {
            utilisateurConnecte = authData.data.user;
          }
          
          if (utilisateurConnecte) {
                                    
            if (!utilisateurConnecte.id_utilisateur) {
              for (const key in utilisateurConnecte) {
                if (typeof utilisateurConnecte[key] === 'string' && utilisateurConnecte[key].includes('usr-')) {
                                    break;
                }
              }
            }
          }
        } catch (error) {
          console.error('Erreur parsing auth à l\'ouverture:', error);
        }
      }

      setShowPaymentPopup(true);
      setSelectedActivite(activite);
      return;
    }



    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');

    const member = localStorage.getItem('member') || sessionStorage.getItem('member');

    const userIsLoggedIn = auth === 'true' && member;

    

    if (!userIsLoggedIn) {

      navigate('/login');

      return;

    }



    setSubmittingId(activiteId);

    try {

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const member = localStorage.getItem('member') || sessionStorage.getItem('member');

      const memberData = member ? JSON.parse(member) : null;

      

      
        
      

      if (!memberData || !memberData.id) {

        console.error('Données utilisateur invalides:', memberData);

        alert('Erreur: données utilisateur invalides. Veuillez vous reconnecter.');

        setSubmittingId(null);

        return;

      }

      

      let utilisateurId = memberData.id;

      

      if (!utilisateurId && memberData) {

        if (memberData.member?.id) {

          utilisateurId = memberData.member.id;

        } else if (memberData.id_utilisateur) {

          utilisateurId = memberData.id_utilisateur;

        } else if (memberData.email) {

          const emailMatch = memberData.email.match(/USR-(\d+)/);

          if (emailMatch) {

            utilisateurId = 'USR-' + emailMatch[1];

          }

        }

      }

      

      if (!utilisateurId) {

        console.error('ID utilisateur non trouvé dans:', memberData);

        alert('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.');

        setSubmittingId(null);

        return;

      }

      const inscriptionData = {
        activiteId,
        utilisateurId,
        memberData,
        'utilisateur final': utilisateurId,
      };

      

      const response = await fetch(`${apiUrl}/public/inscriptions/${activiteId}`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

          'Accept': 'application/json'

        },

        body: JSON.stringify({

          id_utilisateur: utilisateurId

        })

      });



      const data = await response.json();



      if (!response.ok) {

        console.error('Erreur API:', data);

        throw new Error(data.message || 'Erreur lors de l\'inscription');

      }



      alert('Inscription réussie ! Vous êtes maintenant inscrit à cette activité.');

      

      setActivitesOuvertes(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: true, nombre_participants: (activite.nombre_participants || 0) + 1 }

            : activite

        )

      );

      

      setActivitesPopulaires(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: true, nombre_participants: (activite.nombre_participants || 0) + 1 }

            : activite

        )

      );

      

      loadActivites();

      

    } catch (err) {

      console.error('Erreur inscription:', err);

      alert('Erreur lors de l\'inscription: ' + err.message);

    } finally {

      setSubmittingId(null);

    }

  };



  const handleDesinscrire = async (activiteId) => {

    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');

    const member = localStorage.getItem('member') || sessionStorage.getItem('member');

    const userIsLoggedIn = auth === 'true' && member;

    

    if (!userIsLoggedIn) {

      navigate('/login');

      return;

    }



    setSubmittingId(activiteId);

    try {

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const member = localStorage.getItem('member') || sessionStorage.getItem('member');

      const memberData = member ? JSON.parse(member) : null;

      

      let utilisateurId = memberData.id;

      if (!utilisateurId && memberData) {

        if (memberData.member?.id) {

          utilisateurId = memberData.member.id;

        } else if (memberData.id_utilisateur) {

          utilisateurId = memberData.id_utilisateur;

        } else if (memberData.email) {

          const emailMatch = memberData.email.match(/USR-(\d+)/);

          if (emailMatch) {

            utilisateurId = 'USR-' + emailMatch[1];

          }

        }

      }

      

      const response = await fetch(`${apiUrl}/public/inscriptions/${activiteId}/desinscrire`, {

        method: 'DELETE',

        headers: {

          'Content-Type': 'application/json',

          'Accept': 'application/json'

        },

        body: JSON.stringify({

          participant_id: utilisateurId

        })

      });



      const data = await response.json();



      if (!response.ok) {

        throw new Error(data.message || 'Erreur lors de la désinscription');

      }



      alert('Désinscription réussie ! Vous n\'êtes plus inscrit à cette activité.');

      

      setActivitesOuvertes(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: false, nombre_participants: Math.max((activite.nombre_participants || 0) - 1, 0) }

            : activite

        )

      );

      

      setActivitesPopulaires(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: false, nombre_participants: Math.max((activite.nombre_participants || 0) - 1, 0) }

            : activite

        )

      );

      

      loadActivites();

      

    } catch (err) {

      console.error('Erreur désinscription:', err);

      alert('Erreur lors de la désinscription: ' + err.message);

    } finally {

      setSubmittingId(null);

    }

  };



  const handleSeeOnMap = (activity) => {

  };



  const handleProfileClick = () => {

    navigate("/profile");

  };



  const handleSeeAllActivites = () => {

    navigate('/activites');

  };



  const handleActivityFilterChange = (e) => {

    const filterValue = e.target.value;

    setSelectedTypeFilter(filterValue);

    
    

    if (filterValue === 'all') {

      setActivitesPopulairesFiltrees(activitesPopulaires);

    } else {

      const filtrees = activitesPopulaires.filter(activite => 

        activite.id_type === filterValue

      );

      setActivitesPopulairesFiltrees(filtrees);

    }

  };



  const loadExigencesForType = async (idType) => {

    try {

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/public/exigences/type/${idType}`);

      

      if (response.ok) {

        const exigences = await response.json();

        setExigencesByType(prev => ({

          ...prev,

          [idType]: exigences

        }));

        
      } else {

        console.error('Erreur chargement exigences:', response.status);

      }

    } catch (error) {

      console.error('Erreur lors du chargement des exigences:', error);

    }

  }
  
  const handleTypeClick = (typeId) => {
    setShowExigences(prev => !prev);
  };


  const handleMethodeClick = (methode) => {
        
    if (methode.id === 'mobile_money') {
      setTimeout(() => setShowMobileMoneyOptions(true), 100);
    } else {
      setSelectedMethodePaiement(methode.nom);
      
      setShowMobileMoneyOptions(false);
      
      const allBtns = document.querySelectorAll('.payment-method-btn');
      allBtns.forEach(btn => {
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.border = '2px solid #e2e8f0';
        const methodeName = btn.querySelector('span:last-child')?.textContent || '';
        const methodeIcon = btn.querySelector('span:first-child')?.textContent || 'Carte';
        btn.innerHTML = `<span>${methodeIcon}</span><span>${methodeName}</span>`;
      });
      
      const selectedBtn = document.querySelector(`.payment-method-btn[key="${methode.id}"]`);
      if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(135deg, var(--cyan-clair) 0%, var(--cyan-fonce) 100%)';
        selectedBtn.style.color = 'var(--blanc)';
        selectedBtn.style.borderColor = 'var(--cyan-fonce)';
        selectedBtn.innerHTML = `<span>${methode.displayIcon || 'Carte'}</span><span>${methode.nom} ✓</span>`;
        
      }
    }
  };

  const handleMobileMoneyChoice = (operator) => {
        
    setSelectedMethodePaiement(operator);
    
    const allOperatorBtns = document.querySelectorAll('.mobile-money-operator-btn');
    allOperatorBtns.forEach(btn => {
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.border = '2px solid #0ea5e9';
      const operatorName = btn.querySelector('span:last-child')?.textContent || '';
      btn.innerHTML = `<span><FaMobileAlt /></span><span>${operatorName}</span>`;
    });
    
    const selectedBtn = document.querySelector(`.mobile-money-operator-btn:nth-child(${methodesPaiement.find(m => m.id === 'mobile_money')?.types?.indexOf(operator) + 1})`);
    if (selectedBtn) {
      selectedBtn.style.background = 'linear-gradient(135deg, var(--secondary) 0%, var(--text) 100%)';
      selectedBtn.style.color = 'var(--blanc)';
      selectedBtn.style.borderColor = 'var(--text)';
      selectedBtn.innerHTML = `<span>MM</span><span>${operator} ✓</span>`;
    }
    
  };

  const handlePayment = async (activite, methodePaiement = 'Mobile Money') => {
    try {
            
      const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      const member = localStorage.getItem('member') || sessionStorage.getItem('member');
      
      let utilisateurConnecte = null;
      let idUtilisateurTrouve = null;
      
      let dataSource = null;
      if (member) {
        dataSource = member;
      }
      
      if (dataSource) {
        try {
          const userData = JSON.parse(dataSource);
          
          utilisateurConnecte = userData;
          
          if (utilisateurConnecte.id_utilisateur) {
            idUtilisateurTrouve = utilisateurConnecte.id_utilisateur;
          } else if (utilisateurConnecte.id) {
            idUtilisateurTrouve = utilisateurConnecte.id;
          } else {
            const possibleIds = ['user_id', 'userId', 'id_user'];
            for (const prop of possibleIds) {
              if (utilisateurConnecte[prop]) {
                idUtilisateurTrouve = utilisateurConnecte[prop];
                break;
              }
            }
            
            if (!idUtilisateurTrouve) {
              for (const key in utilisateurConnecte) {
                if (utilisateurConnecte[key] && typeof utilisateurConnecte[key] === 'string' && (utilisateurConnecte[key].includes('usr-') || utilisateurConnecte[key].includes('USR-'))) {
                  idUtilisateurTrouve = utilisateurConnecte[key];
                  break;
                }
              }
            }
          }
          
          if (idUtilisateurTrouve) {
            utilisateurConnecte.id_utilisateur = idUtilisateurTrouve;
          }
        } catch (error) {
          console.error('Erreur parsing des données utilisateur:', error);
        }
      } else {
        console.error('Aucune donnée utilisateur trouvée dans localStorage ou sessionStorage');
      }

      if (!utilisateurConnecte || !utilisateurConnecte.id_utilisateur) {
        console.error('ID utilisateur non trouvé');
        alert('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.');
        return;
      }

      if (!utilisateurConnecte.id_utilisateur && !utilisateurConnecte.id) {
        console.error('Aucun ID trouvé dans id_utilisateur ni id');
      }
      
      if (!utilisateurConnecte.id_utilisateur) {
        alert('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.');
        return;
      }
      
      const paiementData = {
        id_utilisateur: utilisateurConnecte.id_utilisateur,
        id_activite: activite.id_activite,
        montant: activite.prix || activite.montant_a_payer || 0,
        description: `Paiement formation: ${activite.titre_activite}`,
        methode_paiement: methodePaiement,
        reference_paiement: `REF-${Date.now()}`
      };

      const paiementResponse = await fetch(`${process.env.REACT_APP_API_URL}/public/formation/paiement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${utilisateurConnecte.token || ''}`
        },
        body: JSON.stringify(paiementData)
      });

      const paiementResult = await paiementResponse.json();
      if (!paiementResult.success) {
        console.error('Erreur lors du paiement:', paiementResult.message);
        alert(`Erreur: ${paiementResult.message}`);
        return;
      }

      alert(`Paiement de ${paiementData.montant} ${activite.devise || 'MGA'} et inscription réussis !`);
      
      setShowPaymentPopup(false);
      setShowMobileMoneyOptions(false);
      setSelectedActivite(null);
      

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Erreur: Une erreur est survenue lors du paiement');
    }
  };


  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1>Activités et formations pour les membres</h1>
          <p>
            Retrouvez ici les activités disponibles, les formations ouvertes et
            les informations utiles pour participer simplement.
          </p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Rechercher une activité ou une formation"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Explorer</button>
          </div>

          {/* Catégories */}
          <div className="hero-categories">
            {heroHighlights.map((item, idx) => (
              <div key={idx} className="hero-highlight-chip">
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formation M.E.DI.A Section */}
      <section className="packages-section">
        <div className="section-header">
          <div className="section-title-block">
            <h2 className="section-title-centered"><FaPalette /> Formation M.E.DI.A</h2>
            <span className="section-subtitle section-subtitle-plain">Les formations disponibles pour apprendre et progresser</span>
          </div>
          <div className="header-actions">
            <button className="see-all header-map-btn" onClick={() => navigate('/map')}>
              Carte
            </button>
            <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); }}>Voir tout</a>
          </div>
        </div>

        <div className="media-activities-grid">
          {mediaActivitiesFiltered.length > 0 ? (
            mediaActivitiesFiltered.map((activite) => (
              <div key={activite.id_activite} className="media-activity-card" onClick={() => handleActiviteClick(activite.id_activite)}>
                <div className="media-activity-image">
                 
                    <img src={`../../assets/images/activite/${activite.nom_image}`} alt="Formation M.E.DI.A" className="media-activity-img media-activity-img-fallback" />
                
                </div>
                <div className="media-activity-content">
                  <h3 className="media-activity-title">{activite.titre_activite}</h3>
                  <div className='description'>{activite.description}</div>
                  <div className="media-activity-price-section">
                    <p className="media-activity-price"><FaMoneyBillWave /> {activite.prix ? `${activite.prix} ${activite.devise || 'MGA'}` : 'Gratuit'}</p>
                    {activite.est_payante && (
                      <span className="media-price-badge">Payant</span>
                    )}
                  </div>
                  <p className="media-activity-location"><FaMapMarkerAlt /> {activite.lieu_activite}</p>
                  <div className="media-activity-actions">
                  
                    
                    <div className="media-secondary-buttons">
                        <button 
                      className={`media-secondary-btn ${activite.isRegistered ? 'registered' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activite.isRegistered) {
                          handleDesinscrire(activite.id_activite);
                        } else {
                          handleParticiper(activite.id_activite);
                        }
                      }}
                      disabled={submittingId === activite.id_activite}
                    >
                      {submittingId === activite.id_activite ? 'Chargement...' : (activite.isRegistered ? 'Inscrit' : 'Participer')}
                    </button>
                      <button 
                        className="media-secondary-btn" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleActiviteClick(activite.id_activite); }}
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-activities">
              <p>
                {searchQuery.trim()
                  ? `Aucune activité M.E.DI.A trouvée pour "${searchQuery.trim()}".`
                  : "Aucune activité M.E.DI.A disponible pour le moment."}
              </p>
            </div>
          )}
        </div>
      </section>



      {/* Packages Section - Activités Populaires */}

      <section className="packages-section">

        <div className="section-header">

          <h2 className="section-title-centered">Activités Populaires</h2>

          <div className="header-actions">

            <select 

              className="activity-filter" 

              value={selectedTypeFilter}

              onChange={handleActivityFilterChange}
              style={{background:'white', color:'black'}}

            >

              <option value="all">Tous les types</option>

              {typesActivites.map(type => (

                <option key={type.id} value={type.id}>

                  {type.libelle_type}

                </option>

              ))}

            </select>

            {selectedTypeFilter !== 'all' && (

              <button 

                className="exigences-btn"

                onClick={() => handleTypeClick(selectedTypeFilter)}

              >

                Voir les exigences

              </button>

            )}

            <button className="see-all header-map-btn" onClick={() => navigate('/map')}>
              Carte
            </button>
            <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); handleSeeAllActivites(); }}>Voir tout</a>

          </div>

        </div>



        <div className="media-activities-grid">

          {packagesFiltered.length > 0 ? (

            packagesFiltered.map(pkg => (

              <div key={pkg.id} className="media-activity-card" onClick={() => handleActiviteClick(pkg.id)}>
                <div className="media-activity-image">
                  {pkg.image ? (
                    pkg.isBase64 ? (
                      <img src={pkg.image} alt={pkg.name} className="media-activity-img" />
                    ) : (
                      <img src={activiteService.getImageUrl(pkg.image)} alt={pkg.name} className="media-activity-img" />
                    )
                  ) : (
                    <img src={mediaFallbackImage} alt={pkg.name} className="media-activity-img media-activity-img-fallback" />
                  )}
                </div>
                <div className="media-activity-content">
                  <h3 className="media-activity-title">{pkg.name}</h3>
                  <div className="media-activity-price-section">
                    <p className="media-activity-price"><FaMoneyBillWave /> {pkg.price}</p>
                    <span className="media-price-badge">Populaire</span>
                  </div>
                  <p className="media-activity-location"><FaMapMarkerAlt /> {pkg.lieu}</p>
                  <div className="media-activity-actions">
                    
                    
                    <div className="media-secondary-buttons">
                      <button 
                        className="media-secondary-btn" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleActiviteClick(pkg.id); }}
                      >
                        Détails
                      </button>
                      <button 
                      className={`media-secondary-btn ${pkg.isRegistered ? 'registered' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pkg.isRegistered) {
                          handleDesinscrire(pkg.id);
                        } else {
                          handleParticiper(pkg.id);
                        }
                      }}
                      disabled={submittingId === pkg.id}
                    >
                      {submittingId === pkg.id ? 'Chargement...' : (pkg.isRegistered ? 'Inscrit' : 'Participerrr')}
                    </button>
                    </div>
                  </div>
                </div>
              </div>

            ))

          ) : (

            <div className="no-activities">

              <p>
                {searchQuery.trim()
                  ? `Aucune activité populaire trouvée pour "${searchQuery.trim()}".`
                  : "Aucune activité populaire disponible pour le moment."}
              </p>

            </div>

          )}

        </div>

      </section>



      {/* Section Exigences par Type d'Activité */}

      {showExigences && selectedTypeFilter !== 'all' && (

        <section className="exigences-section">

          <div className="exigences-header">

            <h3>Exigences pour {typesActivites.find(t => t.id === selectedTypeFilter)?.libelle_type}</h3>

            <button className="close-btn" onClick={() => setShowExigences(false)}>×</button>

          </div>

          

          {exigencesByType[selectedTypeFilter] ? (

            <div className="exigences-list">

              {exigencesByType[selectedTypeFilter].length > 0 ? (

                exigencesByType[selectedTypeFilter].map(exigence => (

                  <div key={exigence.id_exigence} className="exigence-item">

                    <div className="exigence-type">

                      <span className={`type-badge ${exigence.type_exigence}`}>

                        {exigence.type_exigence}

                      </span>

                      <span className={`status-badge ${exigence.obligatoire ? 'obligatoire' : 'optionnel'}`}>

                        {exigence.obligatoire ? 'Obligatoire' : 'Optionnel'}

                      </span>

                    </div>

                    <div className="exigence-content">

                      <h4>{exigence.libelle_exigence}</h4>

                    </div>

                  </div>

                ))

              ) : (

                <p className="no-exigences">Aucune exigence spécifique pour ce type d'activité.</p>

              )}

            </div>

          ) : (

            <div className="loading-exigences">

              <div className="loading-spinner">Chargement des exigences...</div>

            </div>

          )}

        </section>

      )}



      {/* Information & Guide Section */}

      <section className="info-guide-section">

        <h2>Informations pratiques</h2>

        <div className="info-grid">

          {infoGuide.map((item, idx) => (

            <div key={idx} className="info-card">

              <div className="info-icon">{item.icon}</div>

              <p>{item.title}</p>

            </div>

          ))}

        </div>

      </section>



      {/* Map Section with Search Results */}

      {/* Moved to MapSearch page */}

      {/* Popup de paiement pour les formations */}
      {showPaymentPopup && selectedActivite && (
        <div className="payment-popup-overlay">
          <div className="payment-popup">
            <div className="payment-popup-header">
              <h3><FaCreditCard /> Paiement requis</h3>
              <button 
                className="close-popup-btn" 
                onClick={() => {
                  setShowPaymentPopup(false);
                  setSelectedActivite(null);
                  setShowMobileMoneyOptions(false);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="payment-popup-content">
              <div className="formation-info">
                <h4>{selectedActivite.titre_activite}</h4>
                <p className="formation-description">{selectedActivite.description}</p>
              </div>
              
              <div className="price-info">
                <div className="price-row">
                  <span>Prix de la formation:</span>
                  <span className="price-amount">
                    {selectedActivite.prix ? `${selectedActivite.prix} ${selectedActivite.devise || 'MGA'}` : selectedActivite.prix_formate || `${selectedActivite.montant_a_payer || 0} ${selectedActivite.devise || 'MGA'}`}
                  </span>
                </div>
                {selectedActivite.description_prix && (
                  <p className="price-description">{selectedActivite.description_prix}</p>
                )}
              </div>
              
              {/* Méthodes de paiement en haut */}
              <div className="payment-methods">
                <h4>Méthodes de paiement disponibles:</h4>
                <div className="payment-options">
                  {methodesPaiement.map((methode) => (
                    <button 
                      key={methode.id} 
                      className="payment-method-btn"
                      onClick={() => handleMethodeClick(methode)}
                    >
                      <span>{methode.displayIcon || <FaCreditCard />}</span>
                      <span>{methode.nom}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Options Mobile Money détaillées */}
              {showMobileMoneyOptions && (
                <div className="mobile-money-options">

                  <h5>Sélectionnez votre opérateur Mobile Money</h5>
                  <div className="mobile-money-operators">
                    {methodesPaiement.find(m => m.id === 'mobile_money')?.types?.map((operator, index) => (
                      <button 
                        key={index}
                        className="mobile-money-operator-btn"
                        onClick={() => handleMobileMoneyChoice(operator)}
                      >
                        <span><FaMobileAlt /></span>
                        <span>{operator}</span>
                      </button>
                    ))}
                    <button 
                      className="mobile-money-back-btn"
                      onClick={() => setShowMobileMoneyOptions(false)}
                    >
                      <span></span>
                      <span>Retour aux méthodes de paiement</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="payment-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowPaymentPopup(false);
                    setSelectedActivite(null);
                    setShowMobileMoneyOptions(false);
                  }}
                >
                  Annuler
                </button>
                <button 
                  className="pay-btn"
                  onClick={() => handlePayment(selectedActivite, selectedMethodePaiement)}
                >
                  Payer maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

  );

}

export default Home;


