// Header.jsx
import React, { useState, useEffect } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';;
import {
  faCloud,
  faCloudSun,
  faCloudRain,
  faSun,          // Icon cho trời quang
  faSmog,         // Icon cho sương mù/khói
  faBolt,         // Icon cho dông
  faSnowflake,    // Icon cho tuyết (ít khi ở HN nhưng để đủ)
  faQuestionCircle // Icon mặc định nếu không map được
} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
// THAY THẾ BẰNG API KEY CỦA BẠN
const OPENWEATHER_API_KEY = '81b409167a4ad1b60ce3c994b109de96'; // <--- !!! QUAN TRỌNG !!!
const CITY_NAME = 'Hanoi';
const COUNTRY_CODE = 'VN';
const UNITS = 'metric'; // Để nhiệt độ là độ C

// Hàm map mã thời tiết của OpenWeatherMap sang FontAwesome icon
const getWeatherIcon = (weatherCode) => {
  // Tham khảo: https://openweathermap.org/weather-conditions
  if (weatherCode >= 200 && weatherCode < 300) return faBolt; // Thunderstorm
  if (weatherCode >= 300 && weatherCode < 400) return faCloudRain; // Drizzle
  if (weatherCode >= 500 && weatherCode < 600) return faCloudRain; // Rain
  if (weatherCode >= 600 && weatherCode < 700) return faSnowflake; // Snow
  if (weatherCode >= 700 && weatherCode < 800) return faSmog; // Atmosphere (mist, smoke, haze, etc.)
  if (weatherCode === 800) return faSun; // Clear
  if (weatherCode === 801) return faCloudSun; // Few clouds
  if (weatherCode > 801 && weatherCode < 805) return faCloud; // Scattered, broken, overcast clouds
  return faQuestionCircle; // Mặc định
};


function Header({onOpenPopup ,account}) {
  const [greeting, setGreeting] = useState('');
  const [headerGradient, setHeaderGradient] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState([]); // Sẽ chứa dự báo 2 ngày tới

  const getRoleText = () => {
    switch(account?.role) {
      case 'resident': return "Cư dân";
      case 'admin': return "Quản trị viên";
      default: return "Khách";
    }
  };

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
    // Fetch weather data
    const intervalId = setInterval(updateHeader, 15 * 60 * 1000);
    const fetchWeatherData = async () => {
      if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
        console.error("Vui lòng cung cấp API key của OpenWeatherMap.");
        // Có thể set dữ liệu mock ở đây nếu không có API key
        setCurrentWeather({
          day: "Hôm nay",
          temp: "N/A",
          description: "Không có API key",
          icon: faQuestionCircle,
        });
        setForecastWeather([
          { day: "Ngày mai", temp: "N/A", description: "Không có API key", icon: faQuestionCircle },
          { day: "Ngày kia", temp: "N/A", description: "Không có API key", icon: faQuestionCircle },
        ]);
        return;
      }
      try {
        // 1. Lấy thời tiết hiện tại
        const currentWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME},${COUNTRY_CODE}&appid=${OPENWEATHER_API_KEY}&units=${UNITS}&lang=vi`
        );
        const currentData = currentWeatherResponse.data;
        setCurrentWeather({
          day: "Hôm nay",
          temp: `${Math.round(currentData.main.temp)}°C`,
          description: currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1),
          icon: getWeatherIcon(currentData.weather[0].id),
        });

        // 2. Lấy dự báo (OpenWeatherMap API 2.5 free chỉ cho dự báo 5 ngày / 3 giờ)
        // Chúng ta sẽ lấy dự báo 5 ngày, rồi trích xuất 2 ngày tiếp theo
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY_NAME},${COUNTRY_CODE}&appid=${OPENWEATHER_API_KEY}&units=${UNITS}&lang=vi`
        );
        const forecastData = forecastResponse.data.list;

        // Xử lý để lấy dự báo cho "Ngày mai" và "Ngày kia" vào khoảng giữa ngày (ví dụ: 12:00)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);

        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        dayAfterTomorrow.setHours(12, 0, 0, 0);

        const processedForecast = [];

        // Tìm dữ liệu gần nhất với 12:00 cho ngày mai
        const tomorrowForecast = forecastData.find(
          item => new Date(item.dt * 1000).toDateString() === tomorrow.toDateString() && new Date(item.dt * 1000).getHours() >= 12
        ) || forecastData.find(item => new Date(item.dt * 1000).toDateString() === tomorrow.toDateString()); // Lấy bất kỳ nếu ko có 12h

        if (tomorrowForecast) {
          processedForecast.push({
            day: "Ngày mai",
            temp: `${Math.round(tomorrowForecast.main.temp)}°C`,
            description: tomorrowForecast.weather[0].description.charAt(0).toUpperCase() + tomorrowForecast.weather[0].description.slice(1),
            icon: getWeatherIcon(tomorrowForecast.weather[0].id),
          });
        }

        // Tìm dữ liệu gần nhất với 12:00 cho ngày kia
        const dayAfterTomorrowForecast = forecastData.find(
          item => new Date(item.dt * 1000).toDateString() === dayAfterTomorrow.toDateString() && new Date(item.dt * 1000).getHours() >= 12
        ) || forecastData.find(item => new Date(item.dt * 1000).toDateString() === dayAfterTomorrow.toDateString());

        if (dayAfterTomorrowForecast) {
          processedForecast.push({
            day: "Ngày kia",
            temp: `${Math.round(dayAfterTomorrowForecast.main.temp)}°C`,
            description: dayAfterTomorrowForecast.weather[0].description.charAt(0).toUpperCase() + dayAfterTomorrowForecast.weather[0].description.slice(1),
            icon: getWeatherIcon(dayAfterTomorrowForecast.weather[0].id),
          });
        }
        setForecastWeather(processedForecast);

      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu thời tiết:", error);
        // Xử lý lỗi, ví dụ hiển thị thông báo lỗi hoặc dùng dữ liệu mock
         setCurrentWeather({
          day: "Hôm nay",
          temp: "Lỗi",
          description: "Không tải được",
          icon: faQuestionCircle,
        });
        setForecastWeather([
          { day: "Ngày mai", temp: "Lỗi", description: "Không tải được", icon: faQuestionCircle },
          { day: "Ngày kia", temp: "Lỗi", description: "Không tải được", icon: faQuestionCircle },
        ]);
      }
    };

    fetchWeatherData();
    // Fetch lại dữ liệu thời tiết mỗi 30 phút
    const weatherIntervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(weatherIntervalId);
    };
  }, []); // Chỉ chạy 1 lần khi component mount

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateHeader();
    }, 15 * 60 * 1000); // Update every 15 minutes

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  const handleLogout = async () => {
  try {
    // 1) Kiểm tra token (cookie) còn hợp lệ không
    await axios.get("http://localhost:8080/checkin", {
      withCredentials: true,
    });

    // 2) Nếu thành công → tiến hành logout
    await axios.post("http://localhost:8080/logouts", null, {
      withCredentials: true,
    });
  } catch (err) {
    // Nếu checkin trả 401 (token hết hạn) thì bỏ qua bước logout
    if (err.response?.status === 403) {
      console.error("Gặp lỗi khi logout:", err);
    }
    // Các trường hợp 401, 403, hoặc lỗi khác vẫn sẽ rơi xuống finally để redirect
  } finally {
    // 3) Redirect về trang đăng nhập dù thành công hay thất bại
    localStorage.removeItem("loggedInUser");
    window.location.href = "/index1.html";
  }
};
const allWeatherPanels = [];
  if (currentWeather) {
    allWeatherPanels.push(currentWeather);
  }
  allWeatherPanels.push(...forecastWeather);
  // Đảm bảo chỉ có tối đa 3 panel, ưu tiên hôm nay, ngày mai, ngày kia
  const displayWeather = allWeatherPanels.slice(0, 3);

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
        <div className="weather-forecast-container">
          {displayWeather.length > 0 ? displayWeather.map((weather, index) => (
            <div key={index} className="weather-panel">
              <div className="weather-day">{weather.day}</div>
              {weather.icon && <FontAwesomeIcon icon={weather.icon} className="weather-icon" />}
              <div className="weather-temp">{weather.temp}</div>
              <div className="weather-description">{weather.description}</div>
            </div>
          )) : (
            // Hiển thị loading hoặc thông báo nếu chưa có dữ liệu
            [...Array(3)].map((_, index) => (
                <div key={index} className="weather-panel placeholder">
                    <div className="weather-day">Đang tải...</div>
                    <div className="weather-icon placeholder-icon"></div>
                    <div className="weather-temp">--°C</div>
                    <div className="weather-description">-----</div>
                </div>
            ))
          )}
        </div>
      </span>

      <span className="item right-container" style={{ background: headerGradient }}>
        <div className="greeting-text">{greeting}</div>
        <div className="username-text">{account?.username || "Đang tải..."}</div>
        <div className="role-text">
          {account ? 
            `Bạn là ${getRoleText()} của chung cư` : 
            <span className="loading-role">Đang tải thông tin...</span>
          }
        </div>

        <div className="icon-button-container">
          <button className="icon-button notification-button" title="Thông báo">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="icon-button message-button"
            title="Tài khoản"
            onClick={onOpenPopup}
          >
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