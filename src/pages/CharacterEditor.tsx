import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { CharacterLeftToolbar } from "@/components/editors/character/CharacterLeftToolbar";
import { CharacterRightPanel } from "@/components/editors/character/CharacterRightPanel";
import { Sparkles, RotateCcw, User, Shirt, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const CharacterEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedView, setSelectedView] = useState('front');
  const [selectedOutfit, setSelectedOutfit] = useState(1);
  const accentColor = "hsl(330 80% 60%)";

  const views = ['front', 'side', 'back', '3/4'];
  const emotions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thoughtful'];
  const outfits = [
    { id: 1, name: 'Casual', icon: '👕' },
    { id: 2, name: 'Formal', icon: '👔' },
    { id: 3, name: 'Athletic', icon: '🏃' },
    { id: 4, name: 'Fantasy', icon: '⚔️' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Untitled Character" 
        projectExtension=".lchar" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <CharacterLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        {/* Main Character Workspace */}
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex overflow-hidden">
          {/* Character Preview */}
          <div className="flex-1 relative p-4 flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[3/4]">
              {/* Character Display */}
              <div className="w-full h-full rounded-2xl overflow-hidden border border-[hsl(var(--cde-border-subtle))] bg-gradient-to-b from-[hsl(var(--cde-bg-secondary))] to-[hsl(var(--cde-bg-tertiary))] shadow-2xl">
                {/* White Room Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                
                {/* Character Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-64 rounded-full bg-gradient-to-b from-[hsl(330_80%_60%)]/20 to-[hsl(330_80%_40%)]/20 flex items-center justify-center">
                      <User className="w-24 h-24 text-[hsl(330_80%_60%)]/50" />
                    </div>
                    {/* Character Silhouette Lines */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-56 border-2 border-dashed border-[hsl(330_80%_60%)]/30 rounded-t-full" />
                    </div>
                  </div>
                </div>

                {/* View Indicator */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[hsl(330_80%_60%)]/20 border border-[hsl(330_80%_60%)]/40">
                  <span className="text-sm font-bold text-[hsl(330_80%_60%)] uppercase">{selectedView}</span>
                </div>

                {/* Character DNA Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">DNA Locked</span>
                </div>

                {/* AI Status */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(330_80%_60%)]/20 border border-[hsl(330_80%_60%)]/40">
                  <Sparkles className="w-4 h-4 text-[hsl(330_80%_60%)]" />
                  <span className="text-xs font-medium text-[hsl(330_80%_60%)]">CastingAI</span>
                </div>

                {/* Rotation Control */}
                <div className="absolute bottom-4 right-4">
                  <Button variant="ghost" size="icon" className="w-10 h-10 bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-secondary))]">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* View Selector */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                {views.map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedView === view
                        ? 'bg-[hsl(330_80%_60%)] text-white shadow-lg shadow-[hsl(330_80%_60%)]/30'
                        : 'bg-[hsl(var(--cde-bg-secondary))] text-[hsl(var(--cde-text-muted))] hover:text-[hsl(var(--cde-text-primary))]'
                    }`}
                  >
                    {view.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel - Variations */}
          <div className="w-64 border-l border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col">
            {/* Outfits Section */}
            <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center gap-2 mb-3">
                <Shirt className="w-4 h-4 text-[hsl(330_80%_60%)]" />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">OUTFITS</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => setSelectedOutfit(outfit.id)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedOutfit === outfit.id
                        ? 'bg-[hsl(330_80%_60%)]/20 border border-[hsl(330_80%_60%)]/50'
                        : 'bg-[hsl(var(--cde-bg-tertiary))] border border-transparent hover:border-[hsl(var(--cde-border-subtle))]'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{outfit.icon}</span>
                    <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">{outfit.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotions Section */}
            <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-[hsl(330_80%_60%)]" />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">EXPRESSIONS</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(330_80%_60%)]/20 transition-colors"
                  >
                    <span className="text-lg block">
                      {emotion === 'neutral' && '😐'}
                      {emotion === 'happy' && '😊'}
                      {emotion === 'sad' && '😢'}
                      {emotion === 'angry' && '😠'}
                      {emotion === 'surprised' && '😮'}
                      {emotion === 'thoughtful' && '🤔'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Character DNA */}
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-[hsl(330_80%_60%)]" />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">CHARACTER DNA</span>
              </div>
              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {['Physical Traits', 'Personality', 'Voice Profile', 'Backstory', 'Relationships'].map((trait) => (
                    <div key={trait} className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] flex items-center justify-between">
                      <span className="text-xs text-[hsl(var(--cde-text-muted))]">{trait}</span>
                      <div className="w-2 h-2 rounded-full bg-[hsl(330_80%_60%)]" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </main>
        
        <CharacterRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="CastingAI Ready" />
    </div>
  );
};

export default CharacterEditor;
