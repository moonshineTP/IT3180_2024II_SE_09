import TabContentFrame_2 from "../../TabContentFrames/TabContentFrame_2/TabContentFame_2";

function ComplaintContent() {
  return (
    <>
      <div>This is Complaint</div>
    </>
  );
}
export default function ComplaintInfo() {
  return <TabContentFrame_2 content={ComplaintContent()} />;
}
