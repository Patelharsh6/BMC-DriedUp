import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Mylogo from "../assets/Mylogo.png";
import './Homepage.css';

// --- Product Data ---
const productsData = [
  { id: 1, name: 'Sun-Kissed Apricots', desc: 'Sweet, chewy, and full of Vitamin A.', price: 349, img: 'https://placehold.co/400x300/FCD34D/4D7C0F?text=Apricots' },
  { id: 2, name: 'Tropical Mango Slices', desc: 'A burst of tropical flavor in every bite.', price: 499, img: 'https://placehold.co/400x300/FCD34D/4D7C0F?text=Dried+Mango' },
  { id: 3, name: 'Forest Berry Mix', desc: 'A tangy, sweet antioxidant powerhouse.', price: 650, img: 'https://placehold.co/400x300/F87171/4D7C0F?text=Dried+Berries' },
  { id: 4, name: 'Crunchy Almonds', desc: 'Perfectly roasted for a healthy snack.', price: 399, img: 'https://placehold.co/400x300/FFEDD5/4D7C0F?text=Almonds' },
  { id: 5, name: 'Cashew Delight', desc: 'Creamy cashews with a hint of salt.', price: 499, img: 'https://placehold.co/400x300/D9F99D/4D7C0F?text=Cashews' },
  { id: 6, name: 'Pistachio Crunch', desc: 'Nutty and delicious pistachios.', price: 599, img: 'https://placehold.co/400x300/DEF7FF/4D7C0F?text=Pistachios' },
  { id: 7, name: 'Mixed Dry Fruits', desc: 'A healthy mix of dried fruits.', price: 699, img: 'https://placehold.co/400x300/FBCFE8/4D7C0F?text=Mixed+Fruits' },
  { id: 8, name: 'Roasted Walnuts', desc: 'Crunchy walnuts for your daily snack.', price: 550, img: 'https://placehold.co/400x300/C7D2FE/4D7C0F?text=Walnuts' },
];

// --- Homepage Component ---
const Homepage = () => {
  const [products, setProducts] = useState(
    productsData.map((p) => ({ ...p, quantity: 0 }))
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', address: '' });
  const navigate = useNavigate();

  // On component mount, set dummy user data in localStorage if it doesn't exist
  // This is just for testing the profile modal
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

  // --- Cart Logic ---
  const handleAddToCart = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  const handleRemoveFromCart = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id && p.quantity > 0 ? { ...p, quantity: p.quantity - 1 } : p
      )
    );
  };

  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);

  // --- Profile Modal Logic ---
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

  // --- Logout Logic ---
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
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
            {/* Hamburger Icon Lines */}
            <span />
            <span />
            <span />
          </button>
          <div className={`driedup-nav-links ${isMenuOpen ? 'show' : ''}`}>
            <button className="driedup-nav-btn" onClick={handleOpenProfile}>
              Profile
            </button>
            <button className="driedup-nav-btn">Previous Orders</button>
            <div className="driedup-cart-btn-wrapper">
              <button className="driedup-nav-btn cta">
                Cart ({totalItems})
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

      {/* ===== Profile Modal ===== */}
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
    </div>
  );
};

export default Homepage;