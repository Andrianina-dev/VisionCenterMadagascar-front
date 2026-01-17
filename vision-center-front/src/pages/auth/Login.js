import React, { useState } from "react";
import AuthService from "../../services/auth.service";
import "./Login.css";

const Login = ({ history }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    AuthService.login();
    window.location.href = "/";
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="vision-logo">
          <div className="logo-circle">
            <svg viewBox="0 0 200 200" width="150" height="150">
              <circle cx="100" cy="100" r="95" fill="#7FFEF4"/>
              <text x="100" y="75" fontSize="48" fontWeight="bold" textAnchor="middle" fill="#000">VISION</text>
              <text x="100" y="125" fontSize="48" fontWeight="bold" textAnchor="middle" fill="#000">CENTER</text>
              <text x="100" y="150" fontSize="20" textAnchor="middle" fill="#666">Madagascar</text>
              <polygon points="120,50 135,30 145,45" fill="#FFF200"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h1>Sign in</h1>
          
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            </div>
          </div>

          <a href="#" className="forgot-password">Forgot Password?</a>

          <button className="login-button" onClick={handleLogin}>
            Log in
          </button>

          <div className="divider">Or log in with</div>

          <div className="social-login">
            <button className="social-btn apple">🍎</button>
            <button className="social-btn google">🔍</button>
          </div>

          <p className="terms-text">
            Log in means you agree our <a href="#">terms & conditions</a> and <a href="#">Privacy Policy</a> of Handela Voyages
          </p>

          <p className="signup-text">
            Don't have account? <a href="#" className="signup-link">Sign up!</a>
          </p>
        </div>

        <footer className="login-footer">
          © 2023 Handela Voyages. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default Login;
