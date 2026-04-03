function CartDrawer({ isOpen, cart, totalPrice, onClose, onRemoveItem }) {
  return (
    <>
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-head">
          <h3>Your Cart</h3>
          <button onClick={onClose}>X</button>
        </div>
        <div className="drawer-items">
          {cart.length === 0 ? (
            <div className="empty">Your cart is empty</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <div>{item.name}</div>
                  <small>
                    {item.price} x {item.qty}
                  </small>
                </div>
                <button onClick={() => onRemoveItem(item.id)}>Remove</button>
              </div>
            ))
          )}
        </div>
        <div className="drawer-foot">
          <div>Total: PKR {totalPrice.toLocaleString("en-PK")}</div>
          <button className="btn btn-dark">Proceed to Checkout</button>
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;
