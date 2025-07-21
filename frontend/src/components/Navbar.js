import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

// frontend/src/components/Navbar.js
const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">AutoTrust</Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Cars</Link>
          
          {/* Only show if user exists */}
          {user && <Link to="/upload-car" className="nav-btn">Upload Car</Link>}

          {!user ? (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/register" className="nav-btn">Register</Link>
            </>
          ) : (
            <Link to="/logout" className="nav-btn logout">Logout</Link>
          )}
        </div>
      </div>
    </nav>
  );
};