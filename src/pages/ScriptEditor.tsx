import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { ScriptLeftToolbar } from "@/components/editors/script/ScriptLeftToolbar";
import { ScriptRightPanel } from "@/components/editors/script/ScriptRightPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

const MOCK_SCRIPT = [
  {
    type: 'scene',
    content: 'INT. TUNNEL - NIGHT',
  },
  {
    type: 'action',
    content: 'The tunnel stretches into darkness. Red emergency lights pulse rhythmically, casting crimson shadows on the wet concrete walls. Water drips from overhead pipes.',
  },
  {
    type: 'character',
    content: 'MOTOKO',
  },
  {
    type: 'parenthetical',
    content: '(into comms)',
  },
  {
    type: 'dialogue',
    content: "I'm entering the maintenance tunnel now. Section 9, are you reading me?",
  },
  {
    type: 'character',
    content: 'BATOU (V.O.)',
  },
  {
    type: 'dialogue',
    content: "Copy that, Major. Thermal shows two heat signatures ahead. Moving slow.",
  },
  {
    type: 'action',
    content: 'Motoko drops from an overhead hatch, landing silently in a crouch. Her thermoptic camouflage shimmers as it adjusts to the low light.',
  },
  {
    type: 'action',
    content: 'She produces a smoke grenade from her tactical vest, pulls the pin.',
  },
  {
    type: 'character',
    content: 'MOTOKO',
  },
  {
    type: 'dialogue',
    content: 'Going dark.',
  },
  {
    type: 'action',
    content: 'She tosses the grenade. It bounces once, twice, then erupts in a cloud of thick white smoke that fills the tunnel.',
  },
  {
    type: 'transition',
    content: 'CUT TO:',
  },
  {
    type: 'scene',
    content: 'INT. SECTION 9 CONTROL ROOM - CONTINUOUS',
  },
  {
    type: 'action',
    content: 'Multiple screens display various camera feeds. TOGUSA watches intently, adjusting his headset.',
  },
  {
    type: 'character',
    content: 'TOGUSA',
  },
  {
    type: 'dialogue',
    content: "Major's signal is breaking up. The interference from those old power lines is killing our connection.",
  },
];

const ScriptEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  
  const accentColor = "hsl(45 80% 55%)";

  const getLineStyle = (type: string) => {
    switch (type) {
      case 'scene':
        return 'font-bold uppercase text-[hsl(45_80%_55%)] bg-[hsl(45_80%_55%)]/10 px-4 py-2 rounded';
      case 'action':
        return 'text-[hsl(var(--cde-text-primary))]';
      case 'character':
        return 'uppercase text-center font-semibold text-[hsl(var(--cde-text-primary))] mt-4';
      case 'parenthetical':
        return 'text-center italic text-[hsl(var(--cde-text-muted))] text-sm';
      case 'dialogue':
        return 'text-center max-w-md mx-auto text-[hsl(var(--cde-text-primary))]';
      case 'transition':
        return 'text-right uppercase font-semibold text-[hsl(var(--cde-text-muted))] mt-6';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Ghost in the Shell - Tunnel Infiltration" 
        projectExtension=".lscript" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ScriptLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        {/* Main Script Editor */}
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex justify-center overflow-hidden">
          <div className="w-full max-w-3xl h-full flex flex-col">
            {/* Script Page */}
            <ScrollArea className="flex-1">
              <div className="p-8 pb-32">
                {/* Script Header */}
                <div className="mb-8 pb-4 border-b border-[hsl(var(--cde-border-subtle))]">
                  <h1 className="text-2xl font-bold text-[hsl(var(--cde-text-primary))] text-center mb-2">
                    GHOST IN THE SHELL
                  </h1>
                  <p className="text-center text-sm text-[hsl(var(--cde-text-muted))]">
                    Based on the manga by Masamune Shirow
                  </p>
                  <p className="text-center text-xs text-[hsl(var(--cde-text-muted))] mt-1">
                    DRAFT 1.2 — CONFIDENTIAL
                  </p>
                </div>

                {/* Script Content */}
                <div className="space-y-2 font-mono text-sm">
                  {MOCK_SCRIPT.map((line, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedLine(index)}
                      className={`py-1 px-2 rounded cursor-text transition-all ${getLineStyle(line.type)} ${
                        selectedLine === index 
                          ? 'ring-2 ring-[hsl(45_80%_55%)] ring-offset-2 ring-offset-[hsl(var(--cde-bg-primary))]' 
                          : 'hover:bg-[hsl(var(--cde-bg-secondary))]'
                      }`}
                    >
                      {line.content}
                    </div>
                  ))}
                </div>

                {/* Page indicator */}
                <div className="mt-12 text-center">
                  <span className="text-xs text-[hsl(var(--cde-text-muted))]">— 1 —</span>
                </div>
              </div>
            </ScrollArea>

            {/* Writing status bar */}
            <div className="h-8 px-4 flex items-center justify-between bg-[hsl(var(--cde-bg-secondary))] border-t border-[hsl(var(--cde-border-subtle))]">
              <div className="flex items-center gap-4 text-xs text-[hsl(var(--cde-text-muted))]">
                <span>Page 1 of 12</span>
                <span>•</span>
                <span>Scene 1: Tunnel Infiltration</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[hsl(var(--cde-text-muted))]">
                <span>Words: 847</span>
                <span>•</span>
                <span>Est. ~1 min</span>
              </div>
            </div>
          </div>
        </main>
        
        <ScriptRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="Script Editor Ready" />
    </div>
  );
};

export default ScriptEditor;
