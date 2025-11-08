import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // --- UPDATED: Pre-fill state from localStorage ---
  const [formData, setFormData] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    // Check if user and user.address exist
    if (storedUser && storedUser.address) {
      return {
        name: storedUser.address.name || storedUser.fullname || '',
        phone: storedUser.address.phone || '',
        address: storedUser.address.address || '',
        city: storedUser.address.city || '',
        state: storedUser.address.state || '',
        zip: storedUser.address.zip || ''
      };
    }
    // Fallback if no user or address is stored
    return { name: '', phone: '', address: '', city: '', state: '', zip: '' };
  });

  // --- NEW: State for the "Save Address" checkbox ---
  const [saveAddress, setSaveAddress] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- UPDATED: handleSubmit to also save the address ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) {
      alert('You must be logged in to place an order.');
      navigate('/signin');
      return;
    }

    const orderData = {
      userId: storedUser.id,
      items: cartItems,
      totalPrice: totalPrice,
      shippingAddress: formData,
    };

    try {
      // 1. Create the order (no change)
      const response = await fetch('http://localhost:3021/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order.');
      }

      // --- NEW: 2. Save address if box is checked ---
      if (saveAddress) {
        const addrResponse = await fetch('http://localhost:3021/api/user/address', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: storedUser.id,
            address: formData // Send the form data as the new address
          }),
        });
        
        if (addrResponse.ok) {
          // Update localStorage with the new address
          const { user } = await addrResponse.json();
          localStorage.setItem('user', JSON.stringify(user));
        }
      }

      // 3. Handle success (no change)
      alert('Order placed successfully!');
      clearCart();
      navigate('/orders'); // Go to order history

    } catch (err) {
      console.error('Error placing order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="driedup-checkout-container">
      <button className="driedup-back-btn" onClick={() => navigate('/homepage')}>
        &larr; Back to Shop
      </button>
      
      <div className="driedup-checkout-grid">
        {/* ===== Left Column: Address Form ===== */}
        <div className="driedup-checkout-form">
          <h3>Shipping Address</h3>
          <form id="shipping-form" onSubmit={handleSubmit}>
            {/* All form inputs are now controlled by the pre-filled state */}
            <div className="driedup-form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="driedup-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="driedup-form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="driedup-form-group-row">
              <div className="driedup-form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="driedup-form-group">
                <label htmlFor="state">State</label>
                <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
              </div>
            </div>
            <div className="driedup-form-group">
              <label htmlFor="zip">ZIP / Postal Code</label>
              <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
            </div>

            {/* --- NEW: Save Address Checkbox --- */}
            <div className="driedup-form-group-checkbox">
              <input
                type="checkbox"
                id="saveAddress"
                name="saveAddress"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              <label htmlFor="saveAddress">Save this address to my profile</label>
            </div>

          </form>
        </div>

        {/* ===== Right Column: Order Summary (No changes) ===== */}
        <div className="driedup-order-summary">
          <h3>Order Summary</h3>
          <div className="driedup-summary-items">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div className="driedup-summary-item" key={item.id}>
                  <img src={item.img} alt={item.name} className="driedup-summary-item-img" />
                  <div className="driedup-summary-item-info">
                    <h4>{item.name}</h4>
                    <span>{item.price} ₹ x {item.quantity}</span>
                  </div>
                  <span className="driedup-summary-item-total">
                    {item.price * item.quantity} ₹
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="driedup-summary-footer">
            <div className="driedup-summary-total">
              <strong>Total:</strong>
              <strong>{totalPrice.toFixed(2)} ₹</strong>
            </div>
            <button
              type="submit"
              form="shipping-form"
              className="driedup-nav-btn cta driedup-checkout-btn"
              disabled={cartItems.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;