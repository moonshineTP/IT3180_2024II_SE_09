import React, { act } from "react";
import Home from "./Home/Home.jsx";
import Accounts from "./Accounts/Accounts.jsx";
import HouseHoldInfo from "./HouseHoldInfo/HouseHoldInfo.jsx";
import FeePayment from "./FeePayment/FeePayment.jsx";
import Notification from "./Notification/Notification.jsx";
import Complaint from "./Complaint/Complaint.jsx";
export default function TabContent({ activeTab }) {
  const components = {
    Home: <Home />,
    Accounts: <Accounts />,
    HouseHoldInfo: <HouseHoldInfo />,
    FeePayment: <FeePayment />,
    Notification: <Notification />,
    Complaint: <Complaint />,
  };
  return (
    <>
      <div className="tab-content">{components[activeTab]}</div>
    </>
  );
}
