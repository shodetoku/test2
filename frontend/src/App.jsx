import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import { ROUTES, SECTIONS, NAV_KEY_TO_ROUTE, PATH_TO_NAV_KEY } from './routes/config';
import ProtectedRoute from './routes/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Contact from './pages/Contact';
import IntakeForm from './pages/IntakeForm';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/PatientProfile';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Prescriptions from './pages/Prescriptions';
import BillingEnhanced from './pages/BillingEnhanced';
import LaboratoryResults from './pages/LaboratoryResults';
import ProfileSettings from './pages/ProfileSettings';
import BookAppointment from './pages/BookAppointment';
import PatientCalendar from './pages/PatientCalendar';

import './index.css';

function useActiveSection(pathname) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [pathname]);

  return activeSection;
}

function getCurrentNavKey(pathname, activeSection) {
  if (pathname === '/') return activeSection;
  const match = PATH_TO_NAV_KEY.find(({ prefix }) => pathname.startsWith(prefix));
  return match ? match.key : 'home';
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const activeSection = useActiveSection(pathname);

  useEffect(() => {
    if (pathname === '/' && isAuthenticated()) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [pathname, navigate]);

  const handleNavigate = useCallback((dest) => {
    if (!dest) return;

    if (dest === 'book-appointment') {
      if (isAuthenticated()) {
        navigate(ROUTES.BOOK_APPOINTMENT);
      } else {
        setShowModal(true);
      }
      return;
    }

    if (dest === 'home') {
      if (isAuthenticated()) {
        navigate(ROUTES.DASHBOARD);
        return;
      }
    }

    if (SECTIONS.includes(dest)) {
      if (pathname !== '/') {
        navigate(ROUTES.HOME);
        setTimeout(() => scrollToSection(dest), 100);
      } else {
        scrollToSection(dest);
      }
      return;
    }

    const route = NAV_KEY_TO_ROUTE[dest] ?? `/${dest}`;
    navigate(route);
  }, [pathname, navigate]);

  const triggerNotification = (type) => {
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleFirstTime = () => {
    setShowModal(false);
    navigate(ROUTES.INTAKE);
  };

  const handleReturning = () => {
    setShowModal(false);
    navigate(ROUTES.LOGIN);
  };

  const handleIntakeFormComplete = (isCompleted) => {
    navigate(ROUTES.HOME);
    if (isCompleted) triggerNotification('intake');
  };

  const handleLoginNavigation = (page) => {
    if (page === 'home') {
      navigate(ROUTES.DASHBOARD);
      triggerNotification('login');
    } else {
      handleNavigate(page);
    }
  };

  const currentNavKey = getCurrentNavKey(pathname, activeSection);
  const showNavbar = !(isAuthenticated() && pathname.startsWith(ROUTES.DASHBOARD));

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar currentPage={currentNavKey} onNavigate={handleNavigate} />}

      <main className="flex-1">
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={
              <>
                <section id="home"><Home /></section>
                <section id="about"><AboutUs /></section>
                <section id="services"><Services /></section>
                <section id="contact"><Contact /></section>
              </>
            }
          />

          <Route path={ROUTES.INTAKE} element={<IntakeForm onClose={handleIntakeFormComplete} />} />
          <Route path={ROUTES.LOGIN} element={<Login onNavigate={handleLoginNavigation} />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword onNavigate={handleLoginNavigation} />} />

          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><PatientDashboard onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.DASHBOARD_OVERVIEW} element={<ProtectedRoute><PatientDashboard onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.DASHBOARD_PROFILE} element={<ProtectedRoute><PatientProfile onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.APPOINTMENTS} element={<ProtectedRoute><Appointments onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.MEDICAL_RECORDS} element={<ProtectedRoute><MedicalRecords onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.LAB_RESULTS} element={<ProtectedRoute><LaboratoryResults onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.PRESCRIPTIONS} element={<ProtectedRoute><Prescriptions onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.BILLING} element={<ProtectedRoute><BillingEnhanced onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.PROFILE_SETTINGS} element={<ProtectedRoute><ProfileSettings onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.BOOK_APPOINTMENT} element={<ProtectedRoute><BookAppointment onNavigate={handleNavigate} /></ProtectedRoute>} />
          <Route path={ROUTES.CALENDAR} element={<ProtectedRoute><PatientCalendar onNavigate={handleNavigate} /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </main>

      {showNavbar && <Footer />}

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onFirstTime={handleFirstTime}
        onReturning={handleReturning}
      />

      {showNotification && (
        <div className="fixed inset-0 flex items-start justify-center pt-20 z-50 pointer-events-none">
          <div className="flex items-center gap-4 px-8 py-5 rounded-xl font-semibold shadow-xl pointer-events-auto max-w-lg bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-900 border border-emerald-400 animate-slideDown">
            <div className="text-2xl font-bold w-7 h-7 flex items-center justify-center flex-shrink-0">&#10003;</div>
            <div className="flex flex-col gap-1">
              <div className="text-base font-bold tracking-wide">
                {notificationType === 'intake' ? 'Form Submitted Successfully!' : 'Login Successful!'}
              </div>
              <div className="text-sm font-medium opacity-90">
                You can now book an appointment.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
