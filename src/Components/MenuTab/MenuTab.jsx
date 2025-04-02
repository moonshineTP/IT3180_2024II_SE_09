import React, { useState } from "react";
import "./MenuTab.css";

export default function MenuTab({ activeTab, setActiveTab }) {
  const tabs = [
    "Home",
    "Accounts",
    "HouseHoldInfo",
    "FeePayment",
    "Notification",
    "Complaint",
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="menu-tab-container">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${activeTab === tab ? "active" : ""}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
