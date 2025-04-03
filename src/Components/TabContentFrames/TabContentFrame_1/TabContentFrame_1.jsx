import React, { useState } from "react";
import "./TabContentFrame_1.css";
import NavMenu from "../../TabContent/NavMenu/NavMenu";
export default function TabContentFrame_1({
  activeTab,
  activeNav,
  setActiveNav,
  Option,
}) {
  const array = Object.keys(Option);
  return (
    <>
      <div className="tab-content-1">
        <div className="navarea">
          <p>
            {activeTab} <hr />
          </p>
          <NavMenu
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            array={array}
          />
        </div>
        <div className="nav-content">{Option[activeNav]}</div>
      </div>
    </>
  );
}
