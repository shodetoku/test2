import { useState } from 'react';
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
  const [currentView, setCurrentView] = useState('landing'); // landing, intake, login, forgot-password
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [intakeFormCompleted, setIntakeFormCompleted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState(''); // 'intake' or 'login'

  const scrollToSection = (sectionId) => {
    if (sectionId === 'login') {
      setCurrentView('login');
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAppointmentClick = () => {
    setShowModal(true);
  };

  const handleFirstTime = () => {
    setShowModal(false);
    setCurrentView('intake');
  };

  const handleReturning = () => {
    setShowModal(false);
    setCurrentView('login');
  };

  const handleIntakeFormComplete = (isCompleted) => {
    if (isCompleted) {
      // Mark intake form as completed
      setIntakeFormCompleted(true);
      setCurrentView('landing');
      // Show success notification
      setNotificationType('intake');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } else {
      // User cancelled
      setCurrentView('landing');
    }
  };

  const handleLoginSuccess = () => {
    // Mark user as logged in
    setIsLoggedIn(true);
    setCurrentView('landing');
    // Show success notification
    setNotificationType('login');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLoginNavigation = (page) => {
    if (page === 'home') {
      handleLoginSuccess();
    } else if (page === 'forgot-password') {
      setCurrentView('forgot-password');
    } else if (page === 'login') {
      setCurrentView('login');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
  };

  // Show IntakeForm
  if (currentView === 'intake') {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar onNavigate={handleBackToHome} onAppointmentClick={handleAppointmentClick} />
        <main className="flex-1">
          <IntakeForm onClose={handleIntakeFormComplete} />
        </main>
        <Footer />
      </div>
    );
  }

  // Show Login
  if (currentView === 'login') {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar onNavigate={handleBackToHome} onAppointmentClick={handleAppointmentClick} />
        <main className="flex-1">
          <Login onNavigate={handleLoginNavigation} />
        </main>
        <Footer />
      </div>
    );
  }

  // Show Forgot Password
  if (currentView === 'forgot-password') {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar onNavigate={handleBackToHome} onAppointmentClick={handleAppointmentClick} />
        <main className="flex-1">
          <ForgotPassword onNavigate={handleLoginNavigation} />
        </main>
        <Footer />
      </div>
    );
  }

  // Show Landing Page
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onNavigate={scrollToSection} onAppointmentClick={handleAppointmentClick} />

      <main className="flex-1">
        <section id="home" className="w-full">
          <Home />
        </section>

        <section id="services" className="w-full">
          <Services />
        </section>

        <section id="contact" className="w-full">
          <Contact />
        </section>
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
