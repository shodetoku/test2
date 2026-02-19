import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import '../styles/PatientCalendar.css';

function PatientCalendar({ onNavigate }) {
  const user = getCurrentUser();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 18));
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [reasonForVisit, setReasonForVisit] = useState('General Consultation');
  const [notes, setNotes] = useState('');

  if (!user) {
    return (
      <div className="calendar-wrapper">
        <Sidebar />
        <div className="patient-calendar">
          <div className="calendar-container">
            <div className="not-logged-in">
              <h2>Please log in to access the calendar</h2>
              <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const isSameDate = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleConfirmBooking = () => {
    alert('Booking confirmed! This is a demo without backend.');
  };

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = isSameDate(date, selectedDate);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-wrapper">
      <Sidebar />
      <div className="patient-calendar">
        <div className="calendar-container">
          <div className="patient-header">
            <div className="patient-info">
              <div className="patient-avatar">
                <div className="avatar-circle">
                  <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
                </div>
                <div className="online-indicator"></div>
              </div>
              <div className="patient-details">
                <h1>{user.firstName} {user.lastName}</h1>
                <p className="patient-id">
                  <FontAwesomeIcon icon={faCalendar} className="icon-green" />
                  Patient ID: #PAVK500021
                </p>
              </div>
            </div>
          </div>

          <div className="calendar-content">
            <div className="calendar-section">
              <div className="calendar-header">
                <div className="calendar-title">
                  <FontAwesomeIcon icon={faCalendar} className="icon-green" />
                  <h2>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
                </div>
                <div className="calendar-nav">
                  <button onClick={handlePreviousMonth} className="nav-btn">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button onClick={handleNextMonth} className="nav-btn">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>

              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  <div className="weekday">SUN</div>
                  <div className="weekday">MON</div>
                  <div className="weekday">TUE</div>
                  <div className="weekday">WED</div>
                  <div className="weekday">THU</div>
                  <div className="weekday">FRI</div>
                  <div className="weekday">SAT</div>
                </div>
                <div className="calendar-days">
                  {renderCalendarDays()}
                </div>
              </div>

              <div className="notes-section">
                <h3>Add Notes</h3>
                <textarea
                  placeholder="Any additional information for your visit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="5"
                />
              </div>
            </div>

            <div className="booking-summary">
              <h2>Booking Summary</h2>

              <div className="summary-item">
                <div className="summary-icon">
                  <FontAwesomeIcon icon={faCalendar} className="icon-green" />
                </div>
                <div className="summary-details">
                  <span className="summary-label">DATE</span>
                  <span className="summary-value">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="summary-item">
                <div className="summary-icon">
                  <FontAwesomeIcon icon={faClock} className="icon-green" />
                </div>
                <div className="summary-details">
                  <span className="summary-label">TIME</span>
                  <span className="summary-value">{selectedTime} (CST)</span>
                </div>
              </div>

              <div className="reason-section">
                <label>REASON FOR VISIT</label>
                <select
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                >
                  <option value="General Consultation">General Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Lab Results">Lab Results</option>
                </select>
              </div>

              <button className="btn-confirm-booking" onClick={handleConfirmBooking}>
                Confirm Booking
              </button>

              <p className="booking-policy">
                By booking, you agree to our cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientCalendar;
