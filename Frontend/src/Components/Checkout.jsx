import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice, discountApplied } = location.state || {};

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    name: storedUser?.fullname || '',
    phone: storedUser?.address.phone || '',
    address: storedUser?.address.address || '',
    city: storedUser?.address.city || '',
    state: storedUser?.address.state || '',
    zip: storedUser?.address.zip || ''
  });

  const [saveAddress, setSaveAddress] = useState(true);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!storedUser?.id) { alert('Login required'); navigate('/signinpage'); return; }

    try {
      const res = await fetch('http://localhost:3021/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: storedUser.id,
          items: cartItems,
          totalPrice,
          shippingAddress: formData
        })
      });

      if (!res.ok) throw new Error('Failed to place order');

      if (saveAddress) {
        const addrRes = await fetch('http://localhost:3021/api/user/address', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: storedUser.id, address: formData })
        });
        if (addrRes.ok) {
          const { user } = await addrRes.json();
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      clearCart();
      alert(`Order placed successfully! ${discountApplied ? '15% discount applied.' : ''}`);
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="driedup-checkout-container">
      <button className="back-btn-checkout" onClick={() => navigate('/homepage')}>&larr; Back to Shop</button>

      <div className="driedup-checkout-wrapper">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>

          <label>
            Full Name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Phone
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </label>

          <label>
            Address
            <input name="address" value={formData.address} onChange={handleChange} required />
          </label>

          <label>
            City
            <input name="city" value={formData.city} onChange={handleChange} required />
          </label>

          <label>
            State
            <input name="state" value={formData.state} onChange={handleChange} required />
          </label>

          <label>
            ZIP
            <input name="zip" value={formData.zip} onChange={handleChange} required />
          </label>

          <label className="save-address">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={e => setSaveAddress(e.target.checked)}
            />
            Save Address
          </label>


          <button type="submit" className="place-order-btn">Place Order</button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div className="checkout-cart-item" key={item.id}>
                  <img src={item.img} alt={item.name} className="checkout-cart-img" />
                  <div className="checkout-cart-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="checkout-cart-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <hr />
          <div className="checkout-total">
            <strong>Total:</strong>
            <span>₹{totalPrice?.toFixed(2)}</span>
          </div>
          {discountApplied && <div className="checkout-discount">15% First Order Discount Applied!</div>}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
