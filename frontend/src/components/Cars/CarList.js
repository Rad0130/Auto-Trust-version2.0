import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../Navbar";
import "../../styles/cars.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
      setFilteredCars(res.data);
    } catch (err) {
      alert("Failed to load cars.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(
        (car) =>
          car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCars(filtered);
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

  useEffect(() => { 
    fetchCars(); 
  }, []);

  return (
    <div className="container">
      {/* Search Container at the top */}
      <div className="hero-section">
        <div className="search-container">
          <h1 className="search-title">Find Your Dream Car</h1>
          <p className="search-subtitle">
            Browse our extensive collection of quality vehicles.
          </p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
          </form>
        </div>
      </div>

      {/* Navbar below the search container */}
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Available Cars</h2>
        <div className="car-grid">
          {filteredCars.map((car) => (
            <div key={car._id} className="car-card">
              {car.image && <img src={car.image} alt={car.title} className="car-image" style={{width:"100%"}} />}
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