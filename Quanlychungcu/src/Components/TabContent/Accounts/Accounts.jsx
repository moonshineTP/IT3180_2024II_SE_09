import TabContentFrame_2 from "../../TabContentFrames/TabContentFrame_2/TabContentFame_2";

function HouseHoldInfocontent () {
  return (
    <>
      <div>This is HouseHoldInfo</div>
    </>
  );
}
export default function HouseHoldInfo() {
  return <TabContentFrame_2 content={HouseHoldInfocontent()} />;
}