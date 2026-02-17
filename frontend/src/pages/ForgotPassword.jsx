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
      <div className="forgot-password-card">
        {!submitted ? (
          <>
            <div className="card-logo">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z" fill="#10b981"/>
                </svg>
              </div>
            </div>

            <h1>Forgot Password?</h1>
            <p className="card-description">
              Enter your email address and we'll send you a link to reset your password.
            </p>

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

              <button type="submit" className="btn-reset-password">
                Reset Password
              </button>

              <p className="back-to-login">
                Remember your password?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>
                  Back to login
                </a>
              </p>
            </form>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon-wrapper">
              <div className="checkmark-circle">
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none" />
                  <path fill="none" d="M14 27l7 7 16-16" />
                </svg>
              </div>
            </div>
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to</p>
            <p className="email-sent"><strong>{email}</strong></p>
            <p className="hint">Check your email and spam folder. The link will expire in 24 hours.</p>
            <button
              type="button"
              className="btn-back-login"
              onClick={() => onNavigate('login')}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
