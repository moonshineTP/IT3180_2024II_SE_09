import React, { useState } from "react";
import "./NavMenu.css";

export default function NavMenu({ activeNav, setActiveNav, array }) {
  const handleTabClick = (tab) => {
    setActiveNav(tab);
  };

  return (
    <div className="navmenu">
      {array.map((tab) => (
        <button
          key={tab}
          className={`nav-button ${activeNav === tab ? "active" : ""}`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
