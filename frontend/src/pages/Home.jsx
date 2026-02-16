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
      <div className="home-background">
        <img
          src="https://mlpainting.ca/wp-content/uploads/2020/11/1-1.jpg"
          alt="Clinic background"
          className="background-image"
        />
        <div className="background-overlay"></div>
      </div>

      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z" fill="#10b981"/>
              </svg>
            </div>
            <span className="logo-text">LOGO</span>
          </div>

          <h1>Welcome to Our Clinic</h1>
          <p className="welcome-description">
            We're here to make your visit simple, fast, and stress-free.
          </p>

          <div className="carousel-section-label">Image</div>
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
    </div>
  );
}

export default Home;
