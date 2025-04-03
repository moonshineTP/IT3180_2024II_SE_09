import React, { useState } from "react";
import TabContentFrame_1 from "../../TabContentFrames/TabContentFrame_1/TabContentFrame_1.jsx";
import DebtHandling from "./DebtHandling/DebtHandling.jsx";
import FeeInfo from "./FeeInfo/FeeInfo.jsx";
import PaymentMonitoring from "./PaymentMonitoring/PaymentMonitoring.jsx";
function FeePayment() {
  const Option = {
    FeeInfo: <FeeInfo />,
    "Payment Monitoring": <PaymentMonitoring />,
    "Debt Handling": <DebtHandling />,
  };
  const [activeNav, setActiveNav] = useState("FeeInfo");
  return (
    <>
      <TabContentFrame_1
        activeTab="FeePayment"
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        Option={Option}
      />
    </>
  );
}
export default FeePayment;
