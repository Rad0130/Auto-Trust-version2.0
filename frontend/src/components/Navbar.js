import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">AutoTrust</Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/cars" className="nav-btn">Cars</Link>
          
          {user && <Link to="/upload-car" className="nav-btn">Upload Car</Link>}
          {user && <Link to="/user-dashboard" className="nav-btn">Dashboard</Link>}
          {user && user.isAdmin && <Link to="/admin-dashboard" className="nav-btn">Admin Panel</Link>}
          

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

export default Navbar; // Fixed export