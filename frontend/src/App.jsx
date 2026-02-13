import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import IntakeForm from './pages/IntakeForm';
import './styles/App.css';

function App() {
  // currentPage para sa navigation
  const [currentPage, setCurrentPage] = useState('home');

  // show/hide ng intake form modal
  const [showIntakeForm, setShowIntakeForm] = useState(false);

  // function para mag-navigate between pages
  const handleNavigate = (page) => {
    if (page === 'intake-form') {
      setShowIntakeForm(true);
    } else {
      setCurrentPage(page);
      setShowIntakeForm(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // function para i-close ang intake form
  const handleCloseIntakeForm = () => {
    setShowIntakeForm(false);
  };

  // render ng tamang page based sa currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'about-us':
        return <AboutUs />;
      case 'services':
        return <Services />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'change-password':
        return <ChangePassword onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="main-content">
        {renderPage()}
      </main>

      <Footer />

      {showIntakeForm && <IntakeForm onClose={handleCloseIntakeForm} />}
    </div>
  );
}

export default App;
