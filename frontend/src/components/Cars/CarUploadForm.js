import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../styles/AuthPages.css";

const CarUploadForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    paymentType: "cash",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("image", image);
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await API.post("/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Car uploaded successfully!");
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Upload a Car</h2>
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
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          required
        />
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
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CarUploadForm;