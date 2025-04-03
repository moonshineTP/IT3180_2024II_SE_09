import { useState } from "react";
import Header from "./Components/Header/Header";
import MenuTab from "./Components/MenuTab/MenuTab";
import TabContent from "./Components/TabContent/TabContent";
import "./index.css";
import "./Components/Header/Header.css";
import "./Components/MenuTab/MenuTab.css";

export default function App() {
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
