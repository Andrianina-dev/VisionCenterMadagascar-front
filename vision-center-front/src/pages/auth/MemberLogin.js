import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../../styles/components/couleur/couleur.css";
import logoVisionCenter from "../../assets/images/logo/logo vision center.png";
import CustomInput from "../../components/CustomInput";
import UserTypeToggle from "../../components/UserTypeToggle";
import AuthService from "../../services/auth.service";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState(null);
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
    console.log('Field changed', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted', { formData, userType });
    
    // Validation basique
    if (!formData.email || !formData.password) {
      console.log('Missing email or password');
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (!userType) {
      setError('Veuillez sélectionner un type d\'utilisateur');
      return;
    }
    
    console.log('Validation passed, using AuthService...');
    setLoading(true);
    setError('');
    
    try {
      // Utiliser AuthService pour la connexion
      const result = await AuthService.login(formData.email, formData.password);
      
      if (result.success) {
        console.log('✅ Succès - Utilisateur trouvé:', result.member);
        
        // Stocker selon le type d'utilisateur
        if (userType === 'membre') {
          localStorage.setItem('member', JSON.stringify(result.member));
        } else if (userType === 'non-membre') {
          localStorage.setItem('non-member', JSON.stringify(result.member));
        } else {
          localStorage.setItem('user', JSON.stringify(result.member));
        }
        
        // Ajouter le token pour compatibilité
        localStorage.setItem('token', 'simple_token_' + Date.now());
        
        // Rediriger selon le type d'utilisateur
        if (userType === 'membre') {
          navigate('/member/dashboard');
        } else if (userType === 'non-membre') {
          navigate('/non-member/dashboard');
        } else {
          navigate('/dashboard');  // Home.js par défaut
        }
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
                  👁️
                </button>
              </div>
            </div>

            <UserTypeToggle 
              userType={userType} 
              onChange={setUserType} 
            />

            <div className="forgot-row">
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Log In'}
            </button>
          </form>

          <div className="divider">Or log in with</div>

          <div className="social-row">
            <button className="social-circle">G</button>
          </div>

          <p className="legal">
            Login means you agree our terms & conditions and Privacy Policy of
            Handeha Voyages
          </p>

          <p className="signup">
            Don't have account? <a href="#" onClick={handleSignupClick}>Sign-up!</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;