import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import "../styles/Home.css";
import ExclusiveOffers from "../components/Home/ExclusiveOffers";
import Navbar from "../components/Navbar";
import io from "socket.io-client";
import NotificationSystem from "../components/Notifications/NotificationSystem";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";

const socket = io("http://localhost:5000");

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/cars");
      // Get only approved cars, sort by creation date (newest first), and take first 10
      const approvedCars = data
        .filter((car) => car.isApproved)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setCars(approvedCars);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();

    socket.on("newCarApproved", (data) => {
      console.log("New car approved, re-fetching cars for homepage:", data);
      fetchCars();
    });

    return () => {
      socket.off("newCarApproved");
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?search=${searchTerm}`);
  };

  // Next slide (change to next set of 4 cars)
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.ceil(cars.length / 4) - 1;
      if (prevIndex < maxIndex) {
        return prevIndex + 1;
      } else {
        return 0; // Loop back to the start
      }
    });
  }, [cars.length]);

  // Previous slide (change to previous set of 4 cars)
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      } else {
        return Math.ceil(cars.length / 4) - 1; // Loop to last set
      }
    });
  };

  useEffect(() => {
    if (cars.length > 4) {
      const interval = setInterval(nextSlide, 5000); // Slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [cars.length, nextSlide]);

  // Calculate visible cars for current slide
  const visibleCars = cars.slice(currentIndex * 4, currentIndex * 4 + 4);

  return (
    <div className="home-container">
      {/* Search Container at the top */}
      <div className="hero-section">
        <div className="notification-icon-container">
          {user && <NotificationSystem />}
        </div>
        <div className="search-container">
          <h1 className="search-title">All the cars you need in one place</h1>
          <p className="search-subtitle">
            We have the most popular brands and models for your vehicle.
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

      {/* Latest Cars Section */}
      <div className="content-section">
        <h2 className="section-title">Latest Listings</h2>
        {loading ? (
          <p>Loading cars...</p>
        ) : cars.length === 0 ? (
          <p className="no-cars-message">No cars available at the moment.</p>
        ) : (
          <div className="latest-cars-container">
            {cars.length > 4 && (
              <button onClick={prevSlide} className="carousel-btn prev-btn">
                &lt;
              </button>
            )}
          
            <div className="carousel-content">
              <div className="carousel-cards">
                {visibleCars.map((car) => (
                  <Link to={`/cars/${car._id}`} key={car._id} className="car-card-link">
                    <div className="car-card">
                      <img src={car.image} alt={`${car.brand} ${car.model}`} />
                      <div className="car-info">
                        <h3>{car.brand} {car.model}</h3>
                        <p className="car-price">Price: ${car.price.toLocaleString()}</p>
                        <p className="car-year">Year: {car.year}</p>
                        <p className="car-payment">{car.paymentType}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          
            {cars.length > 4 && (
              <button onClick={nextSlide} className="carousel-btn next-btn">
                &gt;
              </button>
            )}
          </div>
        )}
      </div>

      {/* Exclusive Offers */}
      <div className="content-section">
        <h2 className="section-title">Exclusive Offers</h2>
        <ExclusiveOffers />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;