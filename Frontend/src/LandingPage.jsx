import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import Mylogo from "./assets/Mylogo.png";

const LandingPage = () => {
  const navigate=useNavigate();
  return (
    <div className="LandingPage-container">
      <nav className="nav">
        <div className="nav-container">
          <a href="#" className="nav-brand">
            <img src={Mylogo} alt="My Logo" className="nav-logo" />
            <span className="nav-name">DriedUp</span>
          </a>

          <div className="nav-links">
            <a href="#products" className="nav-item">Products</a>
            <a href="#process" className="nav-item">Process</a>
            <a href="#about" className="nav-item">About</a>
            <button className="btn-login" onClick={()=>navigate('/signinpage')}>Login</button>
            <button className="btn-shop" onClick={()=>navigate('/signuppage')}>Shop Now</button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <h2 className="hero-title">Experience the Freshness of Nature</h2>
          <p className="hero-text">
            Healthy, natural, and irresistibly delicious dehydrated fruits — delivered right to your door.
          </p>
          <button className="hero-btn" onClick={()=>navigate('/mainpage')}>Start Shopping</button>
        </div>
      </section>

      <section className="benefits">
        <h3 className="section-head">Why You'll Love DriedUp</h3>
        <div className="benefit-list">
          <div className="benefit-box">
            <h4>☀️ Long Shelf Life</h4>
            <p>Fresh for months without preservatives. Healthy snacking made easy.</p>
          </div>
          <div className="benefit-box">
            <h4>💪 Nutrient-Packed</h4>
            <p>Our gentle dehydration keeps all vitamins, minerals, and fiber intact.</p>
          </div>
          <div className="benefit-box">
            <h4>🌿 Eco-Friendly</h4>
            <p>We help reduce food waste and promote sustainable farming.</p>
          </div>
        </div>
      </section>

      <section id="products" className="products">
        <h3 className="section-head">Our Bestsellers</h3>
        <div className="product-list">
          <div className="product-card">
            <img src="https://placehold.co/400x300/FDBA74/4D7C0F?text=Dried+Apricots" alt="Apricots" />
            <h4>Sun-Kissed Apricots</h4>
            <p>Sweet, chewy, and full of Vitamin A.</p>
            <div className="product-bottom">
              <span>349.00 ₹</span>
              <button className="btn-cart">Add to Cart</button>
            </div>
          </div>

          <div className="product-card">
            <img src="https://placehold.co/400x300/FCD34D/4D7C0F?text=Dried+Mango" alt="Mango" />
            <h4>Tropical Mango Slices</h4>
            <p>A burst of tropical flavor in every bite.</p>
            <div className="product-bottom">
              <span>499 ₹</span>
              <button className="btn-cart">Add to Cart</button>
            </div>
          </div>

          <div className="product-card">
            <img src="https://placehold.co/400x300/F87171/4D7C0F?text=Dried+Berries" alt="Berries" />
            <h4>Forest Berry Mix</h4>
            <p>A tangy, sweet antioxidant powerhouse.</p>
            <div className="product-bottom">
              <span>650 ₹</span>
              <button className="btn-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="process">
        <h3 className="section-head">From Farm to Pantry</h3>
        <div className="process-list">
          <div className="process-step">
            <div className="step-num">1</div>
            <h4>Sourcing</h4>
            <p>We work with local farmers to pick the freshest fruits.</p>
          </div>
          <div className="process-step">
            <div className="step-num">2</div>
            <h4>Dehydration</h4>
            <p>Low-heat dehydration preserves flavor and nutrients.</p>
          </div>
          <div className="process-step">
            <div className="step-num">3</div>
            <h4>Packaging</h4>
            <p>Eco-friendly resealable bags. No sugar, no preservatives.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="about-grid">
          <div className="about-info">
            <h3 className="section-head">About US</h3>
            <p>
              Founded by <br/><strong>1. Ansh Patoliya</strong><br/><strong>2. Het Limbani</strong><br/> <strong>3. Harsh Patel</strong><br/>
              DriedUp began from a love of healthy, sustainable living.
            </p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h3>Ready to Taste the Difference?</h3>
        <p>Join now and get <strong>15% off</strong> your first order!</p>
        <button className="btn-cta" onClick={()=>navigate('/signuppage')}>Shop Now</button>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src={Mylogo} alt="Logo" className="footer-logo" />
            <p>Healthy, natural, and sustainable snacks.</p>
          </div>

          <div className="footer-links">
            <a href="#products">Products</a>
            <a href="#about">About</a>
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} DriedUp. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
