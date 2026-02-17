import { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile } from '../utils/auth';
import '../styles/ProfileSettings.css';

function ProfileSettings({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  });
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: ''
  });
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    smsReminders: true,
    appointmentUpdates: true,
    healthAlerts: true,
    marketingEmails: false
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        gender: currentUser.gender || '',
        address: currentUser.address || ''
      });
      setEmergencyContact(currentUser.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmergencyContactChange = (e) => {
    setEmergencyContact({
      ...emergencyContact,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (setting) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting]
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updates = {
      ...formData,
      emergencyContact
    };
    updateUserProfile(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) {
    return (
      <div className="profile-settings">
        <div className="settings-container">
          <div className="not-logged-in">
            <h2>Please log in to view your profile settings</h2>
            <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Profile Settings</h1>
          <p>Manage your personal information and preferences</p>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <button
              className={`sidebar-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <span className="tab-icon">👤</span>
              <span>Personal Info</span>
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveTab('emergency')}
            >
              <span className="tab-icon">🚨</span>
              <span>Emergency Contact</span>
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="tab-icon">🔔</span>
              <span>Notifications</span>
            </button>
          </div>

          <div className="settings-content">
            {saved && (
              <div className="save-notification">
                <span className="success-icon">✓</span>
                Settings saved successfully!
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Personal Information</h2>
                  <p>Update your personal details</p>
                </div>

                <form onSubmit={handleSave} className="settings-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Juan"
                      />
                    </div>
                    <div className="form-field">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Cruz"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="form-field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+639123456789"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, Quezon City"
                      rows="3"
                    />
                  </div>

                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Emergency Contact</h2>
                  <p>Person to contact in case of emergency</p>
                </div>

                <form onSubmit={handleSave} className="settings-form">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={emergencyContact.name}
                      onChange={handleEmergencyContactChange}
                      placeholder="Maria Cruz"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Relationship</label>
                      <input
                        type="text"
                        name="relationship"
                        value={emergencyContact.relationship}
                        onChange={handleEmergencyContactChange}
                        placeholder="Wife, Mother, Friend, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={emergencyContact.phone}
                        onChange={handleEmergencyContactChange}
                        placeholder="+639987654321"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Notification Preferences</h2>
                  <p>Choose how you want to receive updates</p>
                </div>

                <div className="notifications-settings">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Email Reminders</h4>
                      <p>Receive appointment reminders via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailReminders}
                        onChange={() => handleNotificationChange('emailReminders')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>SMS Reminders</h4>
                      <p>Receive appointment reminders via SMS</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.smsReminders}
                        onChange={() => handleNotificationChange('smsReminders')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Appointment Updates</h4>
                      <p>Get notified about changes to your appointments</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.appointmentUpdates}
                        onChange={() => handleNotificationChange('appointmentUpdates')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Health Alerts</h4>
                      <p>Receive important health alerts and reminders</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.healthAlerts}
                        onChange={() => handleNotificationChange('healthAlerts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Marketing Emails</h4>
                      <p>Receive promotional offers and health tips</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.marketingEmails}
                        onChange={() => handleNotificationChange('marketingEmails')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button onClick={handleSave} className="btn-save">
                  Save Preferences
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
