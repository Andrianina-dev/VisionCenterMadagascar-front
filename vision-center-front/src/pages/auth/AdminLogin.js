import React, { useState } from "react";
import AuthService from "../../services/auth.service";
import "./Login.css";
import "./AdminLogin.css";

const AdminLogin = ({ history }) => {
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
      const result = await AuthService.loginAdmin(email, password);
      
      if (result.success) {
        // Rediriger vers le dashboard admin
        window.location.href = "/admin";
      } else {
        setError(result.error || "Erreur de connexion admin");
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
              <circle cx="100" cy="100" r="95" fill="#FF6B6B"/>
              <text x="100" y="75" fontSize="48" fontWeight="bold" textAnchor="middle" fill="#FFF">VISION</text>
              <text x="100" y="125" fontSize="48" fontWeight="bold" textAnchor="middle" fill="#FFF">CENTER</text>
              <text x="100" y="150" fontSize="20" textAnchor="middle" fill="#FFF">Admin</text>
              <polygon points="120,50 135,30 145,45" fill="#FFF200"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h1>Administrator Sign in</h1>
          <p className="admin-subtitle">Access to Vision Center Madagascar Admin Panel</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Admin Email"
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
                  placeholder="Admin Password"
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

            <button 
              type="submit" 
              className="login-button admin-button"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Log in as Administrator'}
            </button>
          </form>

          <div className="divider">Or use admin credentials</div>

          <div className="admin-info">
            <p><strong>Default Admin Access:</strong></p>
            <p>Email: admin@visioncenter.mg</p>
            <p>Password: ••••••••</p>
          </div>

          <p className="terms-text">
            Admin access is restricted to authorized personnel only
          </p>

          <p className="member-link">
            Looking for member access? <a href="/login" className="member-login-link">Member Login</a>
          </p>
        </div>

        <footer className="login-footer">
          © 2023 Vision Center Madagascar Admin Panel. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLogin;
