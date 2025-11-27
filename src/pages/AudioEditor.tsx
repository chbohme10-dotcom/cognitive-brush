import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { AudioLeftToolbar } from "@/components/editors/audio/AudioLeftToolbar";
import { AudioRightPanel } from "@/components/editors/audio/AudioRightPanel";
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const AudioEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const accentColor = "hsl(38 92% 50%)";

  // Mock track data
  const tracks = [
    { id: 1, name: 'Dialogue - Main', type: 'voice', color: 'hsl(330 80% 60%)', clips: [{ start: 10, duration: 30 }, { start: 50, duration: 25 }] },
    { id: 2, name: 'Background Music', type: 'music', color: 'hsl(38 92% 50%)', clips: [{ start: 0, duration: 80 }] },
    { id: 3, name: 'Ambient - Forest', type: 'sfx', color: 'hsl(142 71% 45%)', clips: [{ start: 5, duration: 70 }] },
    { id: 4, name: 'Foley - Footsteps', type: 'sfx', color: 'hsl(200 80% 50%)', clips: [{ start: 15, duration: 20 }, { start: 45, duration: 15 }] },
    { id: 5, name: 'AI Voice Over', type: 'ai-voice', color: 'hsl(280 70% 55%)', clips: [{ start: 35, duration: 40 }] },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Untitled Audio" 
        projectExtension=".laud" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <AudioLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        {/* Main Audio Workspace */}
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex flex-col overflow-hidden">
          {/* Waveform Visualization Area */}
          <div className="flex-1 relative p-4">
            <div className="absolute inset-4 rounded-2xl overflow-hidden border border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))]">
              {/* Timeline Header */}
              <div className="h-8 border-b border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))] flex items-center">
                <div className="w-48 px-3 border-r border-[hsl(var(--cde-border-subtle))]">
                  <span className="text-xs font-medium text-[hsl(var(--cde-text-muted))]">TRACKS</span>
                </div>
                <div className="flex-1 relative">
                  {/* Time markers */}
                  <div className="flex">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="flex-1 text-center">
                        <span className="text-[10px] font-mono text-[hsl(var(--cde-text-muted))]">{i * 5}s</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tracks Area */}
              <div className="flex-1 overflow-y-auto">
                {tracks.map((track) => (
                  <div key={track.id} className="flex h-20 border-b border-[hsl(var(--cde-border-subtle))]">
                    {/* Track Info */}
                    <div className="w-48 p-2 border-r border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))] flex flex-col justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: track.color }} />
                        <span className="text-xs font-medium text-[hsl(var(--cde-text-primary))] truncate">{track.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--cde-bg-secondary))] text-[hsl(var(--cde-text-muted))] uppercase">
                          {track.type}
                        </span>
                        <Volume2 className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
                        <Slider defaultValue={[80]} max={100} className="w-16 h-1" />
                      </div>
                    </div>
                    
                    {/* Waveform Area */}
                    <div className="flex-1 relative bg-[hsl(var(--cde-bg-primary))]">
                      {track.clips.map((clip, i) => (
                        <div
                          key={i}
                          className="absolute top-2 bottom-2 rounded-lg overflow-hidden"
                          style={{
                            left: `${clip.start}%`,
                            width: `${clip.duration}%`,
                            backgroundColor: track.color + '30',
                            borderLeft: `3px solid ${track.color}`,
                          }}
                        >
                          {/* Waveform visualization */}
                          <div className="absolute inset-0 flex items-center px-1 gap-px">
                            {Array.from({ length: 60 }).map((_, j) => (
                              <div
                                key={j}
                                className="flex-1 rounded-full"
                                style={{
                                  backgroundColor: track.color,
                                  height: `${20 + Math.random() * 60}%`,
                                  opacity: 0.7,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Playhead */}
              <div 
                className="absolute top-8 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
                style={{ left: `calc(192px + ${currentTime}%)` }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="h-20 border-t border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex items-center justify-center gap-4 px-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                className="w-14 h-14 rounded-full"
                style={{ backgroundColor: accentColor }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 max-w-md">
              <Slider 
                value={[currentTime]} 
                onValueChange={(v) => setCurrentTime(v[0])} 
                max={100} 
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))]">
                <span className="text-sm font-mono text-[hsl(var(--cde-text-secondary))]">00:00:00</span>
                <span className="text-[hsl(var(--cde-text-muted))]">/</span>
                <span className="text-sm font-mono text-[hsl(var(--cde-text-muted))]">00:05:30</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(38_92%_50%)]/20 border border-[hsl(38_92%_50%)]/30">
                <Sparkles className="w-4 h-4 text-[hsl(38_92%_50%)]" />
                <span className="text-xs font-medium text-[hsl(38_92%_50%)]">AudioForge</span>
              </div>
            </div>
          </div>
        </main>
        
        <AudioRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="AudioForge Ready" />
    </div>
  );
};

export default AudioEditor;
