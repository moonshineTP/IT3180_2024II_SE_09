import TabContentFrame_2 from "../../TabContentFrames/TabContentFrame_2/TabContentFame_2";

function Homecontent() {
  return (
    <>
      <div>This is Home</div>
    </>
  );
}
export default function Home() {
  return <TabContentFrame_2 content={Homecontent()} />;
}
