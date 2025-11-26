import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  User, 
  FolderOpen, 
  Plus, 
  Ruler, 
  Grid3x3, 
  Magnet,
  Maximize,
  Columns,
  Undo2,
  Redo2,
  Clock,
  Ear,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { LucidNavigationMenu } from "@/components/navigation/LucidNavigationMenu";

interface EditorTopBarProps {
  projectName?: string;
  projectExtension?: string;
  centerControls?: ReactNode;
  rightControls?: ReactNode;
  accentColor?: string;
}

export const EditorTopBar = ({ 
  projectName = "Untitled Project",
  projectExtension = ".lucid",
  centerControls,
  rightControls,
  accentColor = "hsl(var(--cde-accent-purple))"
}: EditorTopBarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header 
      className="border-b border-[hsl(var(--cde-border-subtle))] flex items-center justify-between relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        height: isHovered ? '56px' : '10px',
        paddingLeft: isHovered ? '16px' : '0',
        paddingRight: isHovered ? '16px' : '0',
        background: `
          linear-gradient(to bottom, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            90deg,
            hsl(var(--cde-border-subtle)) 0px,
            hsl(var(--cde-border-subtle)) 1px,
            transparent 1px,
            transparent 20px
          )
        `,
        backgroundPosition: '0 0, 0 100%',
        backgroundSize: '100% 100%, 100px 10px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ruler markings with accent color */}
      <div className="absolute bottom-0 left-0 right-0 h-[10px] flex items-end pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-5 h-full relative"
            style={{ borderRight: `1px solid ${i % 5 === 0 ? accentColor + '40' : 'hsl(var(--cde-border-subtle))'}` }}
          >
            {i % 5 === 0 && (
              <span className="absolute bottom-0 left-0.5 text-[8px] text-[hsl(var(--cde-text-muted))] font-mono">
                {i * 20}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {isHovered && (
        <>
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <LucidNavigationMenu />
            
            <div className="h-6 w-px bg-[hsl(var(--cde-border-subtle))]" />
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
              <FolderOpen className="w-4 h-4 text-[hsl(var(--cde-text-secondary))]" />
              <span className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">
                {projectName}{projectExtension}
              </span>
              <span className="text-xs text-[hsl(var(--cde-text-muted))]">▼</span>
            </div>
            
            <Button size="icon" variant="ghost" className="w-8 h-8">
              <Plus className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2 text-[hsl(var(--cde-text-secondary))] hover:text-[hsl(var(--cde-text-primary))]">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
          
          {/* Center Section */}
          <div className="flex items-center gap-2">
            {centerControls || (
              <>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Ruler">
                  <Ruler className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Guides">
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Snap">
                  <Magnet className="w-4 h-4" />
                </Button>
                
                <div className="h-6 w-px bg-[hsl(var(--cde-border-subtle))] mx-1" />
                
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Fit View">
                  <Maximize className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Split View">
                  <Columns className="w-4 h-4" />
                </Button>
                
                <div className="px-3 py-1 rounded bg-[hsl(var(--cde-bg-tertiary))] text-sm font-mono">
                  100%
                </div>
              </>
            )}
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-2">
            {rightControls || (
              <>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Undo">
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Redo">
                  <Redo2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="History">
                  <Clock className="w-4 h-4" />
                </Button>
                
                <div className="h-6 w-px bg-[hsl(var(--cde-border-subtle))] mx-1" />
                
                <Button variant="ghost" size="icon" className="w-9 h-9" title="Audio Input">
                  <Ear className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9" title="AI Chat">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-[hsl(var(--cde-accent-warning))]" title="Ethics Alert">
                  <AlertCircle className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
};
