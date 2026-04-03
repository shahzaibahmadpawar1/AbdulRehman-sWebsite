function PartsSection({ spareParts }) {
  return (
    <section className="parts" id="parts">
      <div className="section-label">Accessories and Parts</div>
      <h2>Original DJI Spare Parts Available</h2>
      <div className="parts-grid">
        {spareParts.map((part) => (
          <article key={part.name} className="part-card">
            <img src={part.image} alt={part.name} />
            <div className="part-body">
              <h3>{part.name}</h3>
              <div className="part-price">{part.price}</div>
              <p>{part.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PartsSection;
