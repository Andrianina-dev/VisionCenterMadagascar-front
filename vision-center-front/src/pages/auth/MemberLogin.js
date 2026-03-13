import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import "./Login.css";

const MemberLogin = ({ history }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMember, setIsMember] = useState(true); // Toggle pour membre/non-membre

  const handleNavigateToSignup = (e) => {
    e.preventDefault();
    const wrapper = document.querySelector('.login-wrapper');
    wrapper.classList.add('transitioning');
    
    setTimeout(() => {
      navigate('/signup');
    }, 600);
  };

  const handleNavigateToAdmin = (e) => {
    e.preventDefault();
    const wrapper = document.querySelector('.login-wrapper');
    wrapper.classList.add('transitioning');
    
    setTimeout(() => {
      navigate('/admin/login');
    }, 600);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isMember) {
        // Connexion membre existante
        const response = await AuthService.login(email, password);
        
        if (response.success) {
          // Redirection vers le dashboard membre
          navigate('/member/dashboard');
        } else {
          throw new Error(response.error || 'Erreur de connexion membre');
        }
      } else {
        // Connexion non-membre - vérifier dans la base de données
        const response = await fetch('http://localhost:8000/auth/non-member/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        const data = await response.json();

        if (data.success) {
          // Stocker les informations du non-membre dans localStorage
          localStorage.setItem('non-member', JSON.stringify(data.data.user));
          localStorage.setItem('auth', 'true');
          
          // Redirection vers le dashboard non-membre
          navigate('/non-member/dashboard');
        } else {
          throw new Error(data.message || 'Erreur de connexion non-membre');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                        error.message || 
                        (isMember ? "Erreur de connexion membre" : "Erreur de connexion non-membre");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="vision-logo">
          <div className="logo-circle">
            <svg viewBox="0 0 200 200" width="150" height="150">
              <circle cx="100" cy="100" r="95" fill="#E6F3FF"/>
              <text x="100" y="75" fontSize="36" fontWeight="bold" textAnchor="middle" fill="#000">VISION</text>
              <text x="100" y="120" fontSize="36" fontWeight="bold" textAnchor="middle" fill="#000">CENTER</text>
              <text x="100" y="145" fontSize="16" textAnchor="middle" fill="#666" fontStyle="italic">Madagascar</text>
              <g opacity="0.8">
                <rect x="85" y="35" width="30" height="8" fill="#FBBF24" rx="2"/>
                <rect x="75" y="45" width="50" height="6" fill="#FBBF24" rx="1"/>
                <rect x="80" y="53" width="40" height="4" fill="#FBBF24" rx="1"/>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h1>Member Sign in</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder={isMember ? "Password" : "Password (optionnel)"}
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required={isMember}  // Requis seulement pour les membres
                />
                {isMember && (
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    👁️
                  </button>
                )}
              </div>
            </div>

            {/* Toggle Membre/Non-membre - Vraie toggle avec slider */}
            <div className="member-type-toggle">
              <div className="toggle-switch">
                <button 
                  type="button"
                  className={`toggle-option ${isMember ? 'active' : ''}`}
                  onClick={() => setIsMember(true)}
                  disabled={loading}
                >
                  Membre
                </button>
                <button 
                  type="button"
                  className={`toggle-option ${!isMember ? 'active' : ''}`}
                  onClick={() => setIsMember(false)}
                  disabled={loading}
                >
                  Non-membre
                </button>
                <div className={`toggle-slider ${isMember ? '' : 'non-member'}`}></div>
              </div>
            </div>

            <a href="#" className="forgot-password">Forgot Password?</a>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : (isMember ? 'Log in as Member' : 'Log in as Non-Member')}
            </button>
          </form>

          <div className="divider">Or log in with</div>

          <div className="social-login">
            <button className="social-btn apple" disabled={loading}>🍎</button>
            <button className="social-btn google" disabled={loading}>🔍</button>
          </div>

          <p className="terms-text">
            Log in means you agree our <a href="#">terms & conditions</a> and <a href="#">Privacy Policy</a> of Centre de Vision
          </p>

          <p className="signup-text">
            {isMember ? "Don't have account?" : "Vous n'avez pas de réservation?"} <a href={isMember ? "/signup" : "/location-salle"} className="signup-link" onClick={isMember ? handleNavigateToSignup : undefined}>{isMember ? 'Sign up!' : 'Faire une réservation'}</a>
          </p>
          
          {/* Bouton retour au site */}
          <div className="back-to-site">
            <button 
              className="back-to-site-btn"
              onClick={() => window.location.href = '/'}
              disabled={loading}
            >
              🏠 Retour au site vitrine
            </button>
          </div>
        </div>

        <footer className="login-footer">
          © 2023 Centre de Vision. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default MemberLogin;
