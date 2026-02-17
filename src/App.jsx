import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import IntakeForm from './pages/IntakeForm';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import './index.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [intakeFormCompleted, setIntakeFormCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState(''); // 'intake' or 'login'

  // router helpers
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (dest) => {
    if (!dest) return;
    if (dest === 'book-appointment') {
      setShowModal(true);
      return;
    }

    const map = {
      home: '/',
      about: '/about',
      services: '/services',
      contact: '/contact',
      login: '/login',
      intake: '/intake',
      'intake-form': '/intake',
    };

    const path = map[dest] || '/' + dest;
    navigate(path);
    if (path === '/') {
      setTimeout(() => {
        const el = document.getElementById('home');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  };

  const handleAppointmentClick = () => {
    setShowModal(true);
  };

  const handleFirstTime = () => {
    setShowModal(false);
    navigate('/intake');
  };

  const handleReturning = () => {
    setShowModal(false);
    navigate('/login');
  };

  const handleIntakeFormComplete = (isCompleted) => {
    if (isCompleted) {
      // Mark intake form as completed
      setIntakeFormCompleted(true);
      navigate('/');
      // Show success notification
      setNotificationType('intake');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else {
      // User cancelled
      navigate('/');
    }
  };

  const handleLoginSuccess = () => {
    // Mark user as logged in
    setIsLoggedIn(true);
    navigate('/');
    // Show success notification
    setNotificationType('login');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLoginNavigation = (page) => {
    if (page === 'home') {
      handleLoginSuccess();
    } else if (page === 'forgot-password') {
      navigate('/forgot-password');
    } else if (page === 'login') {
      navigate('/login');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // derive a friendly currentPage for Navbar from location
  const pathname = location.pathname || '/';
  let currentPage = 'home';
  if (pathname === '/' || pathname === '/home') currentPage = 'home';
  else if (pathname.startsWith('/about')) currentPage = 'about';
  else if (pathname.startsWith('/services')) currentPage = 'services';
  else if (pathname.startsWith('/contact')) currentPage = 'contact';
  else if (pathname.startsWith('/intake')) currentPage = 'intake';
  else if (pathname.startsWith('/login')) currentPage = 'login';
  else if (pathname.startsWith('/forgot-password')) currentPage = 'forgot-password';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/intake" element={<IntakeForm onClose={handleIntakeFormComplete} />} />
          <Route path="/login" element={<Login onNavigate={handleLoginNavigation} />} />
          <Route path="/forgot-password" element={<ForgotPassword onNavigate={handleLoginNavigation} />} />
        </Routes>
      </main>

      <Footer />

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onFirstTime={handleFirstTime}
        onReturning={handleReturning}
      />

      {showNotification && (
        <div className="fixed inset-0 flex items-start justify-center pt-20 z-50 pointer-events-none">
          <div className="flex items-center gap-4 px-8 py-5 rounded-xl font-semibold shadow-xl pointer-events-auto max-w-lg bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-900 border border-emerald-400 animate-slideDown">
            <div className="text-2xl font-bold w-7 h-7 flex items-center justify-center flex-shrink-0">✓</div>
            <div className="flex flex-col gap-1">
              <div className="text-base font-bold tracking-wide">
                {notificationType === 'intake' ? 'Form Submitted Successfully!' : 'Login Successful!'}
              </div>
              <div className="text-sm font-medium opacity-90">
                {notificationType === 'intake' ? 'You can now book an appointment.' : 'You can now book an appointment.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
