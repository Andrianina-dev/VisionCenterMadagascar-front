import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './SignUp.css';
import '../../styles/components/couleur/couleur.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom_utilisateur: '',
    prenom_utilisateur: '',
    email_utilisateur: '',
    mot_de_passe: '',
    confirmPassword: '',
    telephone: '',
    role: 'non_membre'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom_utilisateur.trim()) {
      newErrors.nom_utilisateur = 'Le nom est requis';
    } else if (formData.nom_utilisateur.length > 150) {
      newErrors.nom_utilisateur = 'Le nom ne doit pas dépasser 150 caractères';
    }
    
    if (formData.role === 'membre' && !formData.prenom_utilisateur.trim()) {
      newErrors.prenom_utilisateur = 'Le prénom est requis';
    }
    
    if (!formData.email_utilisateur.trim()) {
      newErrors.email_utilisateur = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_utilisateur)) {
      newErrors.email_utilisateur = 'L\'email n\'est pas valide';
    } else if (formData.email_utilisateur.length > 150) {
      newErrors.email_utilisateur = 'L\'email ne doit pas dépasser 150 caractères';
    }
    
    // Validation mot de passe (obligatoire pour membre, optionnel pour non-membre)
    if (formData.mot_de_passe && formData.mot_de_passe.length < 8) {
      newErrors.mot_de_passe = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    // Validation confirmation mot de passe (seulement si mot de passe est fourni)
    if (formData.mot_de_passe && !formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.mot_de_passe && formData.mot_de_passe !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (formData.telephone && formData.telephone.length > 255) {
      newErrors.telephone = 'Le numéro de téléphone ne doit pas dépasser 255 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const requestData = {
        nom_utilisateur: formData.nom_utilisateur,
        email_utilisateur: formData.email_utilisateur,
        id_role: formData.role,
        numero_telephone: formData.telephone || null
      };

      // Ajouter le mot de passe si fourni (pour les deux rôles)
      if (formData.mot_de_passe) {
        requestData.mot_de_passe = formData.mot_de_passe;
      }

      // Ajouter le prénom seulement pour les membres
      if (formData.role === 'membre') {
        requestData.prenom_utilisateur = formData.prenom_utilisateur;
      }

      const result = await AuthService.register(requestData);
      
      if (result.success) {
        navigate('/login', { 
          state: { 
            message: result.message,
            type: 'success'
          }
        });
      } else {
        setErrors({ general: result.error || 'Une erreur est survenue lors de l\'inscription' });
      }
    } catch (error) {
      setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = (e) => {
    e.preventDefault();
    const wrapper = document.querySelector('.login-wrapper');
    wrapper.classList.add('transitioning');
    
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  
  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-form-container">
          <h1>Créer un compte</h1>
          
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="input-field"
                    name="nom_utilisateur"
                    value={formData.nom_utilisateur}
                    onChange={handleChange}
                    placeholder="Entrez votre nom"
                    maxLength="150"
                  />
                  {errors.nom_utilisateur && <div className="invalid-feedback">{errors.nom_utilisateur}</div>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    className="input-field"
                    name="prenom_utilisateur"
                    value={formData.prenom_utilisateur}
                    onChange={handleChange}
                    placeholder="Entrez votre prénom"
                    maxLength="150"
                  />
                  {errors.prenom_utilisateur && <div className="invalid-feedback">{errors.prenom_utilisateur}</div>}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`input-field ${errors.email_utilisateur ? 'is-invalid' : ''}`}
                name="email_utilisateur"
                value={formData.email_utilisateur}
                onChange={handleChange}
                placeholder="Entrez votre email"
                maxLength="150"
              />
              {errors.email_utilisateur && <div className="invalid-feedback">{errors.email_utilisateur}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                className={`input-field ${errors.telephone ? 'is-invalid' : ''}`}
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
                placeholder="Entrez votre numéro de téléphone"
                maxLength="255"
              />
              {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
            </div>

            {formData.role === 'membre' && (
              <>
                <div className="form-group">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className={`input-field ${errors.mot_de_passe ? 'is-invalid' : ''}`}
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe"
                  />
                  {errors.mot_de_passe && <div className="invalid-feedback">{errors.mot_de_passe}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirmer mot de passe</label>
                  <input
                    type="password"
                    className={`input-field ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre mot de passe"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              </>
            )}

            {formData.role === 'non_membre' && (
              <>
                <div className="form-group">
                  <label className="form-label">Mot de passe (optionnel)</label>
                  <input
                    type="password"
                    className={`input-field ${errors.mot_de_passe ? 'is-invalid' : ''}`}
                    name="mot_de_passe"
                    value={formData.mot_de_passe}
                    onChange={handleChange}
                    placeholder="Entrez un mot de passe (optionnel)"
                  />
                  {errors.mot_de_passe && <div className="invalid-feedback">{errors.mot_de_passe}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirmer mot de passe</label>
                  <input
                    type="password"
                    className={`input-field ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre mot de passe"
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Type de compte</label>
              <div className="toggle-switch-container">
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="role-toggle"
                    className="toggle-switch-checkbox"
                    checked={formData.role === 'membre'}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      role: e.target.checked ? 'membre' : 'non_membre' 
                    }))}
                  />
                  <label className="toggle-switch-label" htmlFor="role-toggle">
                    <span className="toggle-switch-inner"></span>
                    <span className="toggle-switch-switch"></span>
                  </label>
                </div>
                <div className="toggle-labels">
                  <span className={`toggle-label ${formData.role === 'membre' ? 'active' : ''}`}>
                    Membre
                  </span>
                  <span className={`toggle-label ${formData.role === 'non_membre' ? 'active' : ''}`}>
                    Non-Membre
                  </span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription en cours...' : 'Créer un compte'}
            </button>
          </form>

          <div className="terms-text">
            En créant un compte, vous acceptez nos <a href="/conditions">conditions d'utilisation</a> et <a href="/confidentialite">politique de confidentialité</a>
          </div>

          <div className="signup-text">
            Vous avez déjà un compte ? <a href="/login" className="signup-link" onClick={handleNavigateToLogin}>Se connecter</a>
          </div>
          
                  </div>
      </div>

      <div className="login-right">
        <div className="vision-logo">
          <div className="logo-circle">
            <svg viewBox="0 0 200 200" width="150" height="150">
              <circle cx="100" cy="100" r="95" fill="#E6F3FF"/>
              <text x="100" y="75" fontSize="36" fontWeight="bold" textAnchor="middle" fill="#000">VISION</text>
              <text x="100" y="120" fontSize="36" fontWeight="bold" textAnchor="middle" fill="#000">CENTER</text>
              <text x="100" y="145" fontSize="16" textAnchor="middle" fill="#666" fontStyle="italic">Madagascar</text>
              <g opacity="0.8">
                <rect x="85" y="35" width="30" height="8" fill="#FBBF24" rx="2"/>
                <rect x="85" y="157" width="30" height="8" fill="#FBBF24" rx="2"/>
              </g>
            </svg>
          </div>
        </div>

        <footer className="login-footer">
          © 2023 Centre de Vision. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default SignUp;
