import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Layers,
  Wand2,
  FolderOpen,
  Box,
  Mountain,
  Tag,
  Warehouse,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search
} from "lucide-react";

interface PropsRightPanelProps {
  activeTool: string;
}

const panels = [
  { id: 'props', icon: Box, label: 'Props Library' },
  { id: 'scenes', icon: Mountain, label: 'Scene Builder' },
  { id: 'categories', icon: Tag, label: 'Categories' },
  { id: 'warehouse', icon: Warehouse, label: 'Asset Warehouse' },
  { id: 'ai', icon: Wand2, label: 'AI Generator' },
  { id: 'assets', icon: FolderOpen, label: 'Assets' },
  { id: 'chat', icon: MessageSquare, label: 'AI Chat' },
];

const categories = [
  { id: 'furniture', label: 'Furniture', count: 234, icon: '🪑' },
  { id: 'vehicles', label: 'Vehicles', count: 89, icon: '🚗' },
  { id: 'nature', label: 'Nature', count: 156, icon: '🌳' },
  { id: 'buildings', label: 'Buildings', count: 67, icon: '🏠' },
  { id: 'electronics', label: 'Electronics', count: 123, icon: '💻' },
  { id: 'food', label: 'Food & Drink', count: 98, icon: '🍕' },
];

const mockProps = [
  { id: 1, name: 'Modern Chair', category: 'Furniture', thumbnail: '🪑' },
  { id: 2, name: 'Sports Car', category: 'Vehicles', thumbnail: '🏎️' },
  { id: 3, name: 'Oak Tree', category: 'Nature', thumbnail: '🌳' },
  { id: 4, name: 'Laptop', category: 'Electronics', thumbnail: '💻' },
];

export const PropsRightPanel = ({ activeTool }: PropsRightPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePanel, setActivePanel] = useState('props');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside 
      className="border-l border-[hsl(var(--cde-border-subtle))] flex relative overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        width: isExpanded ? '320px' : isHovered ? '48px' : '10px',
        background: `
          linear-gradient(to left, hsl(var(--cde-bg-secondary)) 0%, hsl(var(--cde-bg-secondary)) calc(100% - 10px), hsl(var(--cde-bg-tertiary)) calc(100% - 10px)),
          repeating-linear-gradient(
            0deg,
            hsl(200 80% 50% / 0.2) 0px,
            hsl(200 80% 50% / 0.2) 1px,
            transparent 1px,
            transparent 20px
          )
        `,
        backgroundPosition: '0 0, 0 0',
        backgroundSize: '100% 100%, 10px 100px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ruler on left edge */}
      <div className="absolute top-0 bottom-0 left-0 w-[10px] flex flex-col items-start pointer-events-none z-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 h-5 w-full relative"
            style={{ borderBottom: `1px solid ${i % 5 === 0 ? 'hsl(200 80% 50% / 0.4)' : 'hsl(var(--cde-border-subtle))'}` }}
          />
        ))}
      </div>

      {/* Activator Bar */}
      {(isHovered || isExpanded) && (
        <div className="w-10 flex flex-col items-center gap-1 py-2 ml-2 border-r border-[hsl(var(--cde-border-subtle))]">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 mb-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <Button
                key={panel.id}
                variant="ghost"
                size="icon"
                className={`w-8 h-8 ${activePanel === panel.id ? 'bg-[hsl(200_80%_50%)]/20 text-[hsl(200_80%_50%)]' : ''}`}
                onClick={() => {
                  setActivePanel(panel.id);
                  setIsExpanded(true);
                }}
                title={panel.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
      )}

      {/* Main Panel Content */}
      {isExpanded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[hsl(var(--cde-border-subtle))]">
            <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
              {panels.find(p => p.id === activePanel)?.label}
            </h3>
          </div>
          
          <ScrollArea className="flex-1">
            {activePanel === 'props' && (
              <div className="p-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--cde-text-muted))]" />
                  <input 
                    type="text"
                    placeholder="Search props..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] text-sm"
                  />
                </div>
                
                <Button variant="outline" size="sm" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" />
                  Create New Prop
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  {mockProps.map((prop) => (
                    <div 
                      key={prop.id}
                      className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] cursor-pointer hover:border-[hsl(200_80%_50%/0.5)] text-center"
                    >
                      <div className="w-full h-16 rounded bg-[hsl(var(--cde-bg-primary))] flex items-center justify-center text-3xl mb-2">
                        {prop.thumbnail}
                      </div>
                      <p className="text-xs font-medium truncate">{prop.name}</p>
                      <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">{prop.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activePanel === 'categories' && (
              <div className="p-3 space-y-2">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    className="p-3 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] cursor-pointer hover:border-[hsl(200_80%_50%/0.5)] flex items-center gap-3"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cat.label}</p>
                      <p className="text-xs text-[hsl(var(--cde-text-muted))]">{cat.count} items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activePanel === 'ai' && (
              <div className="p-3 space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(200_80%_50%/0.1)] to-transparent border border-[hsl(200_80%_50%/0.3)]">
                  <Wand2 className="w-8 h-8 text-[hsl(200_80%_50%)] mb-2" />
                  <h4 className="font-semibold mb-1">PropForge AI</h4>
                  <p className="text-xs text-[hsl(var(--cde-text-muted))]">
                    Generate props and scenes with AI
                  </p>
                </div>
                
                <Button className="w-full bg-[hsl(200_80%_50%)] hover:bg-[hsl(200_80%_40%)]">
                  <Box className="w-4 h-4 mr-2" />
                  Generate Prop
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Mountain className="w-4 h-4 mr-2" />
                  Generate Scene
                </Button>
              </div>
            )}
            
            {activePanel === 'chat' && (
              <div className="p-3 h-full flex flex-col">
                <div className="flex-1 bg-[hsl(var(--cde-bg-primary))] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[hsl(var(--cde-text-muted))] text-center">
                    AI Assistant ready to help with props & scenes
                  </p>
                </div>
                <input 
                  type="text"
                  placeholder="Ask about props or scenes..."
                  className="w-full px-3 py-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))] text-sm"
                />
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </aside>
  );
};
