import { useState, useEffect } from 'react';
import { saveToStorage, getFromStorage } from '../utils/storage';
import '../styles/Login.css';

function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

// get the saved email from remember me
  useEffect(() => {
    const savedEmail = getFromStorage('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // i-save ang email kung naka-check ang remember me
    if (rememberMe) {
      saveToStorage('rememberedEmail', email);
    } else {
      saveToStorage('rememberedEmail', null);
    }

    // dito yung login logic (for now, alert lang)
    alert(`Logging in with email: ${email}`);
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
              src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Doctor with phone"
            />
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <h2>Login To Your Account</h2>

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
