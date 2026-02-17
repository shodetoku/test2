import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">
              <span>🏥</span>
            </div>
            <span className="logo-text">LOGO</span>
          </div>
          <p className="footer-description">
            Providing compassionate, modern healthcare services for you and your family. Your health is our priority.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#">Book Appointment</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li>General Consultation</li>
            <li>Pediatrics</li>
            <li>Cardiology</li>
            <li>Laboratory Services</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>📍 123 Health Avenue, Medical District</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>📧 contact@clinic.com</p>
            <p>🕐 Mon - Sat: 8:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Clinic Management System. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
