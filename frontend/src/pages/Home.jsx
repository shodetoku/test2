import { useState, useEffect } from 'react';
import '../styles/Home.css';

function Home({ onNavigate }) {
  const carouselImages = [
    'https://images.pexels.com/photos/6129107/pexels-photo-6129107.jpeg',
    'https://images.pexels.com/photos/14797857/pexels-photo-14797857.jpeg',
    'https://images.pexels.com/photos/8460228/pexels-photo-8460228.jpeg',
    'https://images.pexels.com/photos/8460372/pexels-photo-8460372.jpeg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isHovering, carouselImages.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="home-page">
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-logo">
            <div className="logo-icon">
              <span>🏥</span>
            </div>
            <span className="logo-text">LOGO</span>
          </div>

          <h1>Welcome Back!</h1>
          <p className="welcome-description">
            Access your medical records, manage appointments, and connect with your doctors securely.
          </p>

          <div className="doctor-image">
            <div
              className="carousel-container"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="carousel-wrapper">
                <img
                  src={carouselImages[currentIndex]}
                  alt={`Slide ${currentIndex + 1}`}
                  className="carousel-image"
                />

                {carouselImages.length > 1 && (
                  <>
                    <button
                      className="carousel-button carousel-prev"
                      onClick={goToPrevious}
                      aria-label="Previous slide"
                    >
                      &#10094;
                    </button>
                    <button
                      className="carousel-button carousel-next"
                      onClick={goToNext}
                      aria-label="Next slide"
                    >
                      &#10095;
                    </button>
                  </>
                )}
              </div>

              {carouselImages.length > 1 && (
                <div className="carousel-indicators">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={index === currentIndex ? 'true' : 'false'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="action-section">
          <h2>Are you a first timer patient?</h2>
          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={() => onNavigate('intake-form')}
            >
              Yes, I'm New
              <div className="btn-subtitle">Start your Digital Intake Form</div>
            </button>
            <button
              className="btn-secondary"
              onClick={() => onNavigate('login')}
            >
              No, I'm Returning
              <div className="btn-subtitle">Log in or find your records</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
