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
        window.location.href = isMemberMode || !isAdmin ? "/dashboard" : "/admin";
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
        <div className="brand-logo">
          <div className="logo-mark">✦</div>
          <div className="brand-name">Lost In</div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h1>Sign in</h1>
          
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
                  placeholder="Password"
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

            <div className="forgot-password-link">
              <a href="#">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Log in'}
            </button>
          </form>

          <div className="divider">Or log in with</div>

          <div className="social-login">
            <button className="social-btn" disabled={loading}>🍎</button>
            <button className="social-btn" disabled={loading}>G</button>
          </div>

          <p className="terms-text">
            Log-in means you agree our terms & conditions and Privacy Policy of Handeha Voyages
          </p>

          <p className="signup-text">
            Don't have account? <a href="#" className="signup-link">Sign-up!</a>
          </p>

          {/* Liens admin/membre conservés */}
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
          © 2023 Handeha Voyages. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default Login;