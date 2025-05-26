import Home from "./Home/Home.jsx";
import Accounts from "./Accounts/Accounts.jsx";
import HouseHoldInfo from "./HouseHoldInfo/HouseHoldInfo.jsx";
import FeePayment from "./FeePayment/FeePayment.jsx";
import Notification from "./Notification/Notification.jsx";
import Complaint from "./Complaint/Complaint.jsx";
export default function TabContent({ activeTab, onOpenPopUp, setReloadFunc, ViewerAccount}) {
  const components = {
    Home: <Home />,
    Accounts: <Accounts onOpenPopUp={onOpenPopUp} setReloadFunc={setReloadFunc}/>,
    HouseHoldInfo: <HouseHoldInfo onOpenPopUp={onOpenPopUp} ViewerAccount={ViewerAccount} setReloadFunc={setReloadFunc}/>,
    FeePayment: <FeePayment onOpenPopUp={onOpenPopUp}/>,
    Notification: <Notification onOpenPopUp={onOpenPopUp}/>,
    Complaint: <Complaint onOpenPopUp={onOpenPopUp}/>,
  };
  return (
    <div className="tab-content">{components[activeTab]}</div>
  );
}
