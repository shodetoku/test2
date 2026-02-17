import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, logout } from '../utils/auth';
import '../styles/Navbar.css';

function Navbar({ currentPage, onNavigate }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getCurrentUser());
  }, [currentPage]);

  const activeKey = currentPage ? (currentPage === 'landing' ? 'home' : currentPage) : 'home';

  const navigate = (dest) => {
    setShowDropdown(false);
    if (typeof onNavigate === 'function') onNavigate(dest);
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    setShowDropdown(false);
    navigate('home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">🏥</div>
          <span className="logo-text">LOGO</span>
        </div>

        <div className="nav-links">
          <button className={activeKey === 'home' ? 'active' : ''} onClick={() => navigate('home')}>Home</button>
          <button className={activeKey === 'about' ? 'active' : ''} onClick={() => navigate('about')}>About us</button>
          <button className={activeKey === 'services' ? 'active' : ''} onClick={() => navigate('services')}>Services</button>
          <button className={activeKey === 'contact' ? 'active' : ''} onClick={() => navigate('contact')}>Contact</button>
        </div>

        <div className="nav-actions">
          {authenticated && user ? (
            <>
              <div className="user-menu">
                <button className="user-btn" onClick={() => setShowDropdown(!showDropdown)}>
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user.firstName}</span>
                  <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('home'); }}>📊 Dashboard</button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('appointments'); }}>📅 Appointments</button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('medical-records'); }}>📋 Medical Records</button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('prescriptions'); }}>💊 Prescriptions</button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('billing'); }}>💳 Billing</button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('profile-settings'); }}>⚙️ Settings</button>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout" onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>

              <button className={`appointment-btn ${activeKey === 'book-appointment' ? 'active' : ''}`} onClick={() => navigate('book-appointment')}>Book Appointment</button>
            </>
          ) : (
            <>
              <button className={`profile-btn ${activeKey === 'login' ? 'active' : ''}`} onClick={() => navigate('login')}>
                <span>👤</span>
                <span style={{ marginLeft: 6 }}>Login</span>
              </button>
              <button className={`appointment-btn ${activeKey === 'intake' ? 'active' : ''}`} onClick={() => navigate('intake')}>Make Appointment</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
