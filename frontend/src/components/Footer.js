import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  const handleContactClick = () => {
    alert("Email: shafiurrahmanrad25@gmail.com\nPhone: 01309634127");
  };

  const handleLinkClick = (e, linkName) => {
    e.preventDefault();
    alert(`${linkName} page is coming soon!`);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo and Vision */}
        <div className="footer-section">
          <div className="footer-logo">
            <h2>AutoTrust</h2>
          </div>
          <p className="footer-vision">
            Connecting car enthusiasts with their perfect vehicles through a trusted, transparent platform.
          </p>
          <div className="social-icons">
            <a 
              href="https://www.facebook.com/profile.php?id=100072754745638&mibextid=ZbWKwL" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a 
              href="https://www.linkedin.com/in/shafiur-rahman-rad-879717290?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <button 
              className="social-icon-btn"
              onClick={() => alert("YouTube channel coming soon!")}
              aria-label="YouTube"
            >
              <i className="fa-brands fa-youtube"></i>
            </button>
          </div>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><button onClick={(e) => handleLinkClick(e, "Privacy Policy")}>Privacy Policy</button></li>
            <li><button onClick={(e) => handleLinkClick(e, "Pricing")}>Pricing</button></li>
            <li><button onClick={handleContactClick}>Contact Us</button></li>
            <li><button onClick={(e) => handleLinkClick(e, "FAQ")}>FAQ</button></li>
            <li><button onClick={(e) => handleLinkClick(e, "Help Center")}>Help Center</button></li>
            <li><button onClick={(e) => handleLinkClick(e, "Terms & Services")}>Terms & Services</button></li>
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div className="footer-section">
          <h3>Contact Information</h3>
          <div className="contact-info">
            <p>
              <i className="fas fa-envelope"></i>
              <span>shafiurrahmanrad25@gmail.com</span>
            </p>
            <p>
              <i className="fas fa-phone"></i>
              <span>01309634127</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AutoTrust. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;