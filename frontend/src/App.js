import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import CarList from "./components/Cars/CarList";
import CarUploadForm from "./components/Cars/CarUploadForm";
import Logout from "./components/Auth/logout";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import "./styles/Navbar.css";
import "./styles/buttons.css"; // ✅ Import shared button styles

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">AutoTrust</Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Cars</Link>
          <Link to="/upload-car" className="nav-btn">Upload Car</Link>
          {user ? (
            <button className="nav-btn logout" onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/register" className="nav-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<CarList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload-car" element={<CarUploadForm />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;