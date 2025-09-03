import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Payment.css";

const PaymentHistory = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await API.get("/payment/user");
        setPayments(response.data);
      } catch (err) {
        console.error("Failed to fetch payment history:", err);
        alert("Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  if (loading) {
    return <div className="payment-loading">Loading payment history...</div>;
  }
  
  return (
    <div className="payment-container">
      <div className="payment-history">
        <h2>Your Payment History</h2>
        
        {payments.length === 0 ? (
          <div className="no-payments">
            <p>You haven't made any payments yet.</p>
            <button 
              onClick={() => navigate("/cars")}
              className="browse-btn"
            >
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="payments-list">
            {payments.map(payment => (
              <div key={payment._id} className="payment-item">
                <div className="payment-item-header">
                  <h3>{payment.car.title}</h3>
                  <span className={`status-badge ${payment.status}`}>
                    {payment.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="payment-item-details">
                  <div className="detail">
                    <span>Amount:</span>
                    <span>${payment.amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="detail">
                    <span>Payment Method:</span>
                    <span>{payment.paymentMethod.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                  
                  <div className="detail">
                    <span>Date:</span>
                    <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {payment.deliveryDate && (
                    <div className="detail">
                      <span>Delivery Date:</span>
                      <span>{new Date(payment.deliveryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => navigate(`/payment/${payment._id}/status`)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;