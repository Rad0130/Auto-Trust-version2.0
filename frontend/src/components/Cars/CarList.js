import React, { useState, useEffect, useContext, useCallback } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/cars.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../Navbar";
import NotificationSystem from "../Notifications/NotificationSystem";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Removed setSearchParams since it's not used

  // Get search term from URL if it exists
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  // Use useCallback to memoize fetchCars function
  const fetchCars = useCallback(async () => {
    try {
      const url = searchTerm ? `/cars?search=${searchTerm}` : "/cars";
      const res = await API.get(url);
      setCars(res.data);
    } catch (err) {
      alert("Failed to load cars.");
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const handlePurchase = (carId) => {
  if (!user) {
    alert("Please login to purchase a car");
    navigate("/login");
    return;
  }
  
  // Navigate to payment form
  navigate(`/payment/${carId}`);
  };

  useEffect(() => { 
    fetchCars(); 
  }, [fetchCars]); // Added fetchCars to dependency array

  return (
    <div>
      {/* Hero Section for Cars Page */}
      <div className="hero-section">
        <div className="notification-icon-container">
          {user && <NotificationSystem />}
        </div>
        <div className="search-container">
          <h1 className="search-title">Browse All Cars</h1>
          <p className="search-subtitle">
            Find your perfect vehicle from our extensive collection.
          </p>
          {/* Add search form to Cars page */}
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

      {/* Navbar */}
      <Navbar />

      <div className="container">
        <div style={{ padding: "20px" }}>
          {/* Show search results info if searching */}
          {searchTerm && (
            <div style={{ marginBottom: "20px", color: "white" }}>
              <h3>Search Results for: "{searchTerm}"</h3>
              <p>{cars.length} car(s) found</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  fetchCars();
                }}
                style={{
                  backgroundColor: "#666",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Clear Search
              </button>
            </div>
          )}
          
          <h2>Available Cars</h2>
          <div className="car-grid">
            {cars.map((car) => (
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
          
          {cars.length === 0 && (
            <div style={{ textAlign: "center", color: "white", marginTop: "40px" }}>
              <h3>No cars found</h3>
              <p>Try adjusting your search criteria or browse all cars</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarList;