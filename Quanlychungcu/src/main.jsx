import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Tạo file App.jsx chứa toàn bộ layout
import axios from "axios";
const checkAuthentication = async () => {
  try {
    // Call the check-in API to verify the JWT
    await axios.get("/checkin", { withCredentials: true });
  } catch (error) {
    console.error("Authentication check failed:", error);
  }

};
// Tạo một root duy nhất
checkAuthentication().then(()=>{createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
});
