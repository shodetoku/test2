import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './Home';
import Services from './Services';
import Contact from './Contact';

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname || '/';
    let id = 'home';
    if (path.startsWith('/services')) id = 'services';
    else if (path.startsWith('/contact')) id = 'contact';
    else if (path.startsWith('/about')) id = 'home';

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  }, [location.pathname]);

  return (
    <>
      <section id="home" className="w-full">
        <Home />
      </section>

      <section id="services" className="w-full">
        <Services />
      </section>

      <section id="contact" className="w-full">
        <Contact />
      </section>
    </>
  );
}
