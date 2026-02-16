import '../styles/Navbar.css';

function Navbar({ onNavigate, onAppointmentClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <span>🏥</span>
          </div>
          <span className="logo-text">LOGO</span>
        </div>

        <div className="nav-links">
          <button onClick={() => onNavigate('home')}>
            Home
          </button>
          <button onClick={() => onNavigate('about')}>
            About us
          </button>
          <button onClick={() => onNavigate('services')}>
            Services
          </button>
          <button onClick={() => onNavigate('contact')}>
            Contact
          </button>
        </div>

        <div className="nav-actions">
          <button className="login-btn" onClick={() => onNavigate('login')}>
            <span className="login-icon">👤</span>
            Login
          </button>
          <button
            className="appointment-btn"
            onClick={onAppointmentClick}
          >
            Make Appointment
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
