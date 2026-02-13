import { useState } from 'react';
import '../styles/ChangePassword.css';

function ChangePassword({ onNavigate }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChangePassword = (e) => {
    e.preventDefault();

    // dito yung logic para change password (for now, alert lang)
    if (oldPassword && newPassword) {
      alert('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-container">
        <div className="change-password-left">
          <div className="change-password-logo">
            <div className="logo-icon">
              <span>🏥</span>
            </div>
            <span className="logo-text">LOGO</span>
          </div>

          <h1>Welcome Back!</h1>
          <p className="change-password-description">
            Access your medical records, manage appointments, and connect with your doctors securely.
          </p>

          <div className="doctor-image">
            <img
              src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Doctor with phone"
            />
          </div>
        </div>

        <div className="change-password-right">
          <div className="change-password-form-container">
            <h2>Change you Password</h2>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              </div>

              <button type="submit" className="btn-change-password">
                Change Password →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
