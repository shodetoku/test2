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
            <div className="category-icon hospital-icon">🏥</div>
            <h2>Hospital Services</h2>
            <ul className="service-list">
              <li>Schedule doctor consultations by department (General Medicine, Pediatrics, Cardiology, etc.)</li>
              <li>View available doctors and appointment times</li>
              <li>Receive reminders and notifications for upcoming appointments</li>
              <li>Access to specialized medical departments</li>
            </ul>
          </div>

          <div className="service-category">
            <div className="category-icon pharmacy-icon">💊</div>
            <h2>Pharmacy Services</h2>
            <ul className="service-list">
              <li>Request prescription refills online</li>
              <li>Schedule pharmacy pickups at your convenience</li>
              <li>Check medicine availability in real-time</li>
              <li>Consult pharmacists virtually for advice</li>
            </ul>
          </div>

          <div className="service-category">
            <div className="category-icon additional-icon">✨</div>
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
              <div className="pharmacy-card-icon">💊</div>
              <h3>Request Prescription Refill</h3>
              <p>Easily request refills for your current prescriptions online</p>
              <button className="btn-pharmacy-action">Request Refill</button>
            </div>

            <div className="pharmacy-card">
              <div className="pharmacy-card-icon">🔍</div>
              <h3>Check Medicine Availability</h3>
              <p>Search our inventory to see if your medicine is in stock</p>
              <button className="btn-pharmacy-action">Check Availability</button>
            </div>

            <div className="pharmacy-card">
              <div className="pharmacy-card-icon">📅</div>
              <h3>Schedule Pickup</h3>
              <p>Choose a convenient time to pick up your medications</p>
              <button className="btn-pharmacy-action">Schedule Now</button>
            </div>

            <div className="pharmacy-card">
              <div className="pharmacy-card-icon">💬</div>
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
              <div className="dept-icon">🩺</div>
              <h3>General Medicine</h3>
              <p>Comprehensive primary care for common health conditions</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">👶</div>
              <h3>Pediatrics</h3>
              <p>Specialized care for infants, children, and adolescents</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">❤️</div>
              <h3>Cardiology</h3>
              <p>Expert diagnosis and treatment of heart conditions</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">🦴</div>
              <h3>Orthopedics</h3>
              <p>Treatment for bone, joint, and muscle problems</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">🧠</div>
              <h3>Neurology</h3>
              <p>Care for nervous system and brain disorders</p>
            </div>
            <div className="department-card">
              <div className="dept-icon">👁️</div>
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
