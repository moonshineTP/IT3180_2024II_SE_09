import React, { useState } from "react";
import TabContentFrame_1 from "../../TabContentFrames/TabContentFrame_1/TabContentFrame_1.jsx";
import ImplementAuthorization from "./ImplementAuthorization/ImplementAuthorization.jsx";
import OthersAccount from "./OthersAccount/OthersAccount.jsx";
import YourAccount from "./YourAccount/YourAccount.jsx";
function Accounts() {
  const Option = {
    "Your account": <YourAccount />,
    "Other's accounts": <OthersAccount />,
    "Implement authorization": <ImplementAuthorization />,
  };
  const [activeNav, setActiveNav] = useState("Your account");
  return (
    <>
      <TabContentFrame_1
        activeTab="Accounts"
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        Option={Option}
      />
    </>
  );
}
export default Accounts;
