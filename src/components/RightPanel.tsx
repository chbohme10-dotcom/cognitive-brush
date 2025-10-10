import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayersPanel } from "./panels/LayersPanel";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { ColorSphere } from "./panels/ColorSphere";
import { AIToolsPanel } from "./ai/AIToolsPanel";
import { MicroscopePanel } from "./panels/MicroscopePanel";
import { Layers, Settings2, Palette, Sparkles, ZoomIn, Microscope } from "lucide-react";

export const RightPanel = () => {
  return (
    <aside className="w-80 border-l border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col">
      <Tabs defaultValue="layers" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-6 bg-[hsl(var(--cde-bg-tertiary))] p-1 gap-1">
          <TabsTrigger 
            value="layers" 
            className="data-[state=active]:bg-[hsl(var(--cde-accent-purple))] data-[state=active]:text-white gap-2"
          >
            <Layers className="w-4 h-4" />
            Layers
          </TabsTrigger>
          <TabsTrigger 
            value="properties"
            className="data-[state=active]:bg-[hsl(var(--cde-accent-purple))] data-[state=active]:text-white gap-2"
          >
            <Settings2 className="w-4 h-4" />
            Props
          </TabsTrigger>
          <TabsTrigger 
            value="color"
            className="data-[state=active]:bg-[hsl(var(--cde-accent-purple))] data-[state=active]:text-white gap-2"
          >
            <Palette className="w-4 h-4" />
            Color
          </TabsTrigger>
          <TabsTrigger 
            value="ai"
            className="data-[state=active]:bg-[hsl(var(--cde-accent-purple))] data-[state=active]:text-white gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI
          </TabsTrigger>
          <TabsTrigger 
            value="microscope"
            className="data-[state=active]:bg-[hsl(var(--cde-accent-purple))] data-[state=active]:text-white gap-2"
          >
            <Microscope className="w-4 h-4" />
            Micro
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="layers" className="h-full m-0">
            <LayersPanel />
          </TabsContent>
          
          <TabsContent value="properties" className="h-full m-0">
            <PropertiesPanel />
          </TabsContent>
          
          <TabsContent value="color" className="h-full m-0">
            <ColorSphere />
          </TabsContent>
          
          <TabsContent value="ai" className="h-full m-0">
            <AIToolsPanel />
          </TabsContent>
          
          <TabsContent value="microscope" className="h-full m-0">
            <MicroscopePanel />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};
