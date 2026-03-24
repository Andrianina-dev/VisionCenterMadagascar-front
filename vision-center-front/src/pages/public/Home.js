import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import MadagascarMap from "../../component/map/MadagascarMap";

import activiteService from "../../services/activite.service";

import AuthService from "../../services/auth.service";

import NavigationMembre from "../../components/NavigationMembre";



const Home = () => {

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const [showMap, setShowMap] = useState(false);

  const [activitesOuvertes, setActivitesOuvertes] = useState([]);

  const [activitesPopulaires, setActivitesPopulaires] = useState([]);

  const [activitesPopulairesFiltrees, setActivitesPopulairesFiltrees] = useState([]);

  const [packagesData, setPackagesData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [typesActivites, setTypesActivites] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [submittingId, setSubmittingId] = useState(null);

  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  const [exigencesByType, setExigencesByType] = useState({});

  const [showExigences, setShowExigences] = useState(false);

  // Cache pour éviter les appels répétés
  const [registrationCache, setRegistrationCache] = useState({});
  const [participantsCache, setParticipantsCache] = useState({});

  // États pour le popup de paiement
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [methodesPaiement, setMethodesPaiement] = useState([]);
  const [showMobileMoneyOptions, setShowMobileMoneyOptions] = useState(false);
  const [selectedMethodePaiement, setSelectedMethodePaiement] = useState('Mobile Money'); // 🆕 État pour la méthode sélectionnée



  // Charger les méthodes de paiement depuis l'API
  const loadMethodesPaiement = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/methodes-paiement`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Regrouper les méthodes mobile money
          const methodesGroup = groupMethodesPaiement(data.data);
          setMethodesPaiement(methodesGroup);
          console.log('Méthodes de paiement groupées:', methodesGroup);
        }
      }
    } catch (error) {
      console.error('Erreur chargement méthodes de paiement:', error);
      // En cas d'erreur, utiliser des méthodes par défaut
      setMethodesPaiement([
        { id: 'mobile_money', nom: 'Mobile Money', displayIcon: '📱', types: ['MVola', 'Airtel Money', 'Orange Money'] },
        { id: 'espece', nom: 'Espèce', displayIcon: '�' }
      ]);
    }
  };

  // Regrouper les méthodes de paiement (mobile money groupé)
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
    
    // Créer le groupe Mobile Money s'il y a des méthodes
    const result = [];
    if (mobileMoneyMethods.length > 0) {
      result.push({
        id: 'mobile_money',
        nom: 'Mobile Money',
        displayIcon: '�',
        types: mobileMoneyMethods
      });
    }
    
    // Ajouter les autres méthodes
    result.push(...otherMethods);
    
    return result;
  };

  // Fonction pour mapper les noms vers des emojis
  const getIconForMethode = (nom) => {
    const lowerNom = nom.toLowerCase();
    
    // Mobile money pour MVola, Airtel Money, Orange Money
    if (lowerNom.includes('mvola') || lowerNom.includes('airtel') || lowerNom.includes('orange')) return '📱';
    // Espèce
    if (lowerNom.includes('espece')) return '💵';
    // Carte bancaire
    if (lowerNom.includes('carte')) return '💳';
    
    // Icône par défaut
    return '💳';
  };



  // Récupérer les informations de l'utilisateur connecté

  useEffect(() => {

    const member = AuthService.getCurrentMember();

    if (member) {

      setCurrentUser(member);

    }

  }, []);



  // Créer le nom d'affichage

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom.charAt(0)}.` : 'Membre';

  

  // Créer les variables pour l'avatar et l'email

  const userAvatar = currentUser ? currentUser.avatar : null;

  const userEmail = currentUser ? currentUser.email : null;



  // Images spirituelles et religieuses variées en ligne pour le projet
  const spiritualImages = {
    vision: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=40&fit=crop&auto=format", // Lumière spirituelle
    prayer: "https://images.unsplash.com/photo-1596424986036-55096d083be1?w=60&h=40&fit=crop&auto=format", // Prière
    bible: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=40&fit=crop&auto=format", // Bible ouverte
    cross: "https://images.unsplash.com/photo-1544620334-9fc037e0935b?w=60&h=40&fit=crop&auto=format", // Croix lumineuse
    church: "https://images.unsplash.com/photo-1515940326542-7736d91b918c?w=60&h=40&fit=crop&auto=format", // Église
    nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=60&h=40&fit=crop&auto=format", // Forêt spirituelle
    community: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&h=40&fit=crop&auto=format", // Communauté
    meditation: "https://images.unsplash.com/photo-1588266835491-1b1b5e05c2c7?w=60&h=40&fit=crop&auto=format", // Méditation profonde
    sunset: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=60&h=40&fit=crop&auto=format", // Coucher de soleil spirituel
    light: "https://images.unsplash.com/photo-1579532585360-1e8b0b3d4a0e?w=60&h=40&fit=crop&auto=format", // Lumière divine
    peace: "https://images.unsplash.com/photo-1540206395-6880857c32f6?w=60&h=40&fit=crop&auto=format", // Paix spirituelle
    worship: "https://images.unsplash.com/photo-1494232410401-ad00d543542e?w=60&h=40&fit=crop&auto=format", // Adoration
    dove: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=60&h=40&fit=crop&auto=format", // Colombe de la paix
    candles: "https://images.unsplash.com/photo-1549286088-27ee7c637a6a?w=60&h=40&fit=crop&auto=format", // Bougies de prière
    mountains: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=40&fit=crop&auto=format", // Montagnes sacrées
    water: "https://images.unsplash.com/photo-1540206395-6880857c32f6?w=60&h=40&fit=crop&auto=format", // Eau bénite
    sky: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=40&fit=crop&auto=format", // Ciel divin
    garden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60&h=40&fit=crop&auto=format", // Jardin de prière
    stainedGlass: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=60&h=40&fit=crop&auto=format", // Vitraux
    sunrise: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=60&h=40&fit=crop&auto=format" // Lever de soleil spirituel
  };

  // Image améliorée pour Centre de Vision (spirituelle)
  const improvedImageBase64 = spiritualImages.vision;



  // Vérifier si l'utilisateur est déjà inscrit à une activité (avec cache)
  const checkIfAlreadyRegistered = async (activiteId) => {
    // Vérifier le cache d'abord
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
        // Mettre en cache le résultat
        setRegistrationCache(prev => ({ ...prev, [activiteId]: data.isRegistered }));
        return data.isRegistered;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur vérification inscription:', error);
      return false;
    }
  };



  // Compter le nombre de participants pour une activité (avec cache)
  const countParticipants = async (activiteId) => {
    // Vérifier le cache d'abord
    if (participantsCache[activiteId] !== undefined) {
      return participantsCache[activiteId];
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      
      // Utiliser le nouvel endpoint qui compte directement dans la table inscription_activite
      const response = await fetch(`${apiUrl}/public/inscription_activite/${activiteId}/count`);

      if (response.ok) {
        const data = await response.json();
        const count = data.success ? data.data : 0;
        
        // Mettre en cache le résultat
        setParticipantsCache(prev => ({ ...prev, [activiteId]: count }));
        
        console.log(`🎯 Activité ${activiteId} - ${count} participant(s) trouvé(s) dans inscription_activite`);
        return count;
      }
      
      // Si l'endpoint n'existe pas, retourner 0
      console.warn('⚠️ Endpoint count non disponible - 0 participant pour', activiteId);
      setParticipantsCache(prev => ({ ...prev, [activiteId]: 0 }));
      return 0;
      
    } catch (error) {
      console.error('❌ Erreur comptage participants dans inscription_activite pour', activiteId, ':', error);
      setParticipantsCache(prev => ({ ...prev, [activiteId]: 0 }));
      return 0;
    }
  };



  // Charger les activités depuis l'API (optimisé)
  const loadActivites = async () => {
    try {
      setLoading(true);
      
      // Charger tout en parallèle pour optimiser le temps de chargement
      const [activitesOuvertes, activitesPopulaires, typesResponse] = await Promise.all([
        activiteService.getActivitesOuvertes(),
        activiteService.getActivitesPopulaires(),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/public/types-activites`)
      ]);
      
      // Traiter les types d'activités
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setTypesActivites(typesData);
        console.log('Types d\'activités chargés:', typesData);
      } else {
        console.error('Erreur chargement types:', typesResponse.status, typesResponse.statusText);
      }
      
      // Limiter le nombre d'activités à traiter pour accélérer le chargement initial
      const limitedOuvertes = activitesOuvertes.slice(0, 8); // Limiter à 8 activités
      const limitedPopulaires = activitesPopulaires.slice(0, 6); // Limiter à 6 activités
      
      // Traiter les activités en parallèle avec cache
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
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {

    loadActivites();
    loadMethodesPaiement(); // Charger les méthodes de paiement depuis la base de données

  }, []);



  // Initialiser les activités filtrées quand les activités populaires changent

  useEffect(() => {

    setActivitesPopulairesFiltrees(activitesPopulaires);

  }, [activitesPopulaires]);



  const destinations = [
    { id: 1, name: "Centre de Prière", image: spiritualImages.prayer },
    { id: 2, name: "Église Locale", image: spiritualImages.church },
    { id: 3, name: "Méditation Spirituelle", image: spiritualImages.meditation },
    { id: 4, name: "Communauté Foi", image: spiritualImages.community }
  ];



  // Utiliser les vraies activités populaires filtrées au lieu des packages simulés

  const packages = activitesPopulairesFiltrees.slice(0, 4).map((activite, index) => ({

    id: activite.id_activite,

    name: activite.titre_activite,

    price: activite.capacite ? `${activite.nombre_participants || 0}/${activite.capacite} places` : "Illimité",

    rating: "⭐⭐⭐⭐⭐",

    reviews: activite.nombre_participants || 0,

    discount: "Disponible",

    image: activite.image_url || improvedImageBase64,

    date: activite.date_heure_activite,

    lieu: activite.lieu_activite,

    isBase64: true, // Toujours true car on utilise base64

    isRegistered: activite.isRegistered || false

  }));


  const infoGuide = [

    { icon: "💰", title: "Inscription Gratuite" },

    { icon: "✈️", "title": "Activités Variées" },

    { icon: "🎫", title: "Événements Réguliers" },

    { icon: "ℹ️", title: "Assistance Permanente" },

    { icon: "📱", title: "Contact Facile" }

  ];



  // Gérer le clic sur une activité

  const handleActiviteClick = (activiteId) => {

    navigate(`/activite/${activiteId}`);

  };



  // Gérer l'inscription directe

  const handleParticiper = async (activiteId) => {

    // Trouver l'activité pour vérifier si c'est une formation

    const activite = activitesOuvertes.find(a => a.id_activite === activiteId);



    // Si c'est une formation (TYP-1), afficher le popup de paiement

    if (activite && activite.id_type === 'TYP-1') {

      console.log('Formation détectée - Affichage du popup de paiement');
      
      // Afficher l'ID utilisateur dès l'ouverture du popup
      const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      if (auth) {
        try {
          const authData = JSON.parse(auth);
          console.log('=== ID UTILISATEUR À L\'OUVERTURE DU POPUP ===');
          console.log('AuthData:', authData);
          
          let utilisateurConnecte = null;
          if (authData.utilisateur) {
            utilisateurConnecte = authData.utilisateur;
          } else if (authData.user) {
            utilisateurConnecte = authData.user;
          } else if (authData.data && authData.data.user) {
            utilisateurConnecte = authData.data.user;
          }
          
          if (utilisateurConnecte) {
            console.log('Utilisateur trouvé à l\'ouverture:', utilisateurConnecte);
            console.log('ID utilisateur à l\'ouverture:', utilisateurConnecte.id_utilisateur);
            
            // Chercher l'ID dans toutes les propriétés si null
            if (!utilisateurConnecte.id_utilisateur) {
              for (const key in utilisateurConnecte) {
                if (typeof utilisateurConnecte[key] === 'string' && utilisateurConnecte[key].includes('usr-')) {
                  console.log(`ID trouvé à l'ouverture dans '${key}':`, utilisateurConnecte[key]);
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



    // Pour les autres activités, procéder normalement

    // Vérifier si l'utilisateur est connecté

    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');

    const member = localStorage.getItem('member') || sessionStorage.getItem('member');

    const userIsLoggedIn = auth === 'true' && member;

    

    if (!userIsLoggedIn) {

      // Si non connecté, rediriger vers la page de login

      navigate('/login');

      return;

    }



    // Si connecté, inscrire directement

    setSubmittingId(activiteId);

    try {

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const member = localStorage.getItem('member') || sessionStorage.getItem('member');

      const memberData = member ? JSON.parse(member) : null;

      

      console.log('État de connexion:', {

        auth,

        member: member,

        'member parsed': member ? JSON.parse(member) : null

      });

      

      // Vérifier que l'ID utilisateur existe (structure correcte)

      if (!memberData || !memberData.id) {

        console.error('Données utilisateur invalides:', memberData);

        alert('Erreur: données utilisateur invalides. Veuillez vous reconnecter.');

        setSubmittingId(null);

        return;

      }

      

      // Récupérer l'ID utilisateur avec fallback

      let utilisateurId = memberData.id;

      

      // Fallback: essayer de récupérer depuis les autres propriétés

      if (!utilisateurId && memberData) {

        if (memberData.member?.id) {

          utilisateurId = memberData.member.id;

        } else if (memberData.id_utilisateur) {

          utilisateurId = memberData.id_utilisateur;

        } else if (memberData.email) {

          // Extraire l'ID depuis l'email (format: USR-X)

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

      

      console.log('Tentative d\'inscription avec:', {

        activiteId,

        utilisateurId,

        memberData,

        'utilisateur final': utilisateurId

      });

      

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



      // Afficher un message de succès

      alert('Inscription réussie ! Vous êtes maintenant inscrit à cette activité.');

      

      // Mettre à jour le nombre de participants localement

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

      

      // Rafraîchir les activités pour mettre à jour le statut

      loadActivites();

      

    } catch (err) {

      console.error('Erreur inscription:', err);

      alert('Erreur lors de l\'inscription: ' + err.message);

    } finally {

      setSubmittingId(null);

    }

  };



  // Gérer la désinscription

  const handleDesinscrire = async (activiteId) => {

    // Vérifier si l'utilisateur est connecté

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

      

      // Récupérer l'ID utilisateur

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

      

      // Mettre à jour le nombre de participants localement

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

      

      // Rafraîchir les activités pour mettre à jour le statut

      loadActivites();

      

    } catch (err) {

      console.error('Erreur désinscription:', err);

      alert('Erreur lors de la désinscription: ' + err.message);

    } finally {

      setSubmittingId(null);

    }

  };



  const handleSeeOnMap = (activity) => {

    // setSelectedActivity(activity);

  };



  const handleProfileClick = () => {

    navigate("/profile");

  };



  // Gérer le clic sur "Voir tout"

  const handleSeeAllActivites = () => {

    navigate('/activites');

  };



  // Gérer le changement de filtre d'activité

  const handleActivityFilterChange = (e) => {

    const filterValue = e.target.value;

    setSelectedTypeFilter(filterValue);

    console.log('Filtre sélectionné:', filterValue);

    

    // Filtrer les activités populaires selon le type sélectionné

    if (filterValue === 'all') {

      setActivitesPopulairesFiltrees(activitesPopulaires);

    } else {

      const filtrees = activitesPopulaires.filter(activite => 

        activite.id_type === filterValue

      );

      setActivitesPopulairesFiltrees(filtrees);

    }

  };



  // Charger les exigences pour un type d'activité spécifique

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

        console.log(`Exigences pour type ${idType}:`, exigences);

      } else {

        console.error('Erreur chargement exigences:', response.status);

      }

    } catch (error) {

      console.error('Erreur lors du chargement des exigences:', error);

    }

  };



  // Gérer le clic sur un type d'activité pour voir les exigences

  const handleTypeClick = (typeId) => {

    if (typeId === 'all') return;

    

    // Charger les exigences si pas encore chargées

    if (!exigencesByType[typeId]) {

      loadExigencesForType(typeId);

    }

    

    // Basculer l'affichage des exigences

    setShowExigences(prev => !prev);

  };



  if (loading) {

    return (

      <div className="home-container">

        <div className="loading-container">

          <div className="loading-spinner">Chargement des activités...</div>

        </div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="home-container">

        <div className="error-container">

          <div className="error-message">{error}</div>

          <button onClick={() => window.location.reload()} className="retry-btn">

            Réessayer

          </button>

        </div>

      </div>

    );

  }



  // Gérer le clic sur une méthode de paiement
  const handleMethodeClick = (methode) => {
    console.log('Design popup - Méthode cliquée:', methode.id, methode.nom);
    
    if (methode.id === 'mobile_money') {
      // Si c'est Mobile Money, afficher les options détaillées pour choisir UN opérateur
      console.log('Design popup - Clic sur Mobile Money, affichage des opérateurs pour choix unique');
      setTimeout(() => setShowMobileMoneyOptions(true), 100);
    } else {
      // Pour les autres méthodes (Espèce, etc.), sélection directe sans Mobile Money
      console.log('Design popup - Méthode choisie (pas Mobile Money):', methode.nom);
      
      // 🆕 Stocker la méthode de paiement sélectionnée
      setSelectedMethodePaiement(methode.nom);
      
      // S'assurer que les options Mobile Money sont fermées
      setShowMobileMoneyOptions(false);
      
      // Réinitialiser tous les autres boutons
      const allBtns = document.querySelectorAll('.payment-method-btn');
      allBtns.forEach(btn => {
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.border = '2px solid #e2e8f0';
        const methodeName = btn.querySelector('span:last-child')?.textContent || '';
        const methodeIcon = btn.querySelector('span:first-child')?.textContent || '💳';
        btn.innerHTML = `<span>${methodeIcon}</span><span>${methodeName}</span>`;
      });
      
      // Mettre en surbrillance le bouton sélectionné
      const selectedBtn = document.querySelector(`.payment-method-btn[key="${methode.id}"]`);
      if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        selectedBtn.style.color = 'white';
        selectedBtn.style.borderColor = '#1d4ed8';
        selectedBtn.innerHTML = `<span>${methode.displayIcon || '💳'}</span><span>${methode.nom} ✓</span>`;
        
        // Garder le bouton en état sélectionné (pas de réinitialisation)
        // L'utilisateur verra que son choix est bien enregistré
      }
    }
  };

  // Gérer le choix d'un opérateur mobile money
  const handleMobileMoneyChoice = (operator) => {
    console.log('Design popup - Opérateur choisi:', operator);
    
    // 🆕 Stocker l'opérateur mobile money choisi
    setSelectedMethodePaiement(operator);
    
    // Réinitialiser tous les autres boutons d'opérateurs
    const allOperatorBtns = document.querySelectorAll('.mobile-money-operator-btn');
    allOperatorBtns.forEach(btn => {
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.border = '2px solid #0ea5e9';
      const operatorName = btn.querySelector('span:last-child')?.textContent || '';
      btn.innerHTML = `<span>📱</span><span>${operatorName}</span>`;
    });
    
    // Mettre en surbrillance le bouton sélectionné
    const selectedBtn = document.querySelector(`.mobile-money-operator-btn:nth-child(${methodesPaiement.find(m => m.id === 'mobile_money')?.types?.indexOf(operator) + 1})`);
    if (selectedBtn) {
      selectedBtn.style.background = 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)';
      selectedBtn.style.color = 'white';
      selectedBtn.style.borderColor = '#0284c7';
      selectedBtn.innerHTML = `<span>📱</span><span>${operator} ✓</span>`;
    }
    
    // Ne fermer que si le paiement est vraiment effectué
    // Pour l'instant, juste garder le popup ouvert avec le choix visible
    // handlePayment(selectedActivite, operator);
    // setShowMobileMoneyOptions(false);
    // setShowPaymentPopup(false);
    // setSelectedActivite(null);
  };

  // Gérer le paiement pour les formations
  const handlePayment = async (activite, methodePaiement = 'Mobile Money') => {
    try {
      console.log('=== CLIC SUR PAYER MAINTENANT ===');
      
      // Afficher l'ID utilisateur connecté simplement
      const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      const member = localStorage.getItem('member') || sessionStorage.getItem('member');
      
      console.log('=== DONNÉES BRUTES DE STOCKAGE ===');
      console.log('localStorage.auth:', localStorage.getItem('auth'));
      console.log('sessionStorage.auth:', sessionStorage.getItem('auth'));
      console.log('localStorage.member:', localStorage.getItem('member'));
      console.log('sessionStorage.member:', sessionStorage.getItem('member'));
      console.log('Auth brut choisi:', auth);
      console.log('Member brut choisi:', member);
      
      let utilisateurConnecte = null;
      let idUtilisateurTrouve = null;
      
      // Priorité aux données member (où se trouvent vraiment les infos utilisateur)
      let dataSource = null;
      if (member) {
        dataSource = member;
        console.log('Source utilisée: member');
      } else if (auth) {
        dataSource = auth;
        console.log('Source utilisée: auth');
      }
      
      if (dataSource) {
        try {
          const userData = JSON.parse(dataSource);
          console.log('=== ID UTILISATEUR CONNECTÉ ===');
          console.log('UserData complet:', userData);
          console.log('Type de UserData:', typeof userData);
          console.log('Clés de UserData:', Object.keys(userData));
          
          // userData contient directement l'utilisateur
          utilisateurConnecte = userData;
          console.log('Utilisateur connecté:', utilisateurConnecte);
          console.log('Type de utilisateurConnecte:', typeof utilisateurConnecte);
          console.log('Clés de utilisateurConnecte:', Object.keys(utilisateurConnecte));
          
          // Chercher l'ID dans id_utilisateur d'abord
          if (utilisateurConnecte.id_utilisateur) {
            idUtilisateurTrouve = utilisateurConnecte.id_utilisateur;
            console.log('ID utilisateur trouvé (id_utilisateur):', idUtilisateurTrouve);
          } else if (utilisateurConnecte.id) {
            idUtilisateurTrouve = utilisateurConnecte.id;
            console.log('ID utilisateur trouvé (id):', idUtilisateurTrouve);
          } else {
            // Chercher dans d'autres propriétés
            const possibleIds = ['user_id', 'userId', 'id_user'];
            for (const prop of possibleIds) {
              if (utilisateurConnecte[prop]) {
                idUtilisateurTrouve = utilisateurConnecte[prop];
                console.log(`ID utilisateur trouvé (${prop}):`, idUtilisateurTrouve);
                break;
              }
            }
            
            // Si toujours pas trouvé, chercher partout
            if (!idUtilisateurTrouve) {
              for (const key in utilisateurConnecte) {
                if (utilisateurConnecte[key] && typeof utilisateurConnecte[key] === 'string' && (utilisateurConnecte[key].includes('usr-') || utilisateurConnecte[key].includes('USR-'))) {
                  idUtilisateurTrouve = utilisateurConnecte[key];
                  console.log(`ID utilisateur trouvé (${key}):`, idUtilisateurTrouve);
                  break;
                }
              }
            }
          }
          
          console.log('=== RÉSULTAT FINAL ===');
          console.log('ID utilisateur connecté:', idUtilisateurTrouve);
          
          // Assigner l'ID pour le paiement
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

      console.log('Activité:', activite);
      console.log('Utilisateur final pour paiement:', utilisateurConnecte);
      console.log('ID utilisé pour paiement:', utilisateurConnecte.id_utilisateur);

      // Étape 1: Créer le paiement D'ABORD avec l'ID utilisateur
      console.log('Création du paiement en premier...');
      
      // Validation de l'ID utilisateur
      console.log('=== DÉBUGGING ID UTILISATEUR ===');
      console.log('utilisateurConnecte complet:', JSON.stringify(utilisateurConnecte, null, 2));
      console.log('utilisateurConnecte.id_utilisateur:', utilisateurConnecte.id_utilisateur);
      console.log('Type de utilisateurConnecte.id_utilisateur:', typeof utilisateurConnecte.id_utilisateur);
      console.log('utilisateurConnecte.id:', utilisateurConnecte.id);
      console.log('Type de utilisateurConnecte.id:', typeof utilisateurConnecte.id);
      
      if (!utilisateurConnecte.id_utilisateur && !utilisateurConnecte.id) {
        console.error('Aucun ID trouvé dans id_utilisateur ni id');
        console.log('Propriétés disponibles:', Object.keys(utilisateurConnecte));
        
        // Chercher manuellement l'ID
        for (const key in utilisateurConnecte) {
          const value = utilisateurConnecte[key];
          console.log(`Propriété ${key}:`, value, `(type: ${typeof value})`);
          if (typeof value === 'string' && (value.includes('USR-') || value.includes('usr-'))) {
            console.log(`ID TROUVÉ dans ${key}:`, value);
            utilisateurConnecte.id_utilisateur = value;
            break;
          }
        }
      }
      
      if (!utilisateurConnecte.id_utilisateur) {
        console.error('ID utilisateur toujours manquant après recherche');
        console.error('utilisateurConnecte après recherche:', utilisateurConnecte);
        alert('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.');
        return;
      }
      
      const paiementData = {
        id_utilisateur: utilisateurConnecte.id_utilisateur,
        id_activite: activite.id_activite,
        montant: activite.prix || activite.montant_a_payer || 0,
        description: `Paiement formation: ${activite.titre_activite}`,
        methode_paiement: methodePaiement, // 🆕 Ajout de la méthode de paiement
        reference_paiement: `REF-${Date.now()}` // 🆕 Référence automatique
      };

      console.log('=== DONNÉES ENVOYÉES AU BACKEND ===');
      console.log('paiementData complet:', JSON.stringify(paiementData, null, 2));
      console.log('id_utilisateur envoyé:', paiementData.id_utilisateur);
      console.log('Type id_utilisateur envoyé:', typeof paiementData.id_utilisateur);
      console.log('id_activite envoyé:', paiementData.id_activite);
      console.log('Type id_activite envoyé:', typeof paiementData.id_activite);

      const paiementResponse = await fetch(`${process.env.REACT_APP_API_URL}/public/formation/paiement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${utilisateurConnecte.token || ''}`
        },
        body: JSON.stringify(paiementData)
      });

      const paiementResult = await paiementResponse.json();
      console.log('Réponse paiement:', paiementResult);

      if (!paiementResult.success) {
        console.error('Erreur lors du paiement:', paiementResult.message);
        alert(`Erreur: ${paiementResult.message}`);
        return;
      }

      console.log('Paiement créé avec succès:', paiementResult.data);

      // Succès - le backend a déjà créé l'inscription automatiquement
      alert(`Paiement de ${paiementData.montant} ${activite.devise || 'MGA'} et inscription réussis!`);
      
      // Fermer le popup
      setShowPaymentPopup(false);
      setShowMobileMoneyOptions(false);
      setSelectedActivite(null);
      
      // Optionnel: recharger les données
      // window.location.reload();

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert('Erreur: Une erreur est survenue lors du paiement');
    }
  };


  return (
    <div className="home-container">
      {/* Header complet via NavigationMembre */}
      <NavigationMembre />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Votre Santé Visuelle, Notre Priorité</h1>
          <p>Découvrez nos services et activités pour une meilleure vision</p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Rechercher une activité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Rechercher</button>
          </div>
        </div>
      </section>



      {/* Formation M.E.DI.A Section */}
      <section className="packages-section">
        <div className="section-header">
          <h2>🎨 Formation M.E.DI.A</h2>
          <div className="header-actions">
            <span className="section-subtitle">Multimedia, Electronics, Digital Art</span>
            <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); }}>Voir tout</a>
          </div>
        </div>

        <div className="packages-grid">
          {/* Formation 1: Introduction à la 3D */}
          <div className="activity-card" onClick={() => handleActiviteClick('media-3d')}>
            <div className="activity-image">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad1)'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E%3Ctspan x='200' dy='-20'%3E%F0%9F%8E%A8%3C/tspan%3E%3Ctspan x='200' dy='40'%3EIntroduction%3C/tspan%3E%3Ctspan x='200' dy='30'%3E%C3%A0 la 3D%3C/tspan%3E%3C/text%3E%3C/svg%3E" alt="Introduction à la 3D" className="activity-img" />
            </div>
            <div className="activity-content">
              <h3>Introduction à la 3D</h3>
              <p className="activity-price">💰 50 000 MGA</p>
              <p className="activity-location">📍 Lab Digital - Ankorondrano</p>
              <div className="activity-actions">
                <button 
                  className="participer-btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleParticiper('media-3d');
                  }}
                >
                  🎯 Participer
                </button>
                
                <div className="action-buttons-row">
                  <button 
                    className="see-map-btn-small" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleActiviteClick('media-3d'); }}
                  >
                    📋 Détails
                  </button>
                  <button 
                    className="see-map-btn-small" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/map'); }}
                  >
                    🗺️ Carte
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Formation 2: Électronique de base */}
          <div className="activity-card" onClick={() => handleActiviteClick('media-electronique')}>
            <div className="activity-image">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f59e0b;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23d97706;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad2)'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E%3Ctspan x='200' dy='-20'%3E%F0%9F%94%8C%3C/tspan%3E%3Ctspan x='200' dy='40'%3E%C3%89lectronique%3C/tspan%3E%3Ctspan x='200' dy='30'%3Ede base%3C/tspan%3E%3C/text%3E%3C/svg%3E" alt="Électronique de base" className="activity-img" />
            </div>
            <div className="activity-content">
              <h3>Électronique de base</h3>
              <p className="activity-price">💰 45 000 MGA</p>
              <p className="activity-location">📍 Lab Tech - Itaosy</p>
              <div className="activity-actions">
                <button 
                  className="participer-btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleParticiper('media-electronique');
                  }}
                >
                  🎯 Participer
                </button>
                
                <div className="action-buttons-row">
                  <button 
                    className="see-map-btn-small" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleActiviteClick('media-electronique'); }}
                  >
                    📋 Détails
                  </button>
                  <button 
                    className="see-map-btn-small" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/map'); }}
                  >
                    🗺️ Carte
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Formation 3: Art Digital Créatif */}
          <div className="activity-card" onClick={() => handleActiviteClick('media-art')}>
            <div className="activity-image">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ec4899;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23be185d;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad3)'/%3E%3Ctext x='200' y='150' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3E%3Ctspan x='200' dy='-20'%3E%F0%9F%8E%A8%3C/tspan%3E%3Ctspan x='200' dy='40'%3EArt Digital%3C/tspan%3E%3Ctspan x='200' dy='30'%3ECr%C3%A9atif%3C/tspan%3E%3C/text%3E%3C/svg%3E" alt="Art Digital Créatif" className="activity-img" />
            </div>
            <div className="activity-content">
              <h3>Art Digital Créatif</h3>
              <p className="activity-price">💰 60 000 MGA</p>
              <p className="activity-location">📍 Studio Art - Mahamasina</p>
              <div className="activity-actions">
                <button 
                  className="participer-btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleParticiper('media-art');
                  }}
                >
                  🎯 Participer
                </button>
                
                <div className="action-buttons-row">
                  <button 
                    className="see-map-btn-small" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleActiviteClick('media-art'); }}
                  >
                    📋 Détails
                  </button>
                  <button 
                    className="see-map-btn-small" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/map'); }}
                  >
                    🗺️ Carte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Packages Section - Activités Populaires */}

      <section className="packages-section">

        <div className="section-header">

          <h2>Activités Populaires</h2>

          <div className="header-actions">

            <select 

              className="activity-filter" 

              value={selectedTypeFilter}

              onChange={handleActivityFilterChange}

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

            <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); handleSeeAllActivites(); }}>Voir tout</a>

          </div>

        </div>



        <div className="packages-grid">

          {packages.length > 0 ? (

            packages.map(pkg => (

              <div key={pkg.id} className="activity-card" onClick={() => handleActiviteClick(pkg.id)}>
                <div className="activity-image">
                  {pkg.image ? (
                    pkg.isBase64 ? (
                      <img src={pkg.image} alt={pkg.name} className="activity-img" />
                    ) : (
                      <img src={activiteService.getImageUrl(pkg.image)} alt={pkg.name} className="activity-img" />
                    )
                  ) : (
                    <div className="activity-fallback">🏨</div>
                  )}
                </div>
                <div className="activity-content">
                  <h3>{pkg.name}</h3>
                  <p className="activity-price">{pkg.price}</p>
                  <p className="activity-location">📍 {pkg.lieu}</p>
                  <div className="activity-actions">
                    <button 
                      className={`participer-btn-small ${pkg.isRegistered ? 'registered' : ''}`}
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
                      {submittingId === pkg.id ? '⏳ Chargement...' : (pkg.isRegistered ? '✅ Inscrit' : '🎯 Participer')}
                    </button>
                    
                    <div className="action-buttons-row">
                      <button 
                        className="see-map-btn-small" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleActiviteClick(pkg.id); }}
                      >
                        📋 Détails
                      </button>
                      <button 
                        className="see-map-btn-small" 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/map'); }}
                      >
                        🗺️ Carte
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            ))

          ) : (

            <div className="no-activities">

              <p>Aucune activité populaire disponible pour le moment.</p>

            </div>

          )}

        </div>

      </section>



      {/* Section Exigences par Type d'Activité */}

      {showExigences && selectedTypeFilter !== 'all' && (

        <section className="exigences-section">

          <div className="exigences-header">

            <h3>Exigences pour {typesActivites.find(t => t.id === selectedTypeFilter)?.libelle_type}</h3>

            <button className="close-btn" onClick={() => setShowExigences(false)}>✕</button>

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

        <h2>Informations & guide</h2>

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
              <h3>💳 Paiement requis</h3>
              <button 
                className="close-popup-btn" 
                onClick={() => {
                  setShowPaymentPopup(false);
                  setSelectedActivite(null);
                  setShowMobileMoneyOptions(false);
                }}
              >
                ✕
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
                      <span>{methode.displayIcon || '💳'}</span>
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
                        <span>📱</span>
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

};



export default Home;

