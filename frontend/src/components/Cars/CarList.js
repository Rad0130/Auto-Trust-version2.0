import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/cars.css";
import { useNavigate } from "react-router-dom";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (err) {
      alert("Failed to load cars.");
    }
  };

  const handlePurchase = (carId) => {
    if (!user) {
      alert("Please login to purchase a car");
      navigate("/login");
      return;
    }
    // Add purchase logic here
    alert(`Purchase request sent for car ${carId}`);
  };

  useEffect(() => { fetchCars(); }, []);

  return (
    <div className="container">
      <div style={{ padding: "20px" }}>
        <h2>Available Cars</h2>
        <div className="car-grid">
          {cars.map((car) => (
            <div key={car._id} className="car-card">
              {car.image && <img src={car.image} alt={car.title} className="car-image" />}
              <h3>{car.title}</h3>
              <p>Brand: {car.brand}</p>
              <p>Model: {car.model}</p>
              <p>Year: {car.year}</p>
              <p>Price: ${car.price}</p>
              <button 
                onClick={() => handlePurchase(car._id)}
                className="purchase-btn"
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarList;