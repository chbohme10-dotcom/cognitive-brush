import { useState, useRef } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { CharacterLeftToolbar } from "@/components/editors/character/CharacterLeftToolbar";
import { CharacterRightPanel } from "@/components/editors/character/CharacterRightPanel";
import { Sparkles, RotateCcw, User, Shirt, Heart, Brain, Upload, Image as ImageIcon, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Import GITS character images for demo
import motokoArmor from "@/assets/gits/characters/motoko-armor.png";
import motokoCasual from "@/assets/gits/characters/motoko-casual.png";
import batouProfile from "@/assets/gits/characters/batou-profile.png";
import togusaProfile from "@/assets/gits/characters/togusa-profile.png";

const ROTATION_ANGLES = [
  { id: "front", label: "Front", angle: 0 },
  { id: "front-3/4-left", label: "3/4 L", angle: 45 },
  { id: "side-left", label: "Side L", angle: 90 },
  { id: "back", label: "Back", angle: 180 },
  { id: "side-right", label: "Side R", angle: 270 },
  { id: "front-3/4-right", label: "3/4 R", angle: 315 },
];

const PRESET_CHARACTERS = [
  { id: 'motoko-armor', name: 'Motoko (Armor)', image: motokoArmor },
  { id: 'motoko-casual', name: 'Motoko (Casual)', image: motokoCasual },
  { id: 'batou', name: 'Batou', image: batouProfile },
  { id: 'togusa', name: 'Togusa', image: togusaProfile },
];

const CharacterEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedView, setSelectedView] = useState('front');
  const [selectedOutfit, setSelectedOutfit] = useState(1);
  const [referenceImage, setReferenceImage] = useState<string | null>(motokoArmor);
  const [characterName, setCharacterName] = useState("Motoko Kusanagi");
  const [generatedAngles, setGeneratedAngles] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnglesForGen, setSelectedAnglesForGen] = useState<string[]>(["front", "front-3/4-left", "side-left", "back"]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const accentColor = "hsl(330 80% 60%)";

  const emotions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thoughtful'];
  const outfits = [
    { id: 1, name: 'Armor', icon: '🛡️' },
    { id: 2, name: 'Casual', icon: '👕' },
    { id: 3, name: 'Tactical', icon: '🎯' },
    { id: 4, name: 'Formal', icon: '👔' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target?.result as string);
        setGeneratedAngles({});
        toast.success("Reference image loaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const loadPresetCharacter = (preset: typeof PRESET_CHARACTERS[0]) => {
    setReferenceImage(preset.image);
    setCharacterName(preset.name);
    setGeneratedAngles({});
    toast.success(`Loaded ${preset.name}`);
  };

  const toggleAngleSelection = (angleId: string) => {
    setSelectedAnglesForGen(prev => 
      prev.includes(angleId) 
        ? prev.filter(id => id !== angleId)
        : [...prev, angleId]
    );
  };

  const handleBatchGenerate = async () => {
    if (!referenceImage) {
      toast.error("Please load a reference image first");
      return;
    }
    
    setIsGenerating(true);
    toast.info(`Generating ${selectedAnglesForGen.length} angle views...`);
    
    for (const angleId of selectedAnglesForGen) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGeneratedAngles(prev => ({
        ...prev,
        [angleId]: referenceImage
      }));
    }
    
    setIsGenerating(false);
    toast.success("Character pack generated!");
  };

  const handleRotationGenerate = (prompts: string[]) => {
    toast.info(`Generating ${prompts.length} rotation views with AI...`);
    handleBatchGenerate();
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName={characterName} 
        projectExtension=".lchar" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <CharacterLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex overflow-hidden">
          <div className="flex-1 relative p-4 flex flex-col">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="bg-transparent border-b border-[hsl(var(--cde-border-subtle))] text-lg font-semibold text-[hsl(var(--cde-text-primary))] focus:outline-none focus:border-[hsl(330_80%_60%)]"
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Load Reference
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* Main Character Display */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-[3/4]">
                <div className="w-full h-full rounded-2xl overflow-hidden border border-[hsl(var(--cde-border-subtle))] bg-gradient-to-b from-[hsl(var(--cde-bg-secondary))] to-[hsl(var(--cde-bg-tertiary))] shadow-2xl">
                  {referenceImage ? (
                    <img 
                      src={generatedAngles[selectedView] || referenceImage} 
                      alt={characterName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <User className="w-24 h-24 text-[hsl(330_80%_60%)]/30 mx-auto mb-4" />
                        <p className="text-[hsl(var(--cde-text-muted))]">Load a reference image to begin</p>
                        <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[hsl(330_80%_60%)]/20 border border-[hsl(330_80%_60%)]/40">
                    <span className="text-sm font-bold text-[hsl(330_80%_60%)] uppercase">{selectedView.replace(/-/g, ' ')}</span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                    <div className={`w-2 h-2 rounded-full ${referenceImage ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                    <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">
                      {referenceImage ? 'DNA Locked' : 'No Reference'}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(330_80%_60%)]/20 border border-[hsl(330_80%_60%)]/40">
                    <Sparkles className={`w-4 h-4 text-[hsl(330_80%_60%)] ${isGenerating ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-medium text-[hsl(330_80%_60%)]">
                      {isGenerating ? 'Generating...' : 'CastingAI'}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-10 h-10 bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(var(--cde-bg-secondary))]"
                      onClick={() => {
                        const views = ROTATION_ANGLES.map(a => a.id);
                        const currentIdx = views.indexOf(selectedView);
                        const nextIdx = (currentIdx + 1) % views.length;
                        setSelectedView(views[nextIdx]);
                      }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Angle Grid */}
            <div className="mt-4 p-4 rounded-xl bg-[hsl(var(--cde-bg-secondary))] border border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-[hsl(330_80%_60%)]" />
                  <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">CHARACTER PACK</span>
                </div>
                <Button 
                  size="sm"
                  className="bg-[hsl(330_80%_60%)] hover:bg-[hsl(330_80%_50%)]"
                  onClick={handleBatchGenerate}
                  disabled={isGenerating || !referenceImage}
                >
                  {isGenerating ? (
                    <><Sparkles className="w-4 h-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" />Generate Pack ({selectedAnglesForGen.length})</>
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-6 gap-2">
                {ROTATION_ANGLES.map((angle) => (
                  <div key={angle.id} className="relative group">
                    <button
                      onClick={() => setSelectedView(angle.id)}
                      className={`w-full aspect-square rounded-lg overflow-hidden transition-all ${
                        selectedView === angle.id
                          ? 'ring-2 ring-[hsl(330_80%_60%)] ring-offset-2 ring-offset-[hsl(var(--cde-bg-secondary))]'
                          : 'hover:ring-1 hover:ring-[hsl(var(--cde-border-subtle))]'
                      } ${generatedAngles[angle.id] ? 'bg-[hsl(var(--cde-bg-tertiary))]' : 'bg-[hsl(var(--cde-bg-primary))]'}`}
                    >
                      {generatedAngles[angle.id] ? (
                        <img src={generatedAngles[angle.id]} alt={angle.label} className="w-full h-full object-cover" />
                      ) : referenceImage && angle.id === 'front' ? (
                        <img src={referenceImage} alt={angle.label} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">{angle.angle}°</span>
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleAngleSelection(angle.id); }}
                      className={`absolute top-1 right-1 w-4 h-4 rounded-sm border transition-all ${
                        selectedAnglesForGen.includes(angle.id)
                          ? 'bg-[hsl(330_80%_60%)] border-[hsl(330_80%_60%)]'
                          : 'bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {selectedAnglesForGen.includes(angle.id) && (
                        <span className="text-white text-[10px] flex items-center justify-center">✓</span>
                      )}
                    </button>
                    <span className="block text-center text-[10px] text-[hsl(var(--cde-text-muted))] mt-1">{angle.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-64 border-l border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col">
            {/* Preset Characters */}
            <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-[hsl(330_80%_60%)]" />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">GITS CHARACTERS</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_CHARACTERS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPresetCharacter(preset)}
                    className={`aspect-square rounded-lg overflow-hidden border transition-all ${
                      referenceImage === preset.image
                        ? 'border-[hsl(330_80%_60%)] ring-1 ring-[hsl(330_80%_60%)]'
                        : 'border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(330_80%_60%/0.5)]'
                    }`}
                  >
                    <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Outfits */}
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

            {/* Expressions */}
            <div className="p-4 border-b border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-[hsl(330_80%_60%)]" />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))]">EXPRESSIONS</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {emotions.map((emotion) => (
                  <button key={emotion} className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] hover:bg-[hsl(330_80%_60%)]/20 transition-colors">
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
                  {['Face Embedding', 'Style Lock', 'Proportion Map', 'Distinctive Features', 'Voice Profile'].map((trait) => (
                    <div key={trait} className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] flex items-center justify-between">
                      <span className="text-xs text-[hsl(var(--cde-text-muted))]">{trait}</span>
                      <div className={`w-2 h-2 rounded-full ${referenceImage ? 'bg-[hsl(330_80%_60%)]' : 'bg-[hsl(var(--cde-text-muted))]'}`} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </main>
        
        <CharacterRightPanel 
          activeTool={activeTool} 
          characterImage={referenceImage || undefined}
          characterName={characterName}
          onGenerateRotations={handleRotationGenerate}
        />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage={isGenerating ? "Generating character pack..." : "CastingAI Ready"} />
    </div>
  );
};

export default CharacterEditor;
