import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Play, Clock, Film, Image as ImageIcon, 
  Music, FolderOpen, ChevronRight, Search 
} from "lucide-react";

// Import GITS video assets
import citySceneVideo from "@/assets/gits/videos/city-scene.mp4";
import motokoRotationVideo from "@/assets/gits/videos/motoko-rotation.mp4";
import togusaRotationVideo from "@/assets/gits/videos/togusa-rotation.mp4";
import tunnelSeq1Video from "@/assets/gits/videos/tunnel-sequence-1.mp4";
import tunnelSeq2Video from "@/assets/gits/videos/tunnel-sequence-2.mp4";
import labSceneVideo from "@/assets/gits/videos/lab-scene.mp4";
import motokoArmorVideo from "@/assets/gits/videos/motoko-armor.mp4";
import batouSceneVideo from "@/assets/gits/videos/batou-scene.mp4";
import sceneCompositeVideo from "@/assets/gits/videos/scene-composite.mp4";

interface MediaItem {
  id: string;
  name: string;
  type: "video" | "image" | "audio";
  duration?: string;
  path: string;
  thumbnail?: string;
  category?: string;
}

const gitsVideoAssets: MediaItem[] = [
  { id: "v1", name: "City Scene", type: "video", duration: "00:15:00", path: citySceneVideo, category: "scenes" },
  { id: "v2", name: "Motoko Rotation", type: "video", duration: "00:08:00", path: motokoRotationVideo, category: "characters" },
  { id: "v3", name: "Togusa Rotation", type: "video", duration: "00:07:00", path: togusaRotationVideo, category: "characters" },
  { id: "v4", name: "Tunnel Sequence 1", type: "video", duration: "00:12:00", path: tunnelSeq1Video, category: "scenes" },
  { id: "v5", name: "Tunnel Sequence 2", type: "video", duration: "00:10:00", path: tunnelSeq2Video, category: "scenes" },
  { id: "v6", name: "Lab Scene", type: "video", duration: "00:18:00", path: labSceneVideo, category: "scenes" },
  { id: "v7", name: "Motoko Armor", type: "video", duration: "00:06:00", path: motokoArmorVideo, category: "characters" },
  { id: "v8", name: "Batou Scene", type: "video", duration: "00:14:00", path: batouSceneVideo, category: "characters" },
  { id: "v9", name: "Scene Composite", type: "video", duration: "00:20:00", path: sceneCompositeVideo, category: "composite" },
];

interface VideoMediaBinProps {
  onAddToTimeline?: (item: MediaItem) => void;
}

export const VideoMediaBin = ({ onAddToTimeline }: VideoMediaBinProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredAssets = gitsVideoAssets.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getTypeIcon = (type: MediaItem["type"]) => {
    switch (type) {
      case "video": return <Film className="w-3 h-3" />;
      case "image": return <ImageIcon className="w-3 h-3" />;
      case "audio": return <Music className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
        <input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] text-sm"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full bg-[hsl(var(--cde-bg-tertiary))] p-1">
          <TabsTrigger value="all" className="flex-1 text-xs">All</TabsTrigger>
          <TabsTrigger value="scenes" className="flex-1 text-xs">Scenes</TabsTrigger>
          <TabsTrigger value="characters" className="flex-1 text-xs">Chars</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Import Button */}
      <Button variant="outline" size="sm" className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" />
        Import Media
      </Button>

      {/* Media Grid */}
      <ScrollArea className="h-[280px]">
        <div className="space-y-2">
          {filteredAssets.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item.id)}
              className={`p-2 rounded-lg cursor-pointer transition-all group ${
                selectedItem === item.id
                  ? "bg-[hsl(187_85%_53%/0.2)] border border-[hsl(187_85%_53%/0.4)]"
                  : "bg-[hsl(var(--cde-bg-tertiary))] border border-transparent hover:border-[hsl(var(--cde-border-subtle))]"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Video Preview */}
                <div className="w-20 h-12 rounded bg-black flex-shrink-0 overflow-hidden relative">
                  <video
                    src={item.path}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(item.type)}
                    <p className="text-xs font-medium truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[hsl(var(--cde-text-muted))]">
                    <Clock className="w-3 h-3" />
                    {item.duration}
                    <span className="px-1.5 py-0.5 rounded bg-[hsl(var(--cde-bg-primary))] capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Add to Timeline */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToTimeline?.(item);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Selected Preview */}
      {selectedItem && (
        <div className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
          <div className="aspect-video rounded overflow-hidden bg-black">
            <video
              src={gitsVideoAssets.find(a => a.id === selectedItem)?.path}
              className="w-full h-full object-contain"
              controls
              preload="metadata"
            />
          </div>
        </div>
      )}
    </div>
  );
};
