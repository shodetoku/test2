import { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { saveToStorage, getFromStorage } from '../utils/storage';
import { mockDepartments, mockDoctors, mockTimeSlots, mockAppointments } from '../utils/mockData';
import '../styles/BookAppointment.css';

function BookAppointment({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Consultation');
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const user = getCurrentUser();

  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    setSelectedDoctor(null);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmAppointment = () => {
    const newAppointment = {
      id: Date.now().toString(),
      patientId: user?.id || '1',
      department: selectedDepartment.name,
      doctor: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      type: appointmentType,
      notes: notes
    };

    const existingAppointments = getFromStorage('appointments') || mockAppointments;
    const updatedAppointments = [...existingAppointments, newAppointment];
    saveToStorage('appointments', updatedAppointments);

    setIsConfirmed(true);
  };

  const filteredDoctors = selectedDepartment
    ? mockDoctors.filter(doc => doc.departmentId === selectedDepartment.id)
    : [];

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!user) {
    return (
      <div className="book-appointment">
        <div className="appointment-container">
          <div className="not-logged-in">
            <h2>Please log in to book an appointment</h2>
            <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="book-appointment">
        <div className="appointment-container">
          <div className="appointment-confirmed">
            <div className="confirmed-icon">
              <div className="checkmark-circle">
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none" />
                  <path fill="none" d="M14 27l7 7 16-16" />
                </svg>
              </div>
            </div>
            <h2>Appointment Confirmed!</h2>
            <div className="confirmed-details">
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{selectedDepartment.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Doctor:</span>
                <span className="detail-value">{selectedDoctor.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{selectedTime}</span>
              </div>
            </div>
            <p className="confirmation-message">
              A confirmation email has been sent to your registered email address. Please arrive 15 minutes before your scheduled time.
            </p>
            <div className="confirmed-actions">
              <button className="btn-dashboard" onClick={() => onNavigate('home')}>
                Go to Dashboard
              </button>
              <button className="btn-view-appointments" onClick={() => onNavigate('appointments')}>
                View All Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-appointment">
      <div className="appointment-container">
        <div className="appointment-header">
          <h1>Book an Appointment</h1>
          <p>Follow the steps to schedule your visit</p>
        </div>

        <div className="appointment-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span className="step-label">Department</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span className="step-label">Doctor</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span className="step-label">Date & Time</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="step-number">4</div>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        <div className="appointment-content">
          {currentStep === 1 && (
            <div className="step-content">
              <h2>Select Department</h2>
              <div className="departments-grid">
                {mockDepartments.map((dept) => (
                  <button
                    key={dept.id}
                    className={`department-card ${selectedDepartment?.id === dept.id ? 'selected' : ''}`}
                    onClick={() => handleDepartmentSelect(dept)}
                  >
                    <span className="dept-icon">{dept.icon}</span>
                    <span className="dept-name">{dept.name}</span>
                    {selectedDepartment?.id === dept.id && (
                      <span className="selected-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <h2>Select Doctor</h2>
              <div className="doctors-list">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <div className="doctor-avatar">👨‍⚕️</div>
                      <div className="doctor-info">
                        <h3>{doctor.name}</h3>
                        <p className="doctor-specialty">{doctor.specialty}</p>
                      </div>
                      {selectedDoctor?.id === doctor.id && (
                        <span className="selected-check">✓</span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="no-doctors">No doctors available for this department</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-content">
              <h2>Select Date & Time</h2>
              <div className="datetime-selection">
                <div className="form-group">
                  <label>Appointment Type</label>
                  <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Checkup">Checkup</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                  />
                </div>

                {selectedDate && (
                  <div className="form-group">
                    <label>Select Time Slot</label>
                    <div className="time-slots-grid">
                      {mockTimeSlots.map((slot) => (
                        <button
                          key={slot}
                          className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea
                    placeholder="Any specific concerns or reasons for your visit..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="4"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-content">
              <h2>Confirm Your Appointment</h2>
              <div className="confirmation-summary">
                <div className="summary-section">
                  <h3>Appointment Details</h3>
                  <div className="summary-row">
                    <span className="summary-label">Department:</span>
                    <span className="summary-value">{selectedDepartment.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Doctor:</span>
                    <span className="summary-value">{selectedDoctor.name}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Appointment Type:</span>
                    <span className="summary-value">{appointmentType}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Date:</span>
                    <span className="summary-value">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Time:</span>
                    <span className="summary-value">{selectedTime}</span>
                  </div>
                  {notes && (
                    <div className="summary-row">
                      <span className="summary-label">Notes:</span>
                      <span className="summary-value">{notes}</span>
                    </div>
                  )}
                </div>

                <div className="summary-section">
                  <h3>Patient Information</h3>
                  <div className="summary-row">
                    <span className="summary-label">Name:</span>
                    <span className="summary-value">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Phone:</span>
                    <span className="summary-value">{user.phone}</span>
                  </div>
                </div>

                <div className="confirmation-note">
                  <p>Please review your appointment details carefully. A confirmation will be sent to your registered email address.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="appointment-navigation">
          {currentStep > 1 && (
            <button className="btn-previous" onClick={handlePreviousStep}>
              ← Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button
              className="btn-next"
              onClick={handleNextStep}
              disabled={
                (currentStep === 1 && !selectedDepartment) ||
                (currentStep === 2 && !selectedDoctor) ||
                (currentStep === 3 && (!selectedDate || !selectedTime))
              }
            >
              Next →
            </button>
          ) : (
            <button
              className="btn-confirm"
              onClick={handleConfirmAppointment}
            >
              Confirm Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
