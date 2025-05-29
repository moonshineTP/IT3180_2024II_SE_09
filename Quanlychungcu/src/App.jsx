import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Header from "./Components/Header/Header";
import MenuTab from "./Components/MenuTab/MenuTab";
import TabContent from "./Components/TabContent/TabContent";
import "./index.css";
import "./Components/Header/Header.css";
import "./Components/MenuTab/MenuTab.css";
import PopUp from "./Components/PopUp/PopUp";
import AccountPopUp from "./Components/TabContent/Accounts/AccountPopUp";
import ResidentPopUp from "./Components/TabContent/HouseHoldInfo/ResidentPopUp"; // <-- THÊM DÒNG NÀY
import VehiclePopUp from "./Components/TabContent/HouseHoldInfo/VehiclePopUp"; // <-- THÊM DÒNG NÀY nếu có
import HouseholdPopUp from "./Components/TabContent/HouseHoldInfo/HouseholdPopUp"; // <-- THÊM DÒNG NÀY nếu có

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [householdChoice, setHouseholdChoice] = useState('');
  const [residentChoice, setResidentChoice] = useState(null);
  const [vehicleChoice, setVehicleChoice] = useState(null);
  const [accountChoice, setAccountChoice]= useState(null);
  const [reloadFunc, setReloadFunc] = useState(null);
   const [activePopUp, setActivePopUp] = useState(null);

  const fetchAccount = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/gettarget/getPrivateAccount",null,
        { withCredentials: true }
      );
      setAccountInfo(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tài khoản:", error);
      if (error.response?.status === 403) {
        window.location.href = "/index1.html";
      }
    }
  };
  const openPopUp = async(type, data = null) => {
    await fetchAccount();
    switch(type) {
      case 'account':
        setAccountChoice(data);
        setActivePopUp('account');
        break;
      case 'resident':
        setResidentChoice(data);
        setActivePopUp('resident');
        break;
      case 'vehicle':
        setVehicleChoice(data);
        setActivePopUp('vehicle');
        break;
      case 'household':
        setHouseholdChoice(data);
        setActivePopUp('household');
        break;
      default:
        setActivePopUp(null);
    }
    setIsOpen(true);
  };

  // Hàm đóng popup
  const closePopUp = async (secret=null) => {
    await fetchAccount();
    setIsOpen(false);
    setActivePopUp(null);
    if(secret) secret();
  };

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

    const init = async () => {
      // Gửi ping lần đầu
      await sendPing();
      fetchAccount();
    };

    init();

    // Gửi ping định kỳ mỗi 30 giây
    const intervalId = setInterval(sendPing, 30000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Header 
      onOpenPopUp={openPopUp}
      account={accountInfo}
      onChoice={setAccountChoice}
      />
      {/* Truyền props xuống MenuTab */}
      {/* Thêm điều kiện render PopUp */}
      {isOpen && (
        <PopUp isOpen={isOpen} onClose={closePopUp}>
          {activePopUp === 'account' && (
            <AccountPopUp account={accountChoice} reloadFunc={reloadFunc} onOpenPopUp={openPopUp} viewerAccount={accountInfo}/>
          )}
          {activePopUp === 'resident' && (
            <ResidentPopUp data={residentChoice} onResidentSaved={reloadFunc} onOpenPopUp={openPopUp} viewerAccount={accountInfo}/>
          )}
          {activePopUp === 'vehicle' && (
            <VehiclePopUp data={vehicleChoice} onVehicleSaved={reloadFunc} onOpenPopUp={openPopUp} viewerAccount={accountInfo}/>
          )}
          {activePopUp === 'household' && (
            <HouseholdPopUp data={householdChoice} onOpenPopUp={openPopUp}/>
          )}
        </PopUp>
      )}
      <div id="main">
        <MenuTab activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Truyền prop xuống TabContent */}
        <TabContent activeTab={activeTab} onOpenPopUp={openPopUp} onChoice={setAccountChoice} setReloadFunc={setReloadFunc} ViewerAccount={accountInfo}/>
      </div>
      <div id="footer">
        <p>Xin nhẹ tay...</p>
      </div>
    </>
  );
}
