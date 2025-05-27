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
    FeePayment: <FeePayment onOpenPopUp={onOpenPopUp} ViewerAccount={ViewerAccount} setReloadFunc={setReloadFunc}/>,
    Notification: <Notification onOpenPopUp={onOpenPopUp} ViewerAccount={ViewerAccount} setReloadFunc={setReloadFunc}/>,
    Complaint: <Complaint onOpenPopUp={onOpenPopUp} ViewerAccount={ViewerAccount} setReloadFunc={setReloadFunc}/>,
  };
  return (
    <div className="tab-content">{components[activeTab]}</div>
  );
}
