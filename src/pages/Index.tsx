import { TopBar } from "@/components/TopBar";
import { LeftToolbar } from "@/components/LeftToolbar";
import { Canvas } from "@/components/Canvas";
import { RightPanel } from "@/components/RightPanel";
import { BottomBar } from "@/components/BottomBar";

const Index = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftToolbar />
        <Canvas />
        <RightPanel />
      </div>
      
      <BottomBar />
    </div>
  );
};

export default Index;
