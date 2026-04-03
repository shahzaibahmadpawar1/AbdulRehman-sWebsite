function ProductsSection({ categories, filter, onFilterChange, products, onOpenQuickView, onAddToCart }) {
  return (
    <section className="products" id="drones">
      <div className="section-label">Our Collection</div>
      <h2>Choose Your Drone</h2>
      <div className="tabs">
        {categories.map((item) => (
          <button key={item.key} className={`tab ${filter === item.key ? "active" : ""}`} onClick={() => onFilterChange(item.key)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {products.map((product) => (
          <article key={product.id} className="card" onClick={() => onOpenQuickView(product)}>
            <div className="card-image-wrap">
              {product.badge ? <span className={`badge badge-${product.badge}`}>{product.badgeLabel}</span> : null}
              <img src={product.image} alt={product.name} className="card-image" />
            </div>
            <div className="card-body">
              <div className="card-category">{product.category}</div>
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
              <div className="tags">
                {product.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="card-bottom">
                <div>
                  {product.priceOld ? <div className="old-price">{product.priceOld}</div> : null}
                  <div className="price">{product.price}</div>
                </div>
                <button
                  className="btn btn-dark"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProductsSection;
