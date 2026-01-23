import React, { useState } from "react";
import AuthService from "../../services/auth.service";
import "./Login.css";

const MemberLogin = ({ history }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        // Rediriger vers le dashboard membre
        window.location.href = "/dashboard";
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

            <a href="#" className="forgot-password">Forgot Password?</a>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Log in as Member'}
            </button>
          </form>

          <div className="divider">Or log in with</div>

          <div className="social-login">
            <button className="social-btn apple" disabled={loading}>🍎</button>
            <button className="social-btn google" disabled={loading}>🔍</button>
          </div>

          <p className="terms-text">
            Log in means you agree our <a href="#">terms & conditions</a> and <a href="#">Privacy Policy</a> of Vision Center Madagascar
          </p>

          <p className="signup-text">
            Don't have account? <a href="#" className="signup-link">Sign up!</a>
          </p>
          
          <p className="admin-link">
            Are you an administrator? <a href="/admin/login" className="admin-login-link">Admin Login</a>
          </p>
        </div>

        <footer className="login-footer">
          © 2023 Vision Center Madagascar. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default MemberLogin;
