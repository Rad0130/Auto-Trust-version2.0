import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Dashboard.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [userCars, setUserCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsRes = await API.get("/user/my-cars");
        setUserCars(carsRes.data);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProfileUpdate = async (data) => {
    try {
      await API.put("/user", data);
      setSuccessMessage("Profile updated successfully");
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car listing?")) {
      try {
        await API.delete(`/cars/${carId}`);
        setUserCars(userCars.filter(car => car._id !== carId));
        setSuccessMessage("Car listing deleted successfully");
      } catch (err) {
        alert("Failed to delete car: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          My Car Listings ({userCars.length})
        </button>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {activeTab === 'profile' ? (
        <div className="profile-section">
          <h2>Profile Settings</h2>
          <form onSubmit={handleSubmit(handleProfileUpdate)}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                {...register("name")}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                {...register("email")}
              />
            </div>

            <h3>Change Password</h3>
            
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <span className="error">{errors.currentPassword.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <span className="error">{errors.newPassword.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword.message}</span>
              )}
            </div>

            <button type="submit" className="update-btn">
              Update Profile
            </button>
          </form>
        </div>
      ) : (
        <div className="cars-section">
          <h2>Manage Your Car Listings</h2>
          
          {userCars.length > 0 ? (
            <div className="user-cars-grid">
              {userCars.map((car) => (
                <div key={car._id} className="user-car-card">
                  <img src={car.image} alt={car.title} />
                  <div className="car-details">
                    <h3>{car.title}</h3>
                    <p><strong>Brand:</strong> {car.brand}</p>
                    <p><strong>Price:</strong> ${car.price}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status ${car.isApproved ? 'approved' : 'pending'}`}>
                        {car.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </p>
                  </div>
                  <div className="car-actions">
                    <button 
                      onClick={() => navigate(`/edit-car/${car._id}`)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCar(car._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-cars">
              <p>You haven't listed any cars yet.</p>
              <button 
                onClick={() => navigate('/upload-car')}
                className="primary-btn"
              >
                List a New Car
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;