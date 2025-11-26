import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Image,
  Video,
  Music,
  LayoutGrid,
  Users,
  Box,
  Theater,
  ChevronDown,
  Sparkles
} from "lucide-react";

const editorPages = [
  { 
    id: 'image', 
    path: '/', 
    label: 'Image Editor', 
    icon: Image,
    description: 'Visual canvas & AI generation',
    color: 'hsl(var(--cde-accent-purple))'
  },
  { 
    id: 'video', 
    path: '/video', 
    label: 'Video Editor', 
    icon: Video,
    description: 'Cinematic production suite',
    color: 'hsl(var(--cde-accent-cyan))'
  },
  { 
    id: 'audio', 
    path: '/audio', 
    label: 'Audio Editor', 
    icon: Music,
    description: 'AudioForge sound design',
    color: 'hsl(38 92% 50%)'
  },
  { 
    id: 'storyboard', 
    path: '/storyboard', 
    label: 'Storyboard', 
    icon: LayoutGrid,
    description: 'Visual narrative planning',
    color: 'hsl(142 71% 45%)'
  },
  { 
    id: 'character', 
    path: '/character', 
    label: 'Character Editor', 
    icon: Users,
    description: 'Character DNA & casting',
    color: 'hsl(330 80% 60%)'
  },
  { 
    id: 'props', 
    path: '/props', 
    label: 'Props & Scenes', 
    icon: Box,
    description: 'Asset creation & management',
    color: 'hsl(200 80% 50%)'
  },
];

export const LucidNavigationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const currentPage = editorPages.find(page => page.path === location.pathname) || editorPages[0];
  const CurrentIcon = currentPage.icon;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 px-3 py-2 h-auto group hover:bg-[hsl(var(--cde-bg-tertiary))]"
        >
          {/* LUCID Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-[hsl(var(--cde-accent-purple))]" />
              <div className="absolute inset-0 blur-md bg-[hsl(var(--cde-accent-purple))] opacity-40" />
            </div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-[hsl(var(--cde-accent-purple))] via-[hsl(var(--cde-accent-cyan))] to-[hsl(var(--cde-accent-blue))] bg-clip-text text-transparent">
              LUCID
            </span>
          </div>
          
          <div className="h-5 w-px bg-[hsl(var(--cde-border-subtle))]" />
          
          {/* Current Page Indicator */}
          <div className="flex items-center gap-2">
            <CurrentIcon className="w-4 h-4" style={{ color: currentPage.color }} />
            <span className="text-sm font-medium text-[hsl(var(--cde-text-secondary))]">
              {currentPage.label}
            </span>
          </div>
          
          <ChevronDown className={`w-4 h-4 text-[hsl(var(--cde-text-muted))] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-72 bg-[hsl(var(--cde-bg-secondary))] border-[hsl(var(--cde-border-subtle))] backdrop-blur-xl p-2"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-[hsl(var(--cde-text-muted))] font-medium px-2 py-1">
          LUCID Editors
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-[hsl(var(--cde-border-subtle))]" />
        
        {editorPages.map((page) => {
          const Icon = page.icon;
          const isActive = location.pathname === page.path;
          
          return (
            <DropdownMenuItem
              key={page.id}
              onClick={() => {
                navigate(page.path);
                setIsOpen(false);
              }}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer my-1
                transition-all duration-200 group
                ${isActive 
                  ? 'bg-[hsl(var(--cde-accent-purple))]/15 border border-[hsl(var(--cde-accent-purple))]/30' 
                  : 'hover:bg-[hsl(var(--cde-bg-tertiary))] border border-transparent'
                }
              `}
            >
              <div 
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-[hsl(var(--cde-bg-tertiary))]' 
                    : 'bg-[hsl(var(--cde-bg-primary))] group-hover:bg-[hsl(var(--cde-bg-secondary))]'
                  }
                `}
                style={{ 
                  boxShadow: isActive ? `0 0 16px ${page.color}40` : 'none'
                }}
              >
                <Icon className="w-5 h-5" style={{ color: page.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${isActive ? 'text-[hsl(var(--cde-text-primary))]' : 'text-[hsl(var(--cde-text-secondary))]'}`}>
                    {page.label}
                  </span>
                  {isActive && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[hsl(var(--cde-accent-purple))]/20 text-[hsl(var(--cde-accent-purple))]">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-xs text-[hsl(var(--cde-text-muted))] truncate block">
                  {page.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
