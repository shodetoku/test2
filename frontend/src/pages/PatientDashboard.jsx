import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMap,
  faCreditCard,
  faClock,
  faFileAlt,
  faCircleCheck,
  faFileLines
} from '@fortawesome/free-regular-svg-icons';
import {
  faShieldHalved,
  faFlask,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../utils/auth';
import { getFromStorage } from '../utils/storage';
import { mockAppointments } from '../utils/mockData';
import Sidebar from '../components/Sidebar';
import '../styles/PatientDashboard.css';

function PatientDashboard({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const userAppointments = getFromStorage('appointments') || mockAppointments;
    const upcoming = userAppointments
      .filter(apt => apt.status === 'confirmed' && new Date(apt.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    setNextAppointment(upcoming);
  }, []);

  const labResults = [
    { id: 1, name: 'HbA1c (Glycated Hemoglobin)', date: 'Aug 05, 2024', status: 'Borderline' },
    { id: 2, name: 'Total Cholesterol', date: 'Jul 28, 2024', status: 'Normal' },
    { id: 3, name: 'White Blood Cell Count', date: 'Jul 15, 2024', status: 'Normal' }
  ];

  const billingItems = [
    { id: 1, name: 'General Checkup', date: 'Aug 03, 2024', amount: 'Php 500', status: 'unpaid' },
    { id: 2, name: 'Blood Lab Panel', date: 'Jul 28, 2024', amount: 'Paid', status: 'paid' }
  ];

  const medications = [
    { id: 1, name: 'Lisinopril 10mg', dosage: '1 tablet once daily in the morning', nextRefill: 'Aug 28, 2024' },
    { id: 2, name: 'Metformin 500mg', dosage: '1 tablet twice daily with food', nextRefill: 'Sep 12, 2024' }
  ];

  const medicalHistory = [
    { id: 1, condition: 'Hypertension', description: 'Diagnosed in 2018. Managed with medication and lifestyle changes.' },
    { id: 2, condition: 'Left Wrist Fracture', description: 'Occurred in June 2021. Fully recovered after 8 weeks in cast.' }
  ];

  if (!user) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar />
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
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="patient-dashboard">
        <div className="dashboard-container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
              </div>
              <div className="online-indicator"></div>
            </div>
            <div className="profile-details">
              <h1>{user.firstName} {user.lastName}</h1>
              <p className="patient-id">Patient ID: #PAVC500021</p>
            </div>
          </div>
          <button className="btn-new-appointment" onClick={() => onNavigate('book-appointment')}>
            + New Appointment
          </button>
        </div>

        <div className="patient-info-grid">
          <div className="info-item">
            <span className="info-label">AGE</span>
            <span className="info-value">34 Years</span>
          </div>
          <div className="info-item">
            <span className="info-label">GENDER</span>
            <span className="info-value">{user.gender || 'Male'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">DOB</span>
            <span className="info-value">{user.dateOfBirth || 'Feb 24, 1990'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">HEIGHT / WEIGHT</span>
            <span className="info-value">182cm / 78kg</span>
          </div>
        </div>

        <div className="address-info">
          <FontAwesomeIcon icon={faMap} />
          <span>{user.address || '123 Tandang Sora, Quezon City, Philippines, 1121'}</span>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section lab-results-section">
            <div className="section-header">
              <div className="section-title">
                <FontAwesomeIcon icon={faFlask} className="icon-green" />
                <h3>Laboratory Results</h3>
              </div>
              <button className="view-all-link" onClick={() => onNavigate('medical-records')}>View All</button>
            </div>
            <div className="lab-results-table">
              <div className="table-header">
                <span>Test Name</span>
                <span>Date Performed</span>
                <span>Status</span>
              </div>
              {labResults.map((result) => (
                <div key={result.id} className="table-row">
                  <span className="test-name">{result.name}</span>
                  <span className="test-date">{result.date}</span>
                  <span className={`status-badge ${result.status.toLowerCase()}`}>{result.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="dashboard-section billing-section">
              <div className="section-header">
                <div className="section-title">
                  <FontAwesomeIcon icon={faCreditCard} className="icon-green" />
                  <h3>Billing</h3>
                </div>
                <button className="more-btn">•••</button>
              </div>
              <div className="billing-items">
                {billingItems.map((item) => (
                  <div key={item.id} className="billing-item">
                    <div className="billing-icon">
                      <FontAwesomeIcon icon={faCreditCard} className="icon-green" />
                    </div>
                    <div className="billing-details">
                      <h4>{item.name}</h4>
                      <p>{item.date}</p>
                    </div>
                    <span className={`billing-amount ${item.status}`}>{item.amount}</span>
                  </div>
                ))}
              </div>
              <button className="view-balances-btn" onClick={() => onNavigate('billing')}>View Pending Balances</button>
            </div>

            <div className="dashboard-section insurance-section">
              <div className="section-header">
                <div className="section-title">
                  <FontAwesomeIcon icon={faShieldHalved} className="icon-white" />
                  <h3>Insurance Status</h3>
                </div>
              </div>
              <div className="insurance-details">
                <p className="insurance-label">Provider</p>
                <h4 className="insurance-provider">BlueCross Shield Premier</h4>
                <div className="deductible-info">
                  <div className="deductible-header">
                    <span>Deductible</span>
                    <span className="deductible-amount">$1,450 / $2,000</span>
                  </div>
                  <div className="deductible-bar">
                    <div className="deductible-progress" style={{ width: '72.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {nextAppointment && (
              <div className="dashboard-section next-appointment-section">
                <div className="section-header">
                  <h4 className="appointment-label">NEXT APPOINTMENT</h4>
                </div>
                <div className="appointment-date-badge">
                  <span className="appointment-month">AUG</span>
                  <span className="appointment-day">18</span>
                </div>
                <div className="appointment-details">
                  <h4 className="doctor-name">{nextAppointment.doctor}</h4>
                  <p className="doctor-specialty">{nextAppointment.department}</p>
                  <div className="appointment-time">
                    <FontAwesomeIcon icon={faClock} className="icon-green" />
                    <span>{nextAppointment.time} (CST)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-grid-2">
          <div className="dashboard-section medications-section">
            <div className="section-header">
              <div className="section-title">
                <FontAwesomeIcon icon={faFileLines} className="icon-green" />
                <h3>Medications</h3>
              </div>
              <button className="view-all-link" onClick={() => onNavigate('prescriptions')}>View All</button>
            </div>
            <div className="medications-list">
              {medications.map((med) => (
                <div key={med.id} className="medication-item">
                  <div className="medication-icon">
                    <FontAwesomeIcon icon={faFileLines} className="icon-green" />
                  </div>
                  <div className="medication-details">
                    <h4>{med.name}</h4>
                    <p className="dosage">{med.dosage}</p>
                    <p className="refill-date">Next Refill: {med.nextRefill}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section medical-history-section">
            <div className="section-header">
              <div className="section-title">
                <FontAwesomeIcon icon={faFileAlt} className="icon-green" />
                <h3>Medical History</h3>
              </div>
              <button className="info-btn">
                <FontAwesomeIcon icon={faCircleInfo} />
              </button>
            </div>
            <div className="medical-history-list">
              {medicalHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-icon">
                    <FontAwesomeIcon icon={faCircleCheck} className="icon-green" />
                  </div>
                  <div className="history-details">
                    <h4>{item.condition}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
