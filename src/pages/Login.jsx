import { useState, useEffect } from 'react';
import { login } from '../utils/auth';
import { saveToStorage, getFromStorage } from '../utils/storage';
import '../styles/Login.css';

function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedEmail = getFromStorage('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const result = login(email, password);

    if (result.success) {
      if (rememberMe) {
        saveToStorage('rememberedEmail', email);
      } else {
        saveToStorage('rememberedEmail', null);
      }
      onNavigate('home');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo">
            <div className="logo-icon">
              <span>🏥</span>
            </div>
            <span className="logo-text">LOGO</span>
          </div>

          <h1>Welcome Back!</h1>
          <p className="login-description">
            Access your medical records, manage appointments, and connect with your doctors securely.
          </p>

          <div className="doctor-image">
            <img
              src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Doctor with phone"
            />
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <h2>Login To Your Account</h2>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="demo-credentials">
              <p><strong>Demo Credentials:</strong></p>
              <p>Email: patient@example.com</p>
              <p>Password: password123</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  onNavigate('forgot-password');
                }} className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-login">
                Log in →
              </button>

              <p className="register-link">
                Don't have an account?{' '}
                <a href="#" onClick={() => onNavigate('intake-form')}>
                  Register now
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
