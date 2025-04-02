import React, { useState } from "react";
import TabContentFrame_1 from "../../TabContentFrames/TabContentFrame_1/TabContentFrame_1.jsx";
import EventNotification from "./EventNotification/EventNotification.jsx";
import PaymentNotification from "./PaymentNotification/PaymentNotification.jsx";
import PlanNotification from "./PlanNotification/PlanNotification.jsx";
import WarningNotification from "./WarningNotification/WarningNotification.jsx";
function Notification() {
  const Option = {
    "Event Notification": <EventNotification />,
    "Payment Notification": <PaymentNotification />,
    "Warning Notification": <WarningNotification />,
    "Plan Notification": <PlanNotification />,
  };
  const [activeNav, setActiveNav] = useState("Event Notification");
  return (
    <>
      <TabContentFrame_1
        activeTab="Notification"
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        Option={Option}
      />
    </>
  );
}
export default Notification;
