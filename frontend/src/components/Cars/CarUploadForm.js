import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import "../../styles/AuthPages.css";

const CarUploadForm = () => {
  const [car, setCar] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    paymentType: "cash",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to upload a car.");
      return;
    }

    const formData = new FormData();
    for (let key in car) {
      formData.append(key, car[key]);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await API.post("/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Car uploaded successfully!");
      // Optionally reset form here
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  // If no token, show message instead of form
  if (!token) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-red-500">
          Please log in or register to upload a car.
        </h2>
      </div>
    );
  }

  // Render form if logged in
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Upload a Car</h2>
        <input
          type="text"
          name="title"
          placeholder="Car Title"
          value={car.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={car.brand}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={car.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={car.year}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={car.price}
          onChange={handleChange}
          required
        />
        <select
          name="paymentType"
          value={car.paymentType}
          onChange={handleChange}
        >
          <option value="cash">Cash</option>
          <option value="installment">Installment</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={car.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CarUploadForm;