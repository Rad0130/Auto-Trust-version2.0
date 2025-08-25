import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client";
import "../../styles/Notifications.css";

const socket = io("http://localhost:5000"); // Connect to your backend

const NotificationSystem = () => {
 const { user } = useContext(AuthContext);
 const [notifications, setNotifications] = useState([]);
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
   if (user) {
     socket.emit("joinUser", user._id); // Join a user-specific room

     socket.on("newCarPosted", (data) => {
       const newNotification = {
         message: `New car posted: ${data.title} by ${data.userName}`,
         id: Date.now()
       };
       setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
       setIsVisible(true);
       setTimeout(() => setIsVisible(false), 5000); // Hide after 5 seconds
     });
   }

   return () => {
     socket.off("newCarPosted");
   };
 }, [user]);

 if (!user) return null; // Don't show notifications for unauthenticated users

 return (
   <div className={`notification-container ${isVisible ? "visible" : ""}`}>
     {notifications.length > 0 && (
       <div className="notification-card">
         <p>{notifications[0].message}</p>
         <button onClick={() => setIsVisible(false)} className="close-btn">
           &times;
         </button>
       </div>
     )}
   </div>
 );
};

export default NotificationSystem;