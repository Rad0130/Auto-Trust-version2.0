import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Payment.css";

const PaymentSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  
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
    setConfirming(true);
    
    try {
      const response = await API.post(`/payment/${id}/confirm`);
      navigate(response.data.redirectUrl);
    } catch (err) {
      console.error("Payment confirmation error:", err);
      alert("Failed to confirm payment: " + (err.response?.data?.message || err.message));
    } finally {
      setConfirming(false);
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
      <div className="payment-success">
        <div className="success-icon">✓</div>
        <h2>Payment Successful!</h2>
        
        <div className="success-details">
          <h3>Your purchase has been confirmed</h3>
          
          <div className="detail-item">
            <span>Car:</span>
            <span>{payment.car.title}</span>
          </div>
          
          <div className="detail-item">
            <span>Amount Paid:</span>
            <span>${payment.amount.toLocaleString()}</span>
          </div>
          
          <div className="detail-item">
            <span>Payment Method:</span>
            <span>{payment.paymentMethod.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          
          <div className="detail-item">
            <span>Expected Delivery Date:</span>
            <span>{new Date(payment.deliveryDate).toLocaleDateString()}</span>
          </div>
          
          <div className="detail-item">
            <span>Delivery Address:</span>
            <span>
              {payment.deliveryAddress.street}, {payment.deliveryAddress.city}, {payment.deliveryAddress.state} {payment.deliveryAddress.zipCode}, {payment.deliveryAddress.country}
            </span>
          </div>
        </div>
        
        <div className="success-message">
          <h3>Congratulations on your new car!</h3>
          <p>
            Your {payment.car.brand} {payment.car.model} will be delivered to your address on the specified date.
            You will receive a confirmation email with all the details shortly.
          </p>
          <p>
            Thank you for choosing AutoTrust for your automotive needs!
          </p>
        </div>
        
        <div className="success-actions">
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

export default PaymentSuccess;