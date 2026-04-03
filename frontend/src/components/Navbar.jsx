function Navbar({ totalItems, onOpenCart }) {
  return (
    <nav className="navbar">
      <a href="#" className="logo">
        Amir Electronics
      </a>
      <ul className="nav-links">
        <li>
          <a href="#drones">Drones</a>
        </li>
        <li>
          <a href="#parts">Parts</a>
        </li>
        <li>
          <a href="#location">Visit Us</a>
        </li>
      </ul>
      <button className="nav-cart" onClick={onOpenCart}>
        Cart <span className="cart-badge">{totalItems}</span>
      </button>
    </nav>
  );
}

export default Navbar;
