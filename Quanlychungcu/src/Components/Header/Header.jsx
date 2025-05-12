// Header.jsx
import React, { useState, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Header() {
  const [greeting, setGreeting] = useState('');
  const [headerGradient, setHeaderGradient] = useState('');

  const updateHeader = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 11) {
      setGreeting('Chào buổi sáng!');
      setHeaderGradient('linear-gradient(to bottom, #ffffff, #bfff00)');
    } else if (hour >= 11 && hour < 13) {
      setGreeting('Chào buổi trưa!');
      setHeaderGradient('linear-gradient(to bottom, #ffda63, #bfff00)'); // Vivid Yellow to Green
    } else if (hour >= 13 && hour < 17) {
      setGreeting('Chào buổi chiều!');
      setHeaderGradient('linear-gradient(to bottom, #ff8c00, #bfff00)'); // Dark Orange to Green
    } else {
      setGreeting('Chào buổi tối!');
      setHeaderGradient('linear-gradient(to bottom,rgb(29, 1, 74), #bfff00)'); // Light Purple to Green
    }
  };

  useEffect(() => {
    updateHeader(); // Initial update

    const intervalId = setInterval(() => {
      updateHeader();
    }, 15 * 60 * 1000); // Update every 15 minutes

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      // Redirect to the login page
      window.location.href = '/index1.html';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div id="header">
      <span className="item" style={{ background: headerGradient }}>
        <div id="logo-part">
          <img
            src="/src/assets/images/favicon/android-chrome-512x512.png"
            alt="dmm"
          />
          <div id="logo-text">
            <div className="green-light-container">
              <div className="green-light-text">GREEN LIGHT</div>
              <hr />
            </div>
            <span>Phần mềm quản lý chung cư Green Sun</span>
          </div>
        </div>
      </span>

      <span className="item right-container" style={{ background: headerGradient }}>
        <div className="greeting-text">{greeting}</div>
        <div className="email-text">
          {localStorage.getItem("email")}
        </div>

        <div className="icon-button-container">
          <button className="icon-button notification-button" title="Thông báo">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="icon-button message-button" title="Tài khoản">
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button
            className="icon-button logout-button"
            title="Đăng xuất"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </span>
    </div>
  );
}

export default Header;