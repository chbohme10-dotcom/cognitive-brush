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

export const TopBar = () => {
  return (
    <header className="h-14 border-b border-[hsl(var(--cde-border-subtle))] bg-[hsl(var(--cde-bg-secondary))] flex items-center justify-between px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="font-bold text-lg bg-clip-text text-transparent cde-gradient-primary">
          CDE
        </div>
        
        <div className="h-6 w-px bg-[hsl(var(--cde-border-subtle))]" />
        
        <Button variant="ghost" size="sm" className="gap-2 text-[hsl(var(--cde-text-secondary))] hover:text-[hsl(var(--cde-text-primary))]">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        
        <Button variant="ghost" size="sm" className="gap-2 text-[hsl(var(--cde-text-secondary))] hover:text-[hsl(var(--cde-text-primary))]">
          <User className="w-4 h-4" />
          Account
        </Button>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
          <FolderOpen className="w-4 h-4 text-[hsl(var(--cde-text-secondary))]" />
          <span className="text-sm font-medium text-[hsl(var(--cde-text-primary))]">Project 1.cde</span>
          <span className="text-xs text-[hsl(var(--cde-text-muted))]">▼</span>
        </div>
        
        <Button size="icon" variant="ghost" className="w-8 h-8">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Center Section */}
      <div className="flex items-center gap-2">
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
          125%
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
};
