import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import io from "socket.io-client";
import "../../styles/Notifications.css";

const socket = io("https://auto-trust-version2-0.onrender.com"); // Connect to your backend

const NotificationSystem = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      // Load previous notifications from localStorage
      const savedNotifications = localStorage.getItem(`notifications_${user._id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }

      socket.emit("joinUser", user._id); // Join a user-specific room

      // Listen for new car posts (admin only)
      socket.on("newCarPosted", (data) => {
        if (user.isAdmin) {
          const newNotification = {
            message: `New car posted: "${data.title}" by ${data.userName}`,
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            type: 'new_car'
          };
        
          setNotifications(prevNotifications => {
            const updatedNotifications = [newNotification, ...prevNotifications];
            localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updatedNotifications));
            return updatedNotifications;
          });
        
          setHasNewNotifications(true);
        }
      });

      // Listen for car status updates (for all users)
      socket.on("carStatusUpdate", (data) => {
        const newNotification = {
          message: data.message,
          id: Date.now(),
          timestamp: new Date(),
          read: false,
          type: data.type || 'info'
        };
      
        setNotifications(prevNotifications => {
          const updatedNotifications = [newNotification, ...prevNotifications];
          localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updatedNotifications));
          return updatedNotifications;
        });
      
        setHasNewNotifications(true);
      });

      // Listen for new car approved notifications (for all users)
      socket.on("newCarApproved", (data) => {
        const newNotification = {
          message: `A new car "${data.title}" is available! Have a look at the latest cars.`,
          id: Date.now(),
          timestamp: new Date(),
          read: false,
          type: 'info'
        };
      
        setNotifications(prevNotifications => {
          const updatedNotifications = [newNotification, ...prevNotifications];
          localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updatedNotifications));
          return updatedNotifications;
        });
      
        setHasNewNotifications(true);
      });
    }

    return () => {
      socket.off("newCarPosted");
      socket.off("carStatusUpdate");
      socket.off("newCarApproved");
    };
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    if (hasNewNotifications) {
      setHasNewNotifications(false);
      // Mark all notifications as read
      setNotifications(prev => {
        const updated = prev.map(notif => ({ ...notif, read: true }));
        localStorage.setItem(`notifications_${user._id}`, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem(`notifications_${user._id}`);
  };

  if (!user) return null; // Don't show notifications for unauthenticated users

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={toggleDropdown}>
        <i className="fa-regular fa-bell"></i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>
  
      {isDropdownVisible && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="clear-btn" onClick={clearNotifications}>
                Clear All
              </button>
            )}
          </div>
        
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                >
                  <p>{notification.message}</p>
                  <small>
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))
            ) : (
              <p className="no-notifications">No notifications yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;