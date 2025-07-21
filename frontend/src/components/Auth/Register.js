import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import "../../styles/AuthPages.css";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{display: "inline-block",
                                      width: "100%",
                                      padding: "0.7rem",
                                      backgroundColor:"#333",
                                      color:"#fff",
                                      border:"none",
                                      borderRadius:"5px",
                                      fontWeight:"600",
                                      cursor:"pointer",
                                      transition:"background-color 0.3s ease"}}>Register</button>
        <h5 style={{fontWeight:"normal"}}>If are already registered, then SignIn</h5>
      </form>
    </div>
  );
};

export default Register;