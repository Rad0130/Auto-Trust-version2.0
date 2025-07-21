import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/cars.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchCars = async () => {
    try {
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (err) {
      alert("Failed to load cars.");
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await API.delete(`/cars/${carId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCars(); // Refresh list
    } catch (err) {
      alert("Delete failed.");
    }
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
              <p>Price: ${car.price}</p>
              
              {/* Delete button for car owner */}
              {user?.id === car?.seller?._id && (
                <button onClick={() => handleDelete(car._id)} className="delete-btn">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarList;