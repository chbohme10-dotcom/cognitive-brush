import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const editorPages = [
  {
    path: "/",
    label: "Image Editor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="8" cy="10" r="1.5" fill="currentColor"/>
        <path d="M15 13L11 17H19L15 13Z" fill="currentColor"/>
        <path d="M9 16L7 14L3 18V17C3 18.1046 3.89543 19 5 19H19L13 13L9 16Z" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    color: "hsl(var(--cde-accent-primary))"
  },
  {
    path: "/audio",
    label: "Audio Editor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M12 3V21M8 6V18M16 6V18M4 9V15M20 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "hsl(220, 70%, 60%)"
  },
  {
    path: "/video",
    label: "Video Editor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect x="2" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 9L22 6V18L16 15V9Z" fill="currentColor"/>
      </svg>
    ),
    color: "hsl(340, 75%, 60%)"
  },
  {
    path: "/storyboard",
    label: "Storyboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    color: "hsl(280, 65%, 60%)"
  },
  {
    path: "/character",
    label: "Character",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "hsl(160, 60%, 50%)"
  },
  {
    path: "/props",
    label: "Props",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M12 3L4 7L12 11L20 7L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 17L12 21L20 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "hsl(40, 75%, 55%)"
  },
  {
    path: "/scene",
    label: "Scene",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M3 12L5 10L9 14L15 8L19 12L21 10V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M3 12V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: "hsl(180, 60%, 50%)"
  }
];

export const EditorIconNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center gap-1">
      {editorPages.map((page) => {
        const isActive = location.pathname === page.path;
        
        return (
          <Tooltip key={page.path}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(page.path)}
                className={`w-9 h-9 relative transition-all ${
                  isActive 
                    ? 'bg-[hsl(var(--cde-bg-tertiary))] text-[hsl(var(--cde-text-primary))]' 
                    : 'text-[hsl(var(--cde-text-secondary))] hover:text-[hsl(var(--cde-text-primary))] hover:bg-[hsl(var(--cde-bg-tertiary))]/50'
                }`}
                style={isActive ? { color: page.color } : undefined}
              >
                {page.icon}
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ backgroundColor: page.color }}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{page.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
