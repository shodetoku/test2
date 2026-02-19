import { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import '../styles/PatientProfile.css';

function PatientProfile({ onNavigate }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return (
      <div className="patient-profile-container">
        <Sidebar />
        <div className="patient-profile-main">
          <div className="not-logged-in">
            <h2>Please log in to view your profile</h2>
            <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-profile-container">
      <Sidebar />
      <div className="patient-profile-main">
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header-section">
              <div className="profile-avatar-large">
                <div className="avatar-image">
                  <span className="avatar-initials">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                </div>
                <div className="status-indicator active"></div>
              </div>
              <div className="profile-info-header">
                <span className="status-badge active-patient">ACTIVE PATIENT</span>
                <h1 className="patient-name">{user.firstName} {user.lastName}</h1>
                <div className="patient-meta">
                  <span className="patient-id">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="3" width="12" height="10" rx="1" stroke="#10b981" strokeWidth="1.5"/>
                      <path d="M5 3V2M11 3V2" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    ID: #PAVC500021
                  </span>
                  <span className="last-update">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="#9ca3af" strokeWidth="1.5"/>
                      <path d="M8 5v3l2 2" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Last Update: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <button className="btn-view-only">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 6.5C11.6569 6.5 13 7.84315 13 9.5C13 11.1569 11.6569 12.5 10 12.5C8.34315 12.5 7 11.1569 7 9.5C7 7.84315 8.34315 6.5 10 6.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 9.5C2 9.5 4.5 4 10 4C15.5 4 18 9.5 18 9.5C18 9.5 15.5 15 10 15C4.5 15 2 9.5 2 9.5Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                View Profile Only
              </button>
            </div>
          </div>

          <div className="details-card">
            <div className="section-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="6" r="3" stroke="#10b981" strokeWidth="1.5"/>
                <path d="M4 17C4 13.6863 6.68629 11 10 11C13.3137 11 16 13.6863 16 17" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <h2>Personal Details</h2>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <label>FULL NAME</label>
                <p className="detail-value">{user.firstName} {user.lastName}</p>
              </div>
              <div className="detail-item">
                <label>DATE OF BIRTH</label>
                <p className="detail-value">{user.dateOfBirth || 'October 24, 1989'} (34y)</p>
              </div>
              <div className="detail-item">
                <label>GENDER</label>
                <p className="detail-value">{user.gender || 'Male'}</p>
              </div>
              <div className="detail-item">
                <label>PHONE NUMBER</label>
                <p className="detail-value">{user.phone || '+44 7700 900077'}</p>
              </div>
              <div className="detail-item full-width">
                <label>EMAIL ADDRESS</label>
                <p className="detail-value">{user.email}</p>
              </div>
              <div className="detail-item full-width">
                <label>HOME ADDRESS</label>
                <p className="detail-value">{user.address || '123 Garrison Lane, Small Heath, Birmingham, B10 0AA, UK'}</p>
              </div>
            </div>
          </div>

          <div className="details-card emergency-card">
            <div className="section-header emergency-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <h2>Emergency Contact</h2>
            </div>

            <div className="emergency-details">
              <div className="emergency-item">
                <div className="emergency-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="#9ca3af" strokeWidth="2"/>
                    <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="emergency-info">
                  <label>CONTACT NAME</label>
                  <p>{user.emergencyContact?.name || 'Polly Gray'}</p>
                </div>
              </div>
              <div className="emergency-item">
                <div className="emergency-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 16.7909 15.2091 15 13 15H11C8.79086 15 7 16.7909 7 19V21" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="8" r="4" stroke="#9ca3af" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="emergency-info">
                  <label>RELATIONSHIP</label>
                  <p>{user.emergencyContact?.relationship || 'Aunt / Guardian'}</p>
                </div>
              </div>
              <div className="emergency-item">
                <div className="emergency-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#9ca3af" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="emergency-info">
                  <label>PHONE NUMBER</label>
                  <p>{user.emergencyContact?.phone || '+44 7700 900555'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="details-card medical-card">
            <div className="section-header medical-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 3H13L17 7V17H3V3Z" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M13 3V7H17" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <h2>Medical History Summary</h2>
            </div>

            <div className="medical-content">
              <div className="medical-section">
                <label className="medical-label">CHRONIC CONDITIONS</label>
                <div className="tags-group">
                  <span className="tag condition-tag">Hypertension</span>
                  <span className="tag condition-tag">Type 2 Diabetes</span>
                </div>
              </div>

              <div className="medical-section">
                <label className="medical-label">ALLERGIES</label>
                <div className="tags-group">
                  <span className="tag allergy-tag">Penicillin</span>
                  <span className="tag allergy-tag">Peanuts</span>
                </div>
              </div>

              <div className="medical-section">
                <label className="medical-label">PAST SURGERIES</label>
                <div className="surgery-list">
                  <div className="surgery-item">
                    <div className="surgery-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="surgery-details">
                      <h4>Appendectomy</h4>
                      <p>Birmingham General Hospital - June 2015</p>
                    </div>
                  </div>
                  <div className="surgery-item">
                    <div className="surgery-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="surgery-details">
                      <h4>Left Knee Arthroscopy</h4>
                      <p>St. Andrews Medical Center - March 2019</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="readonly-notice">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="7" width="12" height="10" rx="1" stroke="#3b82f6" strokeWidth="1.5"/>
              <path d="M7 7V5C7 3.34315 8.34315 2 10 2C11.6569 2 13 3.34315 13 5V7" stroke="#3b82f6" strokeWidth="1.5"/>
            </svg>
            <p>This patient profile is in Read-Only Mode. For your security and the integrity of medical records, direct modification of this information is restricted to authorized healthcare providers. If updates are required, please contact your clinic's registrar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
