import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import AuthService from '../../services/auth.service';
import './Login.css';
import './SignUp.css';
import '../../styles/components/couleur/couleur.css';
import logoVisionCenter from '../../assets/images/logo/logo vision center.png';

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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
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
      newErrors.nom_utilisateur = 'Le nom ne doit pas depasser 150 caracteres';
    }

    if (formData.role === 'membre' && !formData.prenom_utilisateur.trim()) {
      newErrors.prenom_utilisateur = 'Le prenom est requis';
    }

    if (!formData.email_utilisateur.trim()) {
      newErrors.email_utilisateur = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_utilisateur)) {
      newErrors.email_utilisateur = 'L\'email n\'est pas valide';
    } else if (formData.email_utilisateur.length > 150) {
      newErrors.email_utilisateur = 'L\'email ne doit pas depasser 150 caracteres';
    }

    if (formData.mot_de_passe && formData.mot_de_passe.length < 8) {
      newErrors.mot_de_passe = 'Le mot de passe doit contenir au moins 8 caracteres';
    }

    if (formData.mot_de_passe && !formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.mot_de_passe && formData.mot_de_passe !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (formData.telephone && formData.telephone.length > 255) {
      newErrors.telephone = 'Le numero de telephone ne doit pas depasser 255 caracteres';
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

      if (formData.mot_de_passe) {
        requestData.mot_de_passe = formData.mot_de_passe;
      }

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
      setErrors({ general: 'Erreur de connexion. Veuillez reessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container signup-container">
      <div className="left-panel">
        <div className="brand">
          <img src={logoVisionCenter} alt="Vision Center Logo" className="brand-logo" />
        </div>
        <div className="brand-text">
          <h2 className="brand-title text-white">Grandis. Inspire. Agis.</h2>
          <p className="brand-subtitle text-white">Bienvenue a Vision Center.</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-card signup-form-card">
          <h1 className="signin-title">Creer un compte</h1>

          {errors.general && (
            <div className="signup-error-banner">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-grid-two">
              <div className="input-group">
                <input
                  type="text"
                  name="nom_utilisateur"
                  value={formData.nom_utilisateur}
                  onChange={handleChange}
                  placeholder="Nom"
                  maxLength="150"
                />
                {errors.nom_utilisateur && <div className="invalid-feedback">{errors.nom_utilisateur}</div>}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="prenom_utilisateur"
                  value={formData.prenom_utilisateur}
                  onChange={handleChange}
                  placeholder="Prenom"
                  maxLength="150"
                />
                {errors.prenom_utilisateur && <div className="invalid-feedback">{errors.prenom_utilisateur}</div>}
              </div>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email_utilisateur"
                value={formData.email_utilisateur}
                onChange={handleChange}
                placeholder="Email"
                maxLength="150"
              />
              {errors.email_utilisateur && <div className="invalid-feedback">{errors.email_utilisateur}</div>}
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
                placeholder="Telephone"
                maxLength="255"
              />
              {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
            </div>

            <div className="signup-role-row">
              <label htmlFor="role-toggle">Type de compte</label>
              <div className="toggle-switch-container">
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="role-toggle"
                    className="toggle-switch-checkbox"
                    checked={formData.role === 'membre'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: e.target.checked ? 'membre' : 'non_membre'
                      }))
                    }
                  />
                  <label className="toggle-switch-label" htmlFor="role-toggle" />
                </div>
                <div className="toggle-labels">
                  <span className={`toggle-label ${formData.role === 'membre' ? 'active' : ''}`}>Membre</span>
                  <span className={`toggle-label ${formData.role === 'non_membre' ? 'active' : ''}`}>Non-Membre</span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                placeholder={formData.role === 'membre' ? 'Mot de passe' : 'Mot de passe (optionnel)'}
              />
              {errors.mot_de_passe && <div className="invalid-feedback">{errors.mot_de_passe}</div>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmer mot de passe"
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <button type="submit" className="login-btn text-white bg-yellow-orange border-yellow-orange" disabled={isLoading}>
              {isLoading ? 'Inscription en cours...' : 'Creer un compte'}
            </button>
          </form>

          <p className="legal text-simple signup-legal">
            En creant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialite.
          </p>

          <p className="signup text-simple signup-footer-link">
            Vous avez deja un compte ?{' '}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Se connecter
            </a>
          </p>

          <div className="back-to-site">
            <button className="back-to-site-btn text-white" onClick={() => navigate('/')} disabled={isLoading}>
              <FiArrowLeft />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
