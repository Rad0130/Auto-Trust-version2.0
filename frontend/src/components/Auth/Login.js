import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/AuthPages.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      loginContext(res.data.user);
      alert("Login successful");
      navigate("/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
                                      transition:"background-color 0.3s ease"}}>Sign In</button>
      </form>
    </div>
  );
};

export default Login;