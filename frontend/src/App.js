import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CarList from "./components/Cars/CarList";
import CarUploadForm from "./components/Cars/CarUploadForm";
import UserDashboard from "./components/User/UserDashboard";
import EditCar from "./components/Cars/EditCar";
import Logout from "./components/Auth/logout";
import "./styles/Navbar.css";
import "./styles/buttons.css";
import "./styles/Dashboard.css";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";
import AdminDashboard from "./components/Admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/upload-car"
            element={
              <ProtectedRoute>
                <CarUploadForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-car/:id"
            element={
              <ProtectedRoute>
                <EditCar />
              </ProtectedRoute>
            }
          />
          <Route
              path="/admin-dashboard"
              element={
                  <AdminProtectedRoute>
                      <AdminDashboard />
                  </AdminProtectedRoute>
              }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;