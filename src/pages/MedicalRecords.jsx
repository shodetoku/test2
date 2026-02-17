import { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { mockMedicalRecords } from '../utils/mockData';
import '../styles/MedicalRecords.css';

function MedicalRecords({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('summaries');
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="medical-records">
        <div className="records-container">
          <div className="not-logged-in">
            <h2>Please log in to view your medical records</h2>
            <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-records">
      <div className="records-container">
        <div className="records-header">
          <h1>My Medical Records</h1>
          <p>View your health information and history</p>
        </div>

        <div className="records-tabs">
          <button
            className={`tab ${activeTab === 'summaries' ? 'active' : ''}`}
            onClick={() => setActiveTab('summaries')}
          >
            Clinical Summaries
          </button>
          <button
            className={`tab ${activeTab === 'allergies' ? 'active' : ''}`}
            onClick={() => setActiveTab('allergies')}
          >
            Allergies
          </button>
          <button
            className={`tab ${activeTab === 'immunizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('immunizations')}
          >
            Immunizations
          </button>
        </div>

        <div className="records-content">
          {activeTab === 'summaries' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Clinical Summaries</h2>
                <p>Review your past consultations and diagnoses</p>
              </div>
              <div className="summaries-list">
                {mockMedicalRecords.clinicalSummaries.map((summary) => (
                  <div key={summary.id} className="summary-card">
                    <div className="summary-header">
                      <div className="summary-date">
                        <span className="date-icon">📅</span>
                        <span>{new Date(summary.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <span className="summary-doctor">{summary.doctor}</span>
                    </div>
                    <div className="summary-body">
                      <div className="summary-row">
                        <span className="summary-label">Diagnosis:</span>
                        <span className="summary-value">{summary.diagnosis}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Treatment:</span>
                        <span className="summary-value">{summary.treatment}</span>
                      </div>
                      <div className="summary-notes">
                        <span className="summary-label">Notes:</span>
                        <p>{summary.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'allergies' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Allergies</h2>
                <p>Important information about your allergies</p>
              </div>
              <div className="allergies-grid">
                {mockMedicalRecords.allergies.map((allergy) => (
                  <div key={allergy.id} className="allergy-card">
                    <div className="allergy-icon">⚠️</div>
                    <div className="allergy-info">
                      <h3>{allergy.allergen}</h3>
                      <p className="reaction">Reaction: {allergy.reaction}</p>
                      <span className={`severity severity-${allergy.severity.toLowerCase()}`}>
                        {allergy.severity} Severity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {mockMedicalRecords.allergies.length === 0 && (
                <div className="no-data">
                  <p>No allergies recorded</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'immunizations' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Immunizations</h2>
                <p>Track your vaccination history</p>
              </div>
              <div className="immunizations-list">
                {mockMedicalRecords.immunizations.map((immunization) => (
                  <div key={immunization.id} className="immunization-card">
                    <div className="immunization-icon">💉</div>
                    <div className="immunization-info">
                      <h3>{immunization.vaccine}</h3>
                      <div className="immunization-dates">
                        <div className="date-info">
                          <span className="date-label">Administered:</span>
                          <span className="date-value">{new Date(immunization.date).toLocaleDateString()}</span>
                        </div>
                        <div className="date-info">
                          <span className="date-label">Next Due:</span>
                          <span className="date-value">{new Date(immunization.nextDue).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;
