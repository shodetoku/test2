import '../styles/Services.css';

function Services() {

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="services-hero-content">
          <h1>Our Services</h1>
          <p>Comprehensive healthcare solutions for you and your family</p>
        </div>
      </div>

      <div className="services-content">
        <section className="services-overview">
          <div className="service-category">
            <div className="category-icon hospital-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h18M8 3v4M16 3v4M3 11h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z"></path>
                <path d="M12 14v4M10 16h4"></path>
              </svg>
            </div>
            <h2>Hospital Services</h2>
            <ul className="service-list">
              <li>Schedule doctor consultations by department (General Medicine, Pediatrics, Cardiology, etc.)</li>
              <li>View available doctors and appointment times</li>
              <li>Receive reminders and notifications for upcoming appointments</li>
              <li>Access to specialized medical departments</li>
            </ul>
          </div>

          <div className="service-category">
            <div className="category-icon pharmacy-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <path d="M9 4v16M15 4v16M4 9h16M4 15h16"></path>
              </svg>
            </div>
            <h2>Pharmacy Services</h2>
            <ul className="service-list">
              <li>Request prescription refills online</li>
              <li>Schedule pharmacy pickups at your convenience</li>
              <li>Check medicine availability in real-time</li>
              <li>Consult pharmacists virtually for advice</li>
            </ul>
          </div>

          <div className="service-category">
            <div className="category-icon additional-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h2>Additional Features</h2>
            <ul className="service-list">
              <li>Patient profiles to track medical history and prescriptions</li>
              <li>Reports and analytics for hospital management</li>
              <li>Integration with payment and insurance systems</li>
              <li>24/7 customer support and assistance</li>
            </ul>
          </div>
        </section>

        <section className="pharmacy-section">
          <h2>Pharmacy Services</h2>
          <div className="pharmacy-actions">
            <div className="pharmacy-card">
              <div className="pharmacy-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                  <path d="M9 4v16M15 4v16M4 9h16M4 15h16"></path>
                </svg>
              </div>
              <h3>Request Prescription Refill</h3>
              <p>Easily request refills for your current prescriptions online</p>
              <button className="btn-pharmacy-action">Request Refill</button>
            </div>

            <div className="pharmacy-card">
              <div className="pharmacy-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3>Check Medicine Availability</h3>
              <p>Search our inventory to see if your medicine is in stock</p>
              <button className="btn-pharmacy-action">Check Availability</button>
            </div>

            <div className="pharmacy-card">
              <div className="pharmacy-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Schedule Pickup</h3>
              <p>Choose a convenient time to pick up your medications</p>
              <button className="btn-pharmacy-action">Schedule Now</button>
            </div>

            <div className="pharmacy-card">
              <div className="pharmacy-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>Consult Pharmacist</h3>
              <p>Get professional advice from our licensed pharmacists</p>
              <button className="btn-pharmacy-action">Start Consultation</button>
            </div>
          </div>
        </section>

        <section className="departments-section">
          <h2>Our Departments</h2>
          <div className="departments-grid">
            <div className="department-card">
              <div className="dept-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
                  <circle cx="20" cy="10" r="2"></circle>
                </svg>
              </div>
              <h3>General Medicine</h3>
              <p>Comprehensive primary care for common health conditions</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path>
                  <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
                </svg>
              </div>
              <h3>Pediatrics</h3>
              <p>Specialized care for infants, children, and adolescents</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Cardiology</h3>
              <p>Expert diagnosis and treatment of heart conditions</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0-5Z"></path>
                  <path d="M7.5 5a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0-5Z"></path>
                </svg>
              </div>
              <h3>Orthopedics</h3>
              <p>Treatment for bone, joint, and muscle problems</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
                </svg>
              </div>
              <h3>Neurology</h3>
              <p>Care for nervous system and brain disorders</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3>Dermatology</h3>
              <p>Treatment for skin, hair, and nail conditions</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Services;
