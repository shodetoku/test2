import { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>Have questions or need support? We're here to help!</p>
        </div>
      </div>

      <div className="contact-content">
        <section className="contact-info-section">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>support@hospitalpharmacyapp.com</p>
              <a href="mailto:support@hospitalpharmacyapp.com" className="contact-link">
                Send an Email
              </a>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p>+1 (123) 456-7890</p>
              <a href="tel:+11234567890" className="contact-link">
                Call Us
              </a>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">📍</div>
              <h3>Address</h3>
              <p>123 Health Avenue</p>
              <p>Quezon City, Country</p>
              <a href="#" className="contact-link">
                Get Directions
              </a>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">🕐</div>
              <h3>Business Hours</h3>
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 4:00 PM</p>
              <p className="closed">Sunday: Closed</p>
            </div>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible</p>
            </div>

            {submitted ? (
              <div className="success-notification">
                <div className="success-icon">✓</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll respond to your inquiry within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (123) 456-7890"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Subject <span className="required">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="appointment">Appointment Inquiry</option>
                      <option value="prescription">Prescription Refill</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-submit">
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="contact-sidebar">
            <div className="sidebar-card">
              <h3>Need Immediate Help?</h3>
              <p>For urgent medical concerns, please call our emergency hotline:</p>
              <a href="tel:911" className="emergency-number">
                911
              </a>
            </div>

            <div className="sidebar-card">
              <h3>Frequently Asked Questions</h3>
              <ul className="faq-list">
                <li>
                  <a href="#">How do I book an appointment?</a>
                </li>
                <li>
                  <a href="#">Can I cancel my appointment?</a>
                </li>
                <li>
                  <a href="#">How do I request a prescription refill?</a>
                </li>
                <li>
                  <a href="#">What payment methods do you accept?</a>
                </li>
              </ul>
            </div>

            <div className="sidebar-card">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>

        <section className="map-section">
          <h2>Find Us</h2>
          <div className="map-placeholder">
            <div className="map-icon">🗺️</div>
            <p>123 Health Avenue, Quezon City</p>
            <button className="btn-directions">Get Directions</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
