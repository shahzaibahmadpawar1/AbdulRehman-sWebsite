function LocationSection() {
  return (
    <section className="location" id="location">
      <div className="location-content">
        <div className="section-label">Find Us</div>
        <h2>Visit Our Store</h2>
        <p>Shop #9, Ground Floor, Business 16, Hall Road, Garhi Shahu, Lahore</p>
        <p>
          Phone: <a href="tel:+923009400956">0300-9400956</a>
        </p>
        <p>Sunday: Open 24 Hours</p>
        <a className="btn btn-dark" href="https://maps.app.goo.gl/uqD86A9YLCnu2sBM6" target="_blank" rel="noreferrer">
          Get Directions
        </a>
      </div>
      <iframe
        title="Store location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.8329!2d74.3158505!3d31.5635664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191b53935053dd%3A0xca5785369d7e99a6!2sAmir%20electronics!5e0!3m2!1sen!2spk!4v1711700000000!5m2!1sen!2spk"
        loading="lazy"
      />
    </section>
  );
}

export default LocationSection;
