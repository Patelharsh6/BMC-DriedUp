import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Mylogo from "../assets/Mylogo.png";
import './Homepage.css';

// --- Homepage Component ---
const Homepage = () => {
  // --- All cart logic is GONE from here ---
  // --- We get everything from the global context ---
  const {
    products,
    cartItems,
    handleAddToCart,
    handleRemoveFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', address: '' });
  const navigate = useNavigate();

  // This logic is still specific to the homepage, so it stays
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      const dummyUser = {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        address: '123 Green St, Fruitville, 12345',
      };
      localStorage.setItem('user', JSON.stringify(dummyUser));
    }
  }, []);

  const handleOpenProfile = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        name: user.fullname || 'N/A',
        email: user.email || 'N/A',
        address: user.address || 'N/A',
      });
    }
    setIsProfileOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // You might want to navigate to a /login page instead
  };

  // --- NEW: Function to navigate to new pages ---
  const goToCheckout = () => {
    navigate('/checkout');
  };
  
  const goToOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="driedup-container">
      {/* ===== Navigation Bar ===== */}
      <nav className="driedup-nav">
        <div className="driedup-nav-container">
        <img src={Mylogo} alt="My Logo" className="nav-logo" />
          <div className="driedup-nav-logo">DriedUp</div>
          <button
            className="driedup-nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`driedup-nav-links ${isMenuOpen ? 'show' : ''}`}>
            <button className="driedup-nav-btn" onClick={handleOpenProfile}>
              Profile
            </button>
            {/* --- UPDATED --- */}
            <button className="driedup-nav-btn" onClick={goToOrders}>
              Previous Orders
            </button>
            <div className="driedup-cart-btn-wrapper">
              <button
                className="driedup-nav-btn cta"
                onClick={() => setIsCartOpen(true)}
              >
                Cart ({totalItems}) {/* Now from context */}
              </button>
            </div>
            <button
              className="driedup-nav-btn logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Products Grid ===== */}
      <main className="driedup-products-grid">
        {products.map((product, index) => ( /* 'products' now from context */
          <div
            className="driedup-product-card"
            key={product.id}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <img
              src={product.img}
              alt={product.name}
              className="driedup-product-img"
            />
            <div className="driedup-product-info">
              <h4>{product.name}</h4>
              <p>{product.desc}</p>
              <div className="driedup-product-card-bottom">
                <span className="driedup-product-price">
                  {product.price} ₹
                </span>
                <div className="driedup-product-card-controls">
                  {product.quantity > 0 && (
                    <button
                      className="driedup-quantity-btn"
                      onClick={() => handleRemoveFromCart(product.id)}
                    >
                      -
                    </button>
                  )}
                  {product.quantity > 0 && (
                    <span className="driedup-quantity-display">
                      {product.quantity}
                    </span>
                  )}
                  <button
                    className="driedup-add-btn"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    {product.quantity === 0 ? 'Add to Cart' : '+'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* ===== Profile Modal (Stays the same) ===== */}
      {isProfileOpen && (
        <div
          className="driedup-modal-overlay"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="driedup-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="driedup-modal-close-btn"
              onClick={() => setIsProfileOpen(false)}
            >
              &times;
            </button>
            <h3>User Profile</h3>
            <div className="driedup-profile-info">
              <strong>Name:</strong>
              <p>{userData.name}</p>
            </div>
            <div className="driedup-profile-info">
              <strong>Email:</strong>
              <p>{userData.email}</p>
            </div>
            <div className="driedup-profile-info">
              <strong>Address:</strong>
              <p>{userData.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== Cart Modal (Gets data from context) ===== */}
      {isCartOpen && (
        <div
          className="driedup-modal-overlay"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="driedup-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="driedup-modal-close-btn"
              onClick={() => setIsCartOpen(false)}
            >
              &times;
            </button>
            <h3>Your Cart</h3>
            <div className="driedup-cart-items-list">
              {cartItems.length === 0 ? ( /* 'cartItems' from context */
                <p>Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div className="driedup-cart-item" key={item.id}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="driedup-cart-item-img"
                    />
                    <div className="driedup-cart-item-info">
                      <h4>{item.name}</h4>
                      <span>
                        {item.price} ₹ x {item.quantity}
                      </span>
                    </div>
                    <div className="driedup-product-card-controls">
                      <button
                        className="driedup-quantity-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        -
                      </button>
                      <span className="driedup-quantity-display">
                        {item.quantity}
                      </span>
                      <button
                        className="driedup-add-btn"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="driedup-cart-footer">
                <div className="driedup-cart-total">
                  {/* 'totalPrice' from context */}
                  <strong>Total: {totalPrice.toFixed(2)} ₹</strong>
                </div>
                {/* --- UPDATED --- */}
                <button
                  className="driedup-nav-btn cta driedup-checkout-btn"
                  onClick={goToCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;