import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
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
import NotificationSystem from "./components/Notifications/NotificationSystem";
import CarDetail from "./components/Cars/caeDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar removed from here as it's now included in individual pages */}
        <NotificationSystem /> {/* Render the notification system here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/cars/:id" element={<CarDetail />} />
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