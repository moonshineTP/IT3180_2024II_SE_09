import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Tạo file App.jsx chứa toàn bộ layout
// Kiểm tra đăng nhập
const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

if (!isAuthenticated) {
  window.location.href = "/index1.html";
}
// Tạo một root duy nhất
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
