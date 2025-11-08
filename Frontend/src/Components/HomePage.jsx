import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mylogo from "../assets/Mylogo.png";
import './Homepage.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="driedup-modal-overlay" onClick={onClose}>
      <div className="driedup-modal-content" onClick={e => e.stopPropagation()}>
        <button className="driedup-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Homepage = () => {
  const {
    products,
    cartItems,
    handleAddToCart,
    handleRemoveFromCart,
    totalItems,
    totalPrice
  } = useCart();

  const navigate = useNavigate();

  // ===== User & UI State =====
  const [userData, setUserData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ===== Load user data on mount =====
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      // Optional: Dummy user for testing
      const dummyUser = {
        name: '',
        email: '',
        address: '',
      };
      localStorage.setItem('user', JSON.stringify(dummyUser));
      setUserData(dummyUser);
    }
  }, []);

  // ===== Profile Modal =====
  const handleOpenProfile = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setIsProfileOpen(true);
    } else {
      alert('Please login first.');
      navigate('/signinpage');
    }
  };

  // ===== Logout =====
  const handleLogout = () => {
    localStorage.clear();
    navigate('/signinpage');
  };

  // ===== Checkout Logic =====
  const goToCheckout = async () => {
    if (!userData?.email) {
      alert('Please login first.');
      navigate('/signinpage');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3021/api/getPurchase', { email: userData.email });
      const firstPurchase = res.data.purchase === 0;
      const discountedPrice = firstPurchase ? totalPrice * 0.85 : totalPrice;

      navigate('/checkout', { state: { totalPrice: discountedPrice, discountApplied: firstPurchase } });
    } catch (err) {
      console.error(err);
      alert('Error fetching purchase info.');
    }
  };

  const goToOrders = () => navigate('/orders');

  return (
    <div className="driedup-container">
      {/* ===== Navigation Bar ===== */}
      <nav className="driedup-nav">
        <div className="driedup-nav-container">
          <img src={Mylogo} alt="DriedUp Logo" className="nav-logo" />
          <div className="driedup-nav-logo">DriedUp</div>
          <button className="driedup-nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span /><span /><span />
          </button>
          <div className={`driedup-nav-links ${isMenuOpen ? 'show' : ''}`}>
            <button className="driedup-nav-btn" onClick={handleOpenProfile}>Profile</button>
            <button className="driedup-nav-btn" onClick={goToOrders}>Previous Orders</button>
            <div className="driedup-cart-btn-wrapper">
              <button className="driedup-nav-btn cta" onClick={() => setIsCartOpen(true)}>Cart ({totalItems})</button>
            </div>
            <button className="driedup-nav-btn logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* ===== Products Grid ===== */}
      <main className="driedup-products-grid">
        {products.map((product, index) => (
          <div
            className="driedup-product-card"
            key={product.id}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <img
              src={product.img}
              alt={product.name}
              className="driedup-product-img"
              onError={e => { e.target.src = 'https://placehold.co/400x300/F87171/FFFFFF?text=Image+Error'; }}
            />
            <div className="driedup-product-info">
              <h4>{product.name}</h4>
              <p>{product.desc}</p>
              <div className="driedup-product-card-bottom">
                <span className="driedup-product-price">{product.price} ₹</span>
                <div className="driedup-product-card-controls">
                  {product.quantity > 0 && (
                    <button className="driedup-quantity-btn" onClick={() => handleRemoveFromCart(product.id)}>-</button>
                  )}
                  {product.quantity > 0 && (
                    <span className="driedup-quantity-display">{product.quantity}</span>
                  )}
                  <button className="driedup-add-btn" onClick={() => handleAddToCart(product.id)}>
                    {product.quantity === 0 ? 'Add to Cart' : '+'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* ===== Profile Modal ===== */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
        <h3>User Profile</h3>
        <div className="driedup-profile-info">
          <strong>Name:</strong>
          <p>{userData?.name || 'N/A'}</p>
        </div>
        <div className="driedup-profile-info">
          <strong>Email:</strong>
          <p>{userData?.email || 'N/A'}</p>
        </div>
        <div className="driedup-profile-info">
          <strong>Address:</strong>
          <p>{userData?.address || 'N/A'}</p>
        </div>
      </Modal>

      {/* ===== Cart Modal ===== */}
      <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <h3>Your Cart</h3>
        <div className="driedup-cart-items-list">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div className="driedup-cart-item" key={item.id}>
                <img
                  src={item.img}
                  alt={item.name}
                  className="driedup-cart-item-img"
                  onError={e => { e.target.src = 'https://placehold.co/60x60/F87171/FFFFFF?text=X'; }}
                />
                <div className="driedup-cart-item-info">
                  <h4>{item.name}</h4>
                  <span>{item.price} ₹ x {item.quantity}</span>
                </div>
                <div className="driedup-product-card-controls">
                  <button className="driedup-quantity-btn" onClick={() => handleRemoveFromCart(item.id)}>-</button>
                  <span className="driedup-quantity-display">{item.quantity}</span>
                  <button className="driedup-add-btn" onClick={() => handleAddToCart(item.id)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="driedup-cart-footer">
            <div className="driedup-cart-total">
              <strong>Total: {totalPrice.toFixed(2)} ₹</strong>
            </div>
            <button className="driedup-nav-btn cta driedup-checkout-btn" onClick={goToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Homepage;
