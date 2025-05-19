import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Header from "./Components/Header/Header";
import MenuTab from "./Components/MenuTab/MenuTab";
import TabContent from "./Components/TabContent/TabContent";
import "./index.css";
import "./Components/Header/Header.css";
import "./Components/MenuTab/MenuTab.css";


export default function App() {
  useEffect(() => {
    const sendPing = async () => {
      try {
        await axios.post("http://localhost:8080/ping", null, {
          withCredentials: true,
        });
        console.log("Ping sent");
      } catch (error) {
        if(error.response.status === 403) {
          // Nếu nhận được mã lỗi 403, chuyển hướng đến trang đăng nhập
          window.location.href = "/index1.html";
        } 
        console.error("Ping failed:", error);
      }
    };

    // Gửi ping lần đầu
    sendPing();

    // Gửi ping định kỳ mỗi 30 giây
    const intervalId = setInterval(sendPing, 30000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);
  const [activeTab, setActiveTab] = useState("Home");
  return (
    <>
      <Header />
      {/* Truyền props xuống MenuTab */}
      <div id="main">
        <MenuTab activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Truyền prop xuống TabContent */}
        <TabContent activeTab={activeTab} />
      </div>
      <div id="footer">
        <p>Xin nhẹ tay...</p>
      </div>
    </>
  );
}
