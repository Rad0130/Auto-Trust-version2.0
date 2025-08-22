import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [pendingCars, setPendingCars] = useState([]);

    useEffect(() => {
        const fetchPendingCars = async () => {
            try {
                // MODIFIED: Call the new dedicated admin route
                const res = await API.get("/cars/pending"); 
                setPendingCars(res.data);
            } catch (err) {
                alert("Failed to fetch cars for approval.");
            }
        };
        fetchPendingCars();
    }, []);

    const handleApprove = async (carId) => {
        try {
            await API.patch(`/cars/${carId}/approve`);
            setPendingCars(pendingCars.filter(car => car._id !== carId));
            alert("Car approved successfully!");
        } catch (err) {
            alert("Approval failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Admin Panel: Pending Car Approvals</h2>
            {pendingCars.length > 0 ? (
                <div className="user-cars-grid">
                    {pendingCars.map((car) => (
                        <div key={car._id} className="user-car-card">
                            <img src={car.image} alt={car.title} />
                            <div className="car-details">
                                <h3>{car.title}</h3>
                                <p><strong>Seller:</strong> {car.seller.name}</p>
                                <p><strong>Price:</strong> ${car.price}</p>
                                <span className="status pending">Pending Approval</span>
                            </div>
                            <div className="car-actions">
                                <button
                                    onClick={() => handleApprove(car._id)}
                                    className="approve-btn"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-cars">
                    <p>No new cars to approve.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;