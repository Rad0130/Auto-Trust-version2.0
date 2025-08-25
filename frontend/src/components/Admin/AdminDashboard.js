import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Navbar from "../Navbar";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending-cars");
  const [pendingCars, setPendingCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCars, setAllCars] = useState([]);
  const [exclusiveOffers, setExclusiveOffers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [pendingRes, usersRes, allCarsRes] = await Promise.all([
          API.get("/cars/pending"),
          API.get("/admin/users"),
          API.get("/cars"),
        ]);
        setPendingCars(pendingRes.data);
        setUsers(usersRes.data);
        setAllCars(allCarsRes.data);
        setExclusiveOffers(allCarsRes.data.filter(car => car.isExclusiveOffer));
      } catch (err) {
        console.error("Failed to load admin data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApproveCar = async (carId) => {
    try {
      await API.patch(`/cars/${carId}/approve`);
      setPendingCars(pendingCars.filter((car) => car._id !== carId));
      alert("Car approved successfully!");
    } catch (err) {
      alert("Approval failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectCar = async (carId) => {
    if (window.confirm("Are you sure you want to reject this car?")) {
      try {
        await API.delete(`/cars/${carId}`);
        setPendingCars(pendingCars.filter((car) => car._id !== carId));
        alert("Car rejected and deleted.");
      } catch (err) {
        alert("Rejection failed: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleToggleExclusiveOffer = async (carId) => {
    try {
      const carToUpdate = allCars.find(car => car._id === carId);
      const newStatus = !carToUpdate.isExclusiveOffer;
      await API.patch(`/admin/cars/${carId}/exclusive`, { isExclusive: newStatus });
      
      const updatedCars = allCars.map(car =>
        car._id === carId ? { ...car, isExclusiveOffer: newStatus } : car
      );
      setAllCars(updatedCars);
      setExclusiveOffers(updatedCars.filter(car => car.isExclusiveOffer));
      alert(`Car ${newStatus ? 'added to' : 'removed from'} exclusive offers.`);
    } catch (err) {
      alert("Failed to update exclusive offer status.");
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await API.patch(`/admin/users/${userId}/verify`);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isVerified: true } : user
        )
      );
      alert("User verified successfully!");
    } catch (err) {
      alert("Verification failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'pending-cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending-cars')}
          >
            Pending Car Approvals ({pendingCars.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management ({users.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            Manage Exclusive Offers ({exclusiveOffers.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'pending-cars' && (
            <div className="pending-cars">
              <h2>Pending Car Listings</h2>
              <div className="car-list">
                {pendingCars.length > 0 ? (
                  pendingCars.map((car) => (
                    <div key={car._id} className="car-card">
                      <img src={car.image} alt={car.title} />
                      <div className="car-details">
                        <h3>{car.title}</h3>
                        <p><strong>Brand:</strong> {car.brand}</p>
                        <p><strong>Price:</strong> ${car.price}</p>
                        <p><strong>Seller:</strong> {car.seller?.name || 'N/A'}</p>
                      </div>
                      <div className="car-actions">
                        <button onClick={() => handleApproveCar(car._id)} className="approve-btn">Approve</button>
                        <button onClick={() => handleRejectCar(car._id)} className="reject-btn">Reject</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No pending cars.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="user-management">
              <h2>User Management</h2>
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`status ${user.isVerified ? 'verified' : 'unverified'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td>
                          {!user.isVerified && (
                            <button onClick={() => handleVerifyUser(user._id)} className="verify-btn">
                              Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="offers-management">
              <h2>Manage Exclusive Offers</h2>
              <p>Cars marked as exclusive offers will appear on the homepage carousel.</p>
              <div className="car-list">
                {allCars.map((car) => (
                  <div key={car._id} className="car-card">
                    <img src={car.image} alt={car.title} />
                    <div className="car-details">
                      <h3>{car.title}</h3>
                      <p><strong>Brand:</strong> {car.brand}</p>
                      <p><strong>Price:</strong> ${car.price}</p>
                      <p>
                        <strong>Status:</strong>
                        <span className={`status ${car.isApproved ? 'approved' : 'pending'}`}>
                          {car.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </p>
                      <p>
                        <strong>Offer:</strong>
                        <span className={`status ${car.isExclusiveOffer ? 'exclusive' : 'regular'}`}>
                          {car.isExclusiveOffer ? 'Exclusive' : 'Regular'}
                        </span>
                      </p>
                    </div>
                    <div className="car-actions">
                      <button
                        onClick={() => handleToggleExclusiveOffer(car._id)}
                        className={car.isExclusiveOffer ? "remove-offer-btn" : "add-offer-btn"}
                      >
                        {car.isExclusiveOffer ? 'Remove from Offers' : 'Add to Offers'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;