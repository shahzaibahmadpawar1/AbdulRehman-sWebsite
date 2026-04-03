function HeroSection({ activeHero, heroChoices, heroIndex, onSelectHero }) {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-tag">Official DJI Store · Lahore</div>
        <h1>Drones for Every Budget</h1>
        <p>
          Whether you are flying for the first time or shooting professional footage, we have the right drone for you.
          Free delivery across Pakistan.
        </p>
        <div className="hero-actions">
          <a href="#drones" className="btn btn-dark">
            Browse Drones
          </a>
          <a href="#location" className="btn btn-outline">
            Visit Our Shop
          </a>
        </div>
      </div>
      <div className="hero-right">
        <img src={activeHero.image} alt={activeHero.name} className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-kicker">Featured Right Now</div>
          <div className="hero-name">{activeHero.name}</div>
          <div className="hero-meta">{activeHero.meta}</div>
          <div className="hero-dots">
            {heroChoices.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === heroIndex ? "active" : ""}`}
                onClick={() => onSelectHero(index)}
                aria-label={`Show featured drone ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
