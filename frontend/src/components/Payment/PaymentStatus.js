import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Payment.css";

const PaymentStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await API.get(`/payment/${id}`);
        setPayment(response.data);
      } catch (err) {
        console.error("Failed to fetch payment:", err);
        alert("Failed to load payment details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayment();
  }, [id, navigate]);
  
  const handleConfirmPayment = async () => {
    try {
      const response = await API.post(`/payment/${id}/confirm`);
      navigate(response.data.redirectUrl);
    } catch (err) {
      console.error("Payment confirmation error:", err);
      alert("Failed to confirm payment: " + (err.response?.data?.message || err.message));
    }
  };
  
  if (loading) {
    return <div className="payment-loading">Loading payment details...</div>;
  }
  
  if (!payment) {
    return <div className="payment-error">Payment not found.</div>;
  }
  
  return (
    <div className="payment-container">
      <div className="payment-status">
        <h2>Payment Status</h2>
        
        <div className={`status-indicator ${payment.status}`}>
          <div className="status-icon">
            {payment.status === "completed" && "✓"}
            {payment.status === "processing" && "⏳"}
            {payment.status === "pending" && "⏱️"}
            {payment.status === "failed" && "❌"}
          </div>
          <h3>Status: {payment.status.toUpperCase()}</h3>
        </div>
        
        <div className="payment-details">
          <h3>Payment Details</h3>
          
          <div className="detail-item">
            <span>Car:</span>
            <span>{payment.car.title}</span>
          </div>
          
          <div className="detail-item">
            <span>Amount:</span>
            <span>${payment.amount.toLocaleString()}</span>
          </div>
          
          <div className="detail-item">
            <span>Payment Method:</span>
            <span>{payment.paymentMethod.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          
          <div className="detail-item">
            <span>Transaction Date:</span>
            <span>{payment.transactionDate ? new Date(payment.transactionDate).toLocaleString() : "Pending"}</span>
          </div>
          
          {payment.deliveryDate && (
            <div className="detail-item">
              <span>Delivery Date:</span>
              <span>{new Date(payment.deliveryDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {payment.status === "processing" && (
          <div className="payment-actions">
            <button 
              onClick={handleConfirmPayment}
              className="confirm-payment-btn"
            >
              Confirm Payment Completion
            </button>
          </div>
        )}
        
        <div className="navigation-actions">
          <button 
            onClick={() => navigate("/user-dashboard")}
            className="dashboard-btn"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => navigate("/cars")}
            className="browse-btn"
          >
            Browse More Cars
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;