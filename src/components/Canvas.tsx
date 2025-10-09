import { useState } from "react";

export const Canvas = () => {
  const [zoom] = useState(125);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoordinates({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  };

  return (
    <main 
      className="flex-1 relative overflow-hidden bg-[hsl(var(--cde-bg-primary))]"
      onMouseMove={handleMouseMove}
    >
      {/* Canvas Grid Background */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--cde-border-subtle) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--cde-border-subtle) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 0'
        }}
      />
      
      {/* Main Canvas Content */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div 
          className="relative bg-[hsl(var(--cde-bg-secondary))] rounded-lg shadow-2xl border-2 border-[hsl(var(--cde-border-emphasis))]"
          style={{
            width: `${zoom}%`,
            aspectRatio: '16/9',
            boxShadow: '0 0 60px hsl(262 83% 58% / 0.2)'
          }}
        >
          {/* Canvas Content Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full cde-gradient-primary opacity-20 blur-3xl" />
              <div className="relative">
                <h2 className="text-3xl font-bold text-[hsl(var(--cde-text-primary))] mb-2">
                  Infinite Canvas
                </h2>
                <p className="text-[hsl(var(--cde-text-secondary))]">
                  Your creative workspace begins here
                </p>
              </div>
            </div>
          </div>
          
          {/* Corner Coordinates Display */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-[hsl(var(--cde-bg-tertiary))]/90 backdrop-blur-sm rounded text-xs font-mono text-[hsl(var(--cde-text-secondary))]">
            {coordinates.x}, {coordinates.y}
          </div>
        </div>
      </div>
      
      {/* Ruler - Top */}
      <div className="absolute top-0 left-16 right-64 h-6 bg-[hsl(var(--cde-bg-secondary))] border-b border-[hsl(var(--cde-border-subtle))] flex items-center overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-20 h-full border-r border-[hsl(var(--cde-border-subtle))] relative">
            <span className="absolute bottom-0 left-1 text-[10px] text-[hsl(var(--cde-text-muted))]">
              {i * 100}
            </span>
          </div>
        ))}
      </div>
      
      {/* Ruler - Left */}
      <div className="absolute left-0 top-14 bottom-10 w-6 bg-[hsl(var(--cde-bg-secondary))] border-r border-[hsl(var(--cde-border-subtle))] flex flex-col overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 h-20 w-full border-b border-[hsl(var(--cde-border-subtle))] relative">
            <span className="absolute top-1 right-1 text-[10px] text-[hsl(var(--cde-text-muted))] [writing-mode:vertical-lr]">
              {i * 100}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
};
