import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Tạo file App.jsx chứa toàn bộ layout
import axios from "axios";
const checkAuthentication = async () => {
  console.log("Checking authentication...");
  try {
    // Call the check-in API to verify the JWT
    await axios.get("http://localhost:8080/checkin",{withCredentials: true});
  } catch (error) {
    if (error.response.status !== 200) {
      // Redirect to the login page if unauthorized
      window.location.href = "/index1.html";
    }
  }
};
// Tạo một root duy nhất
checkAuthentication().then(()=>{createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
});
