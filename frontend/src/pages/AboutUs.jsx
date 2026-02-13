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
                <span>📅</span>
              </div>
              <h3>Online Appointment Booking</h3>
              <p>
                Schedule appointments for hospital consultations and pharmacy pickups with just a few clicks.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>🔔</span>
              </div>
              <h3>Real-time Notifications</h3>
              <p>
                Stay updated with instant notifications about appointment confirmations, reminders, and changes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>🔒</span>
              </div>
              <h3>Secure Data Management</h3>
              <p>
                Your medical records and personal information are protected with industry-standard security.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <span>💻</span>
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
              <h3>Compassion</h3>
              <p>We treat every patient with empathy, respect, and understanding.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continuously improve our technology to serve you better.</p>
            </div>
            <div className="value-card">
              <h3>Accessibility</h3>
              <p>Healthcare should be available to everyone, anytime, anywhere.</p>
            </div>
            <div className="value-card">
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
