import '../styles/AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Our Hospital & Pharmacy Appointment System</h1>
          <p className="hero-subtitle">
            Making healthcare simple, fast, and accessible for everyone
          </p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="section-image">
            <img
              src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Healthcare professionals"
            />
          </div>
          <div className="section-text">
            <h2>Our Mission</h2>
            <p>
              Our Hospital & Pharmacy Appointment System is designed to make healthcare simple, fast, and accessible.
              Patients can easily schedule appointments with doctors, check available times, and manage prescriptions online.
            </p>
            <p>
              We believe that access to quality healthcare should be seamless and stress-free. Our platform bridges
              the gap between patients and healthcare providers, ensuring that everyone receives timely medical attention.
            </p>
          </div>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Online Appointment Booking</h3>
              <p>
                Schedule appointments for hospital consultations and pharmacy pickups with just a few clicks.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <h3>Real-time Notifications</h3>
              <p>
                Stay updated with instant notifications about appointment confirmations, reminders, and changes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Secure Data Management</h3>
              <p>
                Your medical records and personal information are protected with industry-standard security.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3>User-friendly Interface</h3>
              <p>
                Intuitive design for both patients and staff, making healthcare management effortless.
              </p>
            </div>
          </div>
        </section>

        <section className="goal-section">
          <div className="goal-content">
            <h2>Our Goal</h2>
            <p>
              Streamline healthcare services, reduce waiting times, and improve patient experience through
              innovative technology and compassionate care.
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Patients</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Healthcare Professionals</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Compassion</h3>
              <p>We treat every patient with empathy, respect, and understanding.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>We continuously improve our technology to serve you better.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Accessibility</h3>
              <p>Healthcare should be available to everyone, anytime, anywhere.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3>Excellence</h3>
              <p>We strive for the highest standards in medical care and service.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
