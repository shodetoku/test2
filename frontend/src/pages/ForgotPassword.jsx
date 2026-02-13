import { useState } from 'react';
import '../styles/ForgotPassword.css';

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    alert(`Password reset link sent to: ${email}`);
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-left">
          <div className="forgot-password-logo">
            <div className="logo-icon">
              <span>🏥</span>
            </div>
            <span className="logo-text">LOGO</span>
          </div>

          <h1>Reset Your Password</h1>
          <p className="forgot-password-description">
            Access your medical records, manage appointments, and connect with your doctors securely.
          </p>

          <div className="doctor-image">
            <img
              src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Doctor with phone"
            />
          </div>
        </div>

        <div className="forgot-password-right">
          <div className="forgot-password-form-container">
            <h2>Forgot Your Password?</h2>
            <p className="form-subtitle">
              {submitted
                ? 'Check your email for a password reset link'
                : 'Enter your email address and we\'ll send you a link to reset your password.'}
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
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

                <button type="submit" className="btn-reset">
                  Send Reset Link →
                </button>

                <p className="back-to-login">
                  Remember your password?{' '}
                  <a href="#" onClick={() => onNavigate('login')}>
                    Back to login
                  </a>
                </p>
              </form>
            ) : (
              <div className="success-message">
                <div className="checkmark">✓</div>
                <p>We've sent a password reset link to <strong>{email}</strong></p>
                <p className="hint">Check your email (and spam folder) for the reset link. The link will expire in 24 hours.</p>
                <button
                  type="button"
                  className="btn-back"
                  onClick={() => onNavigate('login')}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
