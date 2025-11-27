import { useState } from "react";
import { EditorTopBar } from "@/components/editors/shared/EditorTopBar";
import { EditorBottomBar } from "@/components/editors/shared/EditorBottomBar";
import { VideoLeftToolbar } from "@/components/editors/video/VideoLeftToolbar";
import { VideoRightPanel } from "@/components/editors/video/VideoRightPanel";
import { Play, Pause, SkipBack, SkipForward, Scissors, Film, Sparkles, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const VideoEditor = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(25);
  const accentColor = "hsl(187 85% 53%)";

  // Mock timeline clips
  const videoTracks = [
    { id: 1, name: 'Main Video', clips: [{ start: 0, duration: 40, thumbnail: '🎬' }, { start: 45, duration: 35, thumbnail: '🎥' }] },
    { id: 2, name: 'B-Roll', clips: [{ start: 10, duration: 20, thumbnail: '📹' }, { start: 60, duration: 25, thumbnail: '🎞️' }] },
  ];

  const audioTracks = [
    { id: 1, name: 'Dialogue', color: 'hsl(330 80% 60%)' },
    { id: 2, name: 'Music', color: 'hsl(38 92% 50%)' },
    { id: 3, name: 'SFX', color: 'hsl(142 71% 45%)' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[hsl(var(--cde-bg-primary))]">
      <EditorTopBar 
        projectName="Untitled Video" 
        projectExtension=".lvid" 
        accentColor={accentColor}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <VideoLeftToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        
        {/* Main Video Workspace */}
        <main className="flex-1 relative bg-[hsl(var(--cde-bg-primary))] flex flex-col overflow-hidden">
          {/* Video Preview Area */}
          <div className="flex-1 relative p-4 min-h-0">
            <div className="absolute inset-4 rounded-2xl overflow-hidden border border-[hsl(var(--cde-border-subtle))] bg-black flex items-center justify-center">
              {/* Video Preview */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Cinematic Bars */}
                <div className="absolute top-0 left-0 right-0 h-[10%] bg-black" />
                <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-black" />
                
                {/* Preview Content */}
                <div className="w-[80%] aspect-video bg-gradient-to-br from-[hsl(220_30%_15%)] to-[hsl(220_30%_25%)] rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <Film className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--cde-text-muted))] opacity-50" />
                    <p className="text-[hsl(var(--cde-text-muted))]">Video Preview</p>
                  </div>
                  
                  {/* Frame Counter */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                    <span className="text-xs font-mono text-white/80">FRAME: 00:00:12:15</span>
                  </div>
                  
                  {/* Resolution Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                    <span className="text-xs font-mono text-white/80">4K UHD</span>
                  </div>

                  {/* AI Processing Indicator */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-[hsl(187_85%_53%)]/30 backdrop-blur-sm border border-[hsl(187_85%_53%)]/50 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-[hsl(187_85%_53%)]" />
                    <span className="text-xs font-medium text-white/90">CineAI Active</span>
                  </div>
                </div>
                
                {/* Fullscreen Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline Area */}
          <div className="h-52 border-t border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex flex-col">
            {/* Transport Controls */}
            <div className="h-12 border-b border-[hsl(var(--cde-border-subtle))] flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Scissors className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-[hsl(var(--cde-text-secondary))]">00:00:12:15</span>
                <Slider 
                  value={[currentTime]} 
                  onValueChange={(v) => setCurrentTime(v[0])} 
                  max={100} 
                  className="w-64"
                />
                <span className="text-sm font-mono text-[hsl(var(--cde-text-muted))]">00:02:30:00</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">24 FPS</span>
                <div className="h-4 w-px bg-[hsl(var(--cde-border-subtle))]" />
                <span className="text-xs text-[hsl(var(--cde-text-muted))]">16:9</span>
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 flex">
              {/* Track Labels */}
              <div className="w-32 border-r border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-tertiary))]">
                {videoTracks.map((track) => (
                  <div key={track.id} className="h-12 px-2 flex items-center border-b border-[hsl(var(--cde-border-subtle))]">
                    <span className="text-xs font-medium text-[hsl(var(--cde-text-secondary))] truncate">{track.name}</span>
                  </div>
                ))}
                {audioTracks.map((track) => (
                  <div key={track.id} className="h-8 px-2 flex items-center border-b border-[hsl(var(--cde-border-subtle))]">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: track.color }} />
                    <span className="text-[10px] text-[hsl(var(--cde-text-muted))] truncate">{track.name}</span>
                  </div>
                ))}
              </div>

              {/* Timeline Content */}
              <div className="flex-1 overflow-x-auto relative">
                {/* Video Tracks */}
                {videoTracks.map((track) => (
                  <div key={track.id} className="h-12 relative border-b border-[hsl(var(--cde-border-subtle))]">
                    {track.clips.map((clip, i) => (
                      <div
                        key={i}
                        className="absolute top-1 bottom-1 rounded-lg bg-[hsl(187_85%_53%)]/30 border border-[hsl(187_85%_53%)]/50 flex items-center justify-center cursor-pointer hover:bg-[hsl(187_85%_53%)]/40 transition-colors"
                        style={{ left: `${clip.start}%`, width: `${clip.duration}%` }}
                      >
                        <span className="text-lg">{clip.thumbnail}</span>
                      </div>
                    ))}
                  </div>
                ))}
                
                {/* Audio Tracks */}
                {audioTracks.map((track) => (
                  <div key={track.id} className="h-8 relative border-b border-[hsl(var(--cde-border-subtle))]">
                    <div 
                      className="absolute top-1 bottom-1 rounded opacity-50"
                      style={{ left: '5%', width: '70%', backgroundColor: track.color + '40' }}
                    >
                      <div className="absolute inset-0 flex items-center px-1 gap-px">
                        {Array.from({ length: 80 }).map((_, j) => (
                          <div
                            key={j}
                            className="flex-1 rounded-full"
                            style={{
                              backgroundColor: track.color,
                              height: `${15 + Math.random() * 70}%`,
                              opacity: 0.6,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Playhead */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none"
                  style={{ left: `${currentTime}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <VideoRightPanel activeTool={activeTool} />
      </div>
      
      <EditorBottomBar accentColor={accentColor} statusMessage="CineAI Ready" />
    </div>
  );
};

export default VideoEditor;
