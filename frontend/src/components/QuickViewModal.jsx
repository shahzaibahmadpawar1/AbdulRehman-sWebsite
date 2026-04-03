function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) {
    return null;
  }

  return (
    <div className="quickview" onClick={onClose}>
      <div className="quickview-card" onClick={(event) => event.stopPropagation()}>
        <img src={product.image} alt={product.name} />
        <div>
          <button className="quickview-close" onClick={onClose}>
            X
          </button>
          <div className="card-category">{product.category}</div>
          <h3>{product.name}</h3>
          <p>{product.desc}</p>
          <div className="tags">
            {product.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="price">{product.price}</div>
          <button className="btn btn-dark" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
