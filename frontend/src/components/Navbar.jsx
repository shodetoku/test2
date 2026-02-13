import '../styles/Navbar.css';

function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <div className="logo-icon">
            <span>🏥</span>
          </div>
          <span className="logo-text">LOGO</span>
        </div>

        <div className="nav-links">
          <button
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button
            className={currentPage === 'about-us' ? 'active' : ''}
            onClick={() => onNavigate('about-us')}
          >
            About us
          </button>
          <button
            className={currentPage === 'services' ? 'active' : ''}
            onClick={() => onNavigate('services')}
          >
            Services
          </button>
          <button
            className={currentPage === 'contact' ? 'active' : ''}
            onClick={() => onNavigate('contact')}
          >
            Contact
          </button>
        </div>

        <div className="nav-actions">
          <button className="profile-btn" onClick={() => alert('Profile')}>
            <span>👤</span> Profile
          </button>
          <button
            className="appointment-btn"
            onClick={() => onNavigate('intake-form')}
          >
            Make Appointment
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
