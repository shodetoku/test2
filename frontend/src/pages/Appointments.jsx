import { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/auth';
import { getFromStorage } from '../utils/storage';
import { mockAppointments } from '../utils/mockData';
import Sidebar from '../components/Sidebar';
import '../styles/Appointments.css';

function Appointments({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const user = getCurrentUser();

  useEffect(() => {
    const storedAppointments = getFromStorage('appointments') || mockAppointments;
    setAppointments(storedAppointments);
  }, []);

  if (!user) {
    return (
      <>
        <Sidebar />
        <div className="appointments">
          <div className="appointments-container">
            <div className="not-logged-in">
              <h2>Please log in to view your appointments</h2>
              <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(apt => apt.status === filterStatus);

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <>
      <Sidebar />
      <div className="appointments">
      <div className="appointments-container">
        <div className="appointments-header">
          <div>
            <h1>My Appointments</h1>
            <p>View and manage your scheduled visits</p>
          </div>
          <button className="btn-new-appointment" onClick={() => onNavigate('book-appointment')}>
            Book New Appointment
          </button>
        </div>

        <div className="filter-section">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>

        <div className="appointments-content">
          {sortedAppointments.length > 0 ? (
            <div className="appointments-list">
              {sortedAppointments.map((appointment) => (
                <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                  <div className="appointment-status-indicator"></div>

                  <div className="appointment-main">
                    <div className="appointment-date-section">
                      <div className="date-box">
                        <span className="date-month">{new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="date-day">{new Date(appointment.date).getDate()}</span>
                        <span className="date-year">{new Date(appointment.date).getFullYear()}</span>
                      </div>
                      <div className="time-info">
                        <span className="time-icon">🕒</span>
                        <span className="time-value">{appointment.time}</span>
                      </div>
                    </div>

                    <div className="appointment-details-section">
                      <div className="appointment-header-info">
                        <h3>{appointment.department}</h3>
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status === 'confirmed' ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>

                      <div className="appointment-info-rows">
                        <div className="info-row">
                          <span className="info-icon">👨‍⚕️</span>
                          <div className="info-content">
                            <span className="info-label">Doctor</span>
                            <span className="info-value">{appointment.doctor}</span>
                          </div>
                        </div>

                        <div className="info-row">
                          <span className="info-icon">📋</span>
                          <div className="info-content">
                            <span className="info-label">Type</span>
                            <span className="info-value">{appointment.type}</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="appointment-notes">
                            <span className="notes-label">Notes:</span>
                            <p>{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="appointment-actions">
                    {appointment.status === 'confirmed' && (
                      <>
                        <button className="btn-reschedule">Reschedule</button>
                        <button className="btn-cancel">Cancel</button>
                      </>
                    )}
                    {appointment.status === 'completed' && (
                      <button className="btn-view-details">View Details</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-appointments">
              <div className="no-data-icon">📅</div>
              <p>No {filterStatus !== 'all' ? filterStatus : ''} appointments found</p>
              <button className="btn-book-now" onClick={() => onNavigate('book-appointment')}>
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Appointments;
