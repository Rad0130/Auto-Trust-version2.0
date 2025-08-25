import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../Navbar";
import "../../styles/caeDetail.css";

const CarDetail = () => {
  const { id } = useParams(); // Get car ID from the URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await API.get(`/cars/${id}`);
        setCar(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError("Failed to load car details. Please try again.");
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handlePurchase = () => {
    if (!user) {
      alert("Please log in to purchase this car.");
      navigate("/login");
      return;
    }
    // Implement actual purchase logic here (e.g., send a request to backend)
    alert(`Purchase request sent for ${car.brand} ${car.model}!`);
    // Optionally, navigate to a confirmation page or user dashboard
    // navigate('/user-dashboard');
  };

  if (loading) {
    return <div className="car-detail-loading">Loading car details...</div>;
  }

  if (error) {
    return <div className="car-detail-error">{error}</div>;
  }

  if (!car) {
    return <div className="car-detail-not-found">Car not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="car-detail-container">
        <div className="car-detail-card">
          <img src={car.image} alt={car.title} className="car-detail-image" />
          <div className="car-detail-info">
            <h1>{car.title}</h1>
            <p><strong>Brand:</strong> {car.brand}</p>
            <p><strong>Model:</strong> {car.model}</p>
            <p><strong>Year:</strong> {car.year}</p>
            <p><strong>Price:</strong> ${car.price}</p>
            <p><strong>Payment Type:</strong> {car.paymentType}</p>
            <p><strong>Description:</strong> {car.description}</p>
            <p><strong>Seller:</strong> {car.seller?.name || 'N/A'} ({car.seller?.email || 'N/A'})</p>
            {car.isApproved ? (
              <span className="car-status approved">Approved</span>
            ) : (
              <span className="car-status pending">Pending Approval</span>
            )}
            <button onClick={handlePurchase} className="purchase-btn">
              Purchase This Car
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;