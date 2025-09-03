import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../styles/ExclusiveOffers.css";

const ExclusiveOffers = () => {
  const [offers, setOffers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await API.get("/cars");
        // Filter for exclusive offers
        const exclusiveCars = data.filter(car => car.isExclusiveOffer && car.isApproved);
        setOffers(exclusiveCars);
      } catch (err) {
        console.error("Failed to fetch exclusive offers:", err);
      }
    };
    fetchOffers();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
  }, [offers.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? offers.length - 1 : prevIndex - 1
    );
  };

  const startAutoSlide = useCallback(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (offers.length > 1) {
      startAutoSlide();
    }
    return stopAutoSlide;
  }, [offers.length, startAutoSlide]);

  const handleCarClick = (carId) => {
    navigate(`/cars/${carId}`);
  };

  if (offers.length === 0) {
    return <p className="no-offers">No exclusive offers available at the moment.</p>;
  }

  return (
    <div className="exclusive-offers-container">
      <div className="carousel" onMouseEnter={stopAutoSlide} onMouseLeave={startAutoSlide}>
        {offers.length > 1 && (
          <button onClick={prevSlide} className="carousel-btn prev-btn">&lt;</button>
        )}
        <div 
          className="carousel-content"
          onClick={() => handleCarClick(offers[currentIndex]._id)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={offers[currentIndex].image}
            alt={offers[currentIndex].title}
            className="carousel-image"
          />
          <div className="offer-details">
            <h3>{offers[currentIndex].title}</h3>
            <p>Price: ${offers[currentIndex].price.toLocaleString()}</p>
            <p>{offers[currentIndex].description}</p>
            <p className="click-hint">Click to view details</p>
          </div>
        </div>
        {offers.length > 1 && (
          <button onClick={nextSlide} className="carousel-btn next-btn">&gt;</button>
        )}
      </div>
    </div>
  );
};

export default ExclusiveOffers;