import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../styles/AuthPages.css";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    paymentType: "cash",
    description: ""
  });
  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await API.get(`/cars/${id}`);
        const { image, ...carData } = data;
        setFormData(carData);
        setCurrentImage(image);
      } catch (err) {
        console.error("Failed to fetch car:", err);
        alert("Failed to load car details");
        navigate("/user-dashboard");
      }
    };
    fetchCar();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (newImage) {
      data.append("image", newImage);
    }

    try {
      await API.put(`/cars/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Car updated successfully!");
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Edit Car Listing</h2>
        
        {currentImage && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <h4>Current Image:</h4>
            <img 
              src={currentImage} 
              alt="Current car" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }} 
            />
          </div>
        )}

        <input
          type="text"
          name="title"
          placeholder="Car Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <select
          name="paymentType"
          value={formData.paymentType}
          onChange={handleChange}
          required
        >
          <option value="cash">Cash</option>
          <option value="installment">Installment</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />
        <div style={{ margin: '1rem 0' }}>
          <label>Change Image (optional):</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            display: "inline-block",
            width: "100%",
            padding: "0.7rem",
            backgroundColor: loading ? "#999" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease"
          }}
        >
          {loading ? "Updating..." : "Update Car"}
        </button>
      </form>
    </div>
  );
};

export default EditCar;