import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css'; // We will create this

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.id) {
        setError('You must be logged in to view your orders.');
        setLoading(false);
        navigate('/signin');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3021/api/orders/${storedUser.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="driedup-orders-container">
      <button className="driedup-back-btn" onClick={() => navigate('/homepage')}>
        &larr; Back to Shop
      </button>
      <h2>Your Order History</h2>

      {loading && <p>Loading your orders...</p>}
      {error && <p className="driedup-error-msg">{error}</p>}
      
      {!loading && !error && orders.length === 0 && (
        <p>You have not placed any orders yet.</p>
      )}

      {orders.length > 0 && (
        <div className="driedup-orders-list">
          {orders.map((order) => (
            <div className="driedup-order-card" key={order._id}>
              <div className="driedup-order-header">
                <div>
                  <strong>Order ID:</strong> {order._id}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Status:</strong> <span className={`driedup-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
              </div>
              <div className="driedup-order-body">
                <div className="driedup-order-items">
                  {order.items.map((item) => (
                    <div className="driedup-order-item" key={item.id}>
                      <img src={item.img} alt={item.name} />
                      <span>{item.name} (x{item.quantity})</span>
                    </div>
                  ))}
                </div>
                <div className="driedup-order-summary">
                  <div className="driedup-order-address">
                    <strong>Shipping To:</strong>
                    <p>
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    </p>
                  </div>
                  <div className="driedup-order-total">
                    <strong>Total: {order.totalPrice.toFixed(2)} ₹</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;