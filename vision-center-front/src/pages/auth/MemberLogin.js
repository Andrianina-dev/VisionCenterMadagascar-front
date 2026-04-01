import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./Login.css";
import "../../styles/components/couleur/couleur.css";
import logoVisionCenter from "../../assets/images/logo/logo vision center.png";
import CustomInput from "../../components/CustomInput";
import AuthService from "../../services/auth.service";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
        
    // Validation basique
    if (!formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs');
      return;
    }
    
        setLoading(true);
    setError('');
    
    try {
      // Utiliser AuthService pour la connexion
      const result = await AuthService.login(formData.email, formData.password);
      
      if (result.success) {
                                
        // Détecter automatiquement le rôle de l'utilisateur
        const userRole = result.member.role?.nom_role || result.member.role || result.member.type || 'membre'; // Par défaut: membre
                
        // Stocker l'utilisateur selon son rôle détecté
        if (userRole === 'membre') {
          localStorage.setItem('member', JSON.stringify(result.member));
        } else if (userRole === 'non_membre') {
          localStorage.setItem('non_membre', JSON.stringify(result.member));
          localStorage.setItem('auth', 'true'); // Ajouter auth pour les non_membres
                  } else {
          localStorage.setItem('user', JSON.stringify(result.member));
        }
        
        // Ajouter le token pour compatibilité
        localStorage.setItem('token', 'simple_token_' + Date.now());
        
        // Rediriger vers l'accueil du site vitrine (étape 1)
        navigate('/accueil');
      } else {
        setError(result.error || 'Email et/ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('💥 Erreur complète:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* PANEL GAUCHE - Vision Center */}
      <div className="left-panel">
        <div className="brand">
          <img src={logoVisionCenter} alt="Vision Center Logo" className="brand-logo" />
        </div>
        <div className="brand-text">
          <h2 className="brand-title text-white" style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: '700' }}>Grandis. Inspire. Agis.</h2>
          <p className="brand-subtitle text-white" style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '400' }}>Bienvenue à Vision Center.</p>
        </div>
      </div>

      {/* PANEL DROIT - Formulaire */}
      <div className="right-panel">
        <div className="form-card">
          <h1 className="signin-title">Sign in</h1>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ 
                color: '#e74c3c', 
                fontSize: '14px', 
                marginBottom: '15px', 
                padding: '10px', 
                backgroundColor: '#fdf2f2', 
                border: '1px solid #f5c6cb', 
                borderRadius: '5px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <div className="input-group">
              <CustomInput 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email" 
              />
            </div>

            <div className="input-group">
              <div className="password-wrapper">
                <CustomInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3" fill="#3b82f6"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="#3b82f6" strokeWidth="2"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="forgot-row">
              <a href="#" className="text-simple">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Log In'}
            </button>
          </form>

          <div className="divider text-simple">Or log in with</div>

          <div className="social-row">
            <button className="social-circle">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
          </div>

          <p className="legal text-simple">
            Login means you agree our terms & conditions and Privacy Policy of
            Handeha Voyages
          </p>

          <p className="signup text-simple">
            Don't have account? <a href="#" onClick={handleSignupClick}>Sign-up!</a>
          </p>

          {/* Bouton retour vers le site vitrine */}
          <div className="back-to-site">
            <button 
              className="back-to-site-btn text-white"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              <FiArrowLeft />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;