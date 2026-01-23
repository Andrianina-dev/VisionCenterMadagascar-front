import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import "./Login.css";

const Login = ({ history, isAdmin = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMemberMode, setIsMemberMode] = useState(false);

  useEffect(() => {
    // Vérifier si l'URL contient #membres
    if (window.location.hash === '#membres') {
      setIsMemberMode(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = isMemberMode 
        ? await AuthService.login(email, password)
        : isAdmin 
        ? await AuthService.loginAdmin(email, password)
        : await AuthService.login(email, password);
      
      if (result.success) {
        // Rediriger vers la page d'accueil membre (Home.js) ou le dashboard admin
        if (isMemberMode) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = isAdmin ? "/admin" : "/dashboard";
        }
      } else {
        setError(result.error || "Erreur de connexion");
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.");
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
              <circle cx="100" cy="100" r="95" fill={isMemberMode ? "#E6F3FF" : isAdmin ? "#FF6B6B" : "#E6F3FF"}/>
              <text x="100" y="75" fontSize="36" fontWeight="bold" textAnchor="middle" fill={isMemberMode || isAdmin ? "#FFF" : "#000"}>VISION</text>
              <text x="100" y="120" fontSize="36" fontWeight="bold" textAnchor="middle" fill={isMemberMode || isAdmin ? "#FFF" : "#000"}>CENTER</text>
              <text x="100" y="145" fontSize="16" textAnchor="middle" fill={isMemberMode || isAdmin ? "#FFF" : "#666"} fontStyle="italic">Madagascar</text>
              {isMemberMode && (
                <g opacity="0.8">
                  <rect x="85" y="35" width="30" height="8" fill="#FBBF24" rx="2"/>
                  <rect x="75" y="45" width="50" height="6" fill="#FBBF24" rx="1"/>
                  <rect x="80" y="53" width="40" height="4" fill="#FBBF24" rx="1"/>
                </g>
              )}
              {isAdmin && (
                <polygon points="120,50 135,30 145,45" fill="#FFF200"/>
              )}
            </svg>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h1>{isMemberMode ? 'Member Sign in' : isAdmin ? 'Admin Sign in' : 'Sign in'}</h1>
          {isMemberMode && <p className="member-subtitle">Access to Vision Center Madagascar Member Area</p>}
          {isAdmin && <p className="admin-subtitle">Access to Vision Center Madagascar Admin Panel</p>}
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="email" 
                placeholder={isMemberMode ? "Member Email" : isAdmin ? "Admin Email" : "Email"}
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
                  placeholder={isMemberMode ? "Member Password" : isAdmin ? "Admin Password" : "Password"}
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  👁️
                </button>
              </div>
            </div>

            {!isMemberMode && <a href="#" className="forgot-password">Forgot Password?</a>}

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : isMemberMode ? 'Log in as Member' : isAdmin ? 'Log in as Administrator' : 'Log in'}
            </button>
          </form>

          <div className="divider">Or log in with</div>

          <div className="social-login">
            <button className="social-btn apple" disabled={loading}>🍎</button>
            <button className="social-btn google" disabled={loading}>🔍</button>
          </div>

          <p className="terms-text">
            {isMemberMode 
              ? 'Member login means you agree our terms & conditions and Privacy Policy of Vision Center Madagascar'
              : isAdmin 
              ? 'Admin access is restricted to authorized personnel only'
              : 'Log in means you agree our terms & conditions and Privacy Policy of Handela Voyages'
            }
          </p>

          <p className="signup-text">
            {isMemberMode 
              ? "Don't have member account? <a href=\"#\" className=\"signup-link\">Sign up!</a>"
              : isAdmin 
              ? ''
              : "Don't have account? <a href=\"#\" className=\"signup-link\">Sign up!</a>"
            }
          </p>
          
          {!isMemberMode && !isAdmin && (
            <p className="admin-link">
              Are you an administrator? <a href="/admin/login" className="admin-login-link">Admin Login</a>
            </p>
          )}
          
          {isMemberMode && (
            <p className="admin-link">
              Are you an administrator? <a href="/admin/login" className="admin-login-link">Admin Login</a>
            </p>
          )}
          
          {isAdmin && (
            <p className="member-link">
              Looking for member access? <a href="/login#membres" className="member-login-link">Member Login</a>
            </p>
          )}
        </div>

        <footer className="login-footer">
          © 2023 {isMemberMode ? 'Vision Center Madagascar' : isAdmin ? 'Vision Center Madagascar Admin Panel' : 'Handela Voyages'}. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default Login;
