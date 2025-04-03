import "./TabContentFrame_2.css";
export default function TabContentFrame_2({ content }) {
  return (
    <>
      <div className="tab-content-2">
        <div className="navarea"></div>
        <div className="nav-content">{content}</div>
        <div className="navarea"></div>
      </div>
    </>
  );
}
