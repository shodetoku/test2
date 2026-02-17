import { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/auth';
import { getFromStorage } from '../utils/storage';
import { mockAppointments, mockLabResults, mockHealthAlerts } from '../utils/mockData';
import '../styles/PatientDashboard.css';

function PatientDashboard({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [recentLabResults, setRecentLabResults] = useState([]);
  const [healthAlerts, setHealthAlerts] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const userAppointments = getFromStorage('appointments') || mockAppointments;
    const upcoming = userAppointments
      .filter(apt => apt.status === 'confirmed' && new Date(apt.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    setNextAppointment(upcoming);

    setRecentLabResults(mockLabResults.slice(0, 2));
    setHealthAlerts(mockHealthAlerts);
  }, []);

  if (!user) {
    return (
      <div className="patient-dashboard">
        <div className="dashboard-container">
          <div className="not-logged-in">
            <h2>Please log in to view your dashboard</h2>
            <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user.firstName}!</h1>
            <p className="dashboard-subtitle">Here's your health overview</p>
          </div>
          <button className="btn-new-appointment" onClick={() => onNavigate('book-appointment')}>
            Book New Appointment
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card next-appointment-card">
            <div className="card-header">
              <h3>Next Appointment</h3>
              <span className="card-icon">📅</span>
            </div>
            {nextAppointment ? (
              <div className="appointment-details">
                <div className="appointment-info">
                  <div className="info-row">
                    <span className="label">Department:</span>
                    <span className="value">{nextAppointment.department}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Doctor:</span>
                    <span className="value">{nextAppointment.doctor}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Date:</span>
                    <span className="value">{new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Time:</span>
                    <span className="value">{nextAppointment.time}</span>
                  </div>
                </div>
                <button className="btn-view-details" onClick={() => onNavigate('appointments')}>
                  View All Appointments
                </button>
              </div>
            ) : (
              <div className="no-data">
                <p>No upcoming appointments</p>
                <button className="btn-secondary" onClick={() => onNavigate('book-appointment')}>
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          <div className="dashboard-card lab-results-card">
            <div className="card-header">
              <h3>Recent Lab Results</h3>
              <span className="card-icon">🔬</span>
            </div>
            <div className="lab-results-list">
              {recentLabResults.map((result) => (
                <div key={result.id} className="lab-result-item">
                  <div className="lab-info">
                    <h4>{result.testName}</h4>
                    <p className="lab-date">{new Date(result.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`lab-status ${result.normalRange ? 'normal' : 'abnormal'}`}>
                    {result.normalRange ? 'Normal' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-view-all" onClick={() => onNavigate('medical-records')}>
              View All Records
            </button>
          </div>

          <div className="dashboard-card alerts-card">
            <div className="card-header">
              <h3>Health Alerts & Reminders</h3>
              <span className="card-icon">🔔</span>
            </div>
            <div className="alerts-list">
              {healthAlerts.map((alert) => (
                <div key={alert.id} className={`alert-item priority-${alert.priority}`}>
                  <div className="alert-icon">
                    {alert.type === 'reminder' ? '⏰' : '⚠️'}
                  </div>
                  <div className="alert-content">
                    <h4>{alert.title}</h4>
                    <p>{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card quick-actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
              <span className="card-icon">⚡</span>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={() => onNavigate('prescriptions')}>
                <span className="action-icon">💊</span>
                <span>Prescriptions</span>
              </button>
              <button className="quick-action-btn" onClick={() => onNavigate('billing')}>
                <span className="action-icon">💳</span>
                <span>Billing</span>
              </button>
              <button className="quick-action-btn" onClick={() => onNavigate('profile-settings')}>
                <span className="action-icon">⚙️</span>
                <span>Settings</span>
              </button>
              <button className="quick-action-btn" onClick={() => onNavigate('medical-records')}>
                <span className="action-icon">📋</span>
                <span>Records</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
