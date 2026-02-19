import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHospital,
  faChartBar,
  faUser,
  faCalendarCheck,
  faClipboard,
  faCreditCard,
  faCalendar,
  faFileLines
} from '@fortawesome/free-regular-svg-icons';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: faHospital, path: '/dashboard', label: 'Dashboard' },
    { id: 'overview', icon: faChartBar, path: '/dashboard/overview', label: 'Overview' },
    { id: 'profile', icon: faUser, path: '/dashboard/profile', label: 'Profile' },
    { id: 'calendar', icon: faCalendar, path: '/calendar', label: 'Calendar' },
    { id: 'appointments', icon: faCalendarCheck, path: '/appointments', label: 'Appointments' },
    { id: 'records', icon: faClipboard, path: '/medical-records', label: 'Records' },
    { id: 'lab-results', icon: faFlask, path: '/lab-results', label: 'Lab Results' },
    { id: 'prescriptions', icon: faFileLines, path: '/prescriptions', label: 'Prescriptions' },
    { id: 'billing', icon: faCreditCard, path: '/billing', label: 'Billing' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
