import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Payment.css";

const PaymentProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
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
  
  const handleProcessPayment = async () => {
    setProcessing(true);
    
    try {
      const response = await API.post(`/payment/${id}/process`);
      
      if (response.data.nextStep) {
        navigate(response.data.nextStep);
      } else {
        navigate(`/payment/${id}/status`);
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      alert("Failed to process payment: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
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
      <div className="payment-process">
        <h2>Process Your Payment</h2>
        
        <div className="payment-summary">
          <h3>Payment Summary</h3>
          <div className="summary-item">
            <span>Car:</span>
            <span>{payment.car.title}</span>
          </div>
          <div className="summary-item">
            <span>Amount:</span>
            <span>${payment.amount.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span>Payment Method:</span>
            <span>{payment.paymentMethod.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          
          {payment.paymentMethod === "installment" && payment.installmentPlan && (
            <div className="installment-details">
              <h4>Installment Plan</h4>
              <div className="summary-item">
                <span>Down Payment:</span>
                <span>${payment.installmentPlan.downPayment.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span>Installment Amount:</span>
                <span>${payment.installmentPlan.installmentAmount.toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span>Number of Installments:</span>
                <span>{payment.installmentPlan.numberOfInstallments}</span>
              </div>
              <div className="summary-item">
                <span>Frequency:</span>
                <span>{payment.installmentPlan.frequency}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="payment-instructions">
          <h3>Payment Instructions</h3>
          
          {payment.paymentMethod === "bank_transfer" && (
            <div>
              <p>Please transfer the amount to the following bank account:</p>
              <div className="bank-details">
                <p><strong>Bank Name:</strong> AutoTrust Payments Bank</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Routing Number:</strong> 021000021</p>
                <p><strong>Reference:</strong> Payment #{id}</p>
              </div>
              <p>After completing the transfer, click the button below to confirm.</p>
            </div>
          )}
          
          {payment.paymentMethod === "cash_on_delivery" && (
            <div>
              <p>You have selected Cash on Delivery. Please have the payment ready when our delivery agent arrives.</p>
              <p>Estimated delivery date: {new Date(payment.estimatedDeliveryDate).toLocaleDateString()}</p>
            </div>
          )}
          
          {payment.paymentMethod === "installment" && (
            <div>
              <p>Your installment plan has been set up. The first payment will be processed shortly.</p>
              <p>You will receive payment reminders before each installment due date.</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleProcessPayment}
          className="process-payment-btn"
          disabled={processing}
        >
          {processing ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

export default PaymentProcess;