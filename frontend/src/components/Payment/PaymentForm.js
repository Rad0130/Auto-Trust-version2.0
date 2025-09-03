import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../styles/Payment.css";

const PaymentForm = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    paymentMethod: "bank_transfer",
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    installmentPlan: {
      downPayment: 30,
      numberOfInstallments: 6,
      frequency: "monthly"
    },
    bankDetails: {
      accountNumber: "",
      accountName: "",
      bankName: "",
      routingNumber: ""
    }
  });
  
  const [loading, setLoading] = useState(false);
  
  // Fetch car details to verify it exists
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await API.get(`/cars/${carId}`);
        setCar(response.data);
      } catch (err) {
        console.error("Failed to fetch car:", err);
        alert("Car not found");
        navigate("/cars");
      }
    };
    
    if (carId) {
      fetchCar();
    }
  }, [carId, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("deliveryAddress.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [field]: value
        }
      }));
    } else if (name.startsWith("bankDetails.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value
        }
      }));
    } else if (name.startsWith("installmentPlan.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        installmentPlan: {
          ...prev.installmentPlan,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Submitting payment for carId:", carId);
      
      const response = await API.post("/payment", {
        carId: carId,
        ...formData
      });
      
      navigate(response.data.redirectUrl);
    } catch (err) {
      console.error("Payment initiation error:", err);
      alert("Failed to initiate payment: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  if (!car) {
    return <div className="payment-loading">Loading car details...</div>;
  }
  
  return (
    <div className="payment-container">
      <div className="payment-form">
        <h2>Complete Your Purchase</h2>
        
        <div className="car-summary">
          <h3>{car.title}</h3>
          <p>Brand: {car.brand} | Model: {car.model} | Year: {car.year}</p>
          <p className="car-price">Price: ${car.price.toLocaleString()}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-row">
              <input
                type="text"
                name="deliveryAddress.street"
                placeholder="Street Address"
                value={formData.deliveryAddress.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="deliveryAddress.city"
                placeholder="City"
                value={formData.deliveryAddress.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="deliveryAddress.state"
                placeholder="State"
                value={formData.deliveryAddress.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="deliveryAddress.zipCode"
                placeholder="ZIP Code"
                value={formData.deliveryAddress.zipCode}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="deliveryAddress.country"
                placeholder="Country"
                value={formData.deliveryAddress.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === "bank_transfer"}
                  onChange={handleChange}
                />
                <span>Bank Transfer</span>
              </label>
              
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === "cash_on_delivery"}
                  onChange={handleChange}
                />
                <span>Cash on Delivery</span>
              </label>
              
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="installment"
                  checked={formData.paymentMethod === "installment"}
                  onChange={handleChange}
                />
                <span>Installment Plan</span>
              </label>
            </div>
          </div>
          
          {formData.paymentMethod === "bank_transfer" && (
            <div className="form-section">
              <h3>Bank Details</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="bankDetails.accountName"
                  placeholder="Account Holder Name"
                  value={formData.bankDetails.accountName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="bankDetails.accountNumber"
                  placeholder="Account Number"
                  value={formData.bankDetails.accountNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="bankDetails.bankName"
                  placeholder="Bank Name"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="bankDetails.routingNumber"
                  placeholder="Routing Number"
                  value={formData.bankDetails.routingNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}
          
          {formData.paymentMethod === "installment" && (
            <div className="form-section">
              <h3>Installment Plan</h3>
              <div className="form-row">
                <label>Down Payment (%)</label>
                <input
                  type="number"
                  name="installmentPlan.downPayment"
                  min="10"
                  max="50"
                  value={formData.installmentPlan.downPayment}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <label>Number of Installments</label>
                <select
                  name="installmentPlan.numberOfInstallments"
                  value={formData.installmentPlan.numberOfInstallments}
                  onChange={handleChange}
                  required
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
              <div className="form-row">
                <label>Payment Frequency</label>
                <select
                  name="installmentPlan.frequency"
                  value={formData.installmentPlan.frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="payment-submit-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;