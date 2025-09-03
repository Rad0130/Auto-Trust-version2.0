import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminProtectedRoute from "./components/Auth/AdminProtectedRoute";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CarList from "./components/Cars/CarList";
import CarDetail from "./components/Cars/caeDetail";
import CarUploadForm from "./components/Cars/CarUploadForm";
import UserDashboard from "./components/User/UserDashboard";
import EditCar from "./components/Cars/EditCar";
import Logout from "./components/Auth/logout";
import AdminDashboard from "./components/Admin/AdminDashboard";
import PaymentForm from "./components/Payment/PaymentForm";
import PaymentProcess from "./components/Payment/PaymentProcess";
import PaymentStatus from "./components/Payment/PaymentStatus";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentHistory from "./components/Payment/PaymentHistory";
import "./styles/Navbar.css";
import "./styles/buttons.css";
import "./styles/Dashboard.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected Routes */}
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
            path="/payment/:carId"
            element={
              <ProtectedRoute>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id/process"
            element={
              <ProtectedRoute>
                <PaymentProcess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id/status"
            element={
              <ProtectedRoute>
                <PaymentStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:id/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-history"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Only Routes */}
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