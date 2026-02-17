import { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { mockPrescriptions } from '../utils/mockData';
import '../styles/Prescriptions.css';

function Prescriptions({ onNavigate }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="prescriptions">
        <div className="prescriptions-container">
          <div className="not-logged-in">
            <h2>Please log in to view your prescriptions</h2>
            <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredPrescriptions = filterStatus === 'all'
    ? mockPrescriptions
    : mockPrescriptions.filter(p => p.status === filterStatus);

  return (
    <div className="prescriptions">
      <div className="prescriptions-container">
        <div className="prescriptions-header">
          <div>
            <h1>Prescription History</h1>
            <p>View and manage your medications</p>
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="prescriptions-content">
          {filteredPrescriptions.length > 0 ? (
            <div className="prescriptions-list">
              {filteredPrescriptions.map((prescription) => (
                <div key={prescription.id} className={`prescription-card ${prescription.status}`}>
                  <div className="prescription-header">
                    <div className="medication-info">
                      <h3>{prescription.medication}</h3>
                      <span className={`status-badge ${prescription.status}`}>
                        {prescription.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                    <div className="dosage-info">
                      <span className="dosage">{prescription.dosage}</span>
                      <span className="frequency">{prescription.frequency}</span>
                    </div>
                  </div>

                  <div className="prescription-body">
                    <div className="info-row">
                      <span className="info-label">Prescribed by:</span>
                      <span className="info-value">{prescription.prescribedBy}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Date Prescribed:</span>
                      <span className="info-value">{new Date(prescription.prescribedDate).toLocaleDateString()}</span>
                    </div>
                    {prescription.status === 'active' && (
                      <div className="info-row">
                        <span className="info-label">Refills Remaining:</span>
                        <span className="info-value refills">{prescription.refillsRemaining}</span>
                      </div>
                    )}
                    <div className="instructions">
                      <span className="info-label">Instructions:</span>
                      <p>{prescription.instructions}</p>
                    </div>
                  </div>

                  {prescription.status === 'active' && (
                    <div className="prescription-actions">
                      <button className="btn-refill">Request Refill</button>
                      <button className="btn-contact">Contact Pharmacist</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-prescriptions">
              <div className="no-data-icon">💊</div>
              <p>No {filterStatus !== 'all' ? filterStatus : ''} prescriptions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prescriptions;
