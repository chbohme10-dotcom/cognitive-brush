import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  Upload, 
  Plus, 
  Minus, 
  Layers,
  Copy,
  Edit3,
  RotateCcw,
  Maximize2,
  Minimize2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  SelectionHistory, 
  SavedSelection, 
  CombineMode,
  getSelectionHistory 
} from '@/lib/segmentation/SelectionHistory';

interface SelectionHistoryPanelProps {
  onSelectionLoad?: (selection: SavedSelection) => void;
  onSelectionCombine?: (result: SavedSelection) => void;
  className?: string;
}

export const SelectionHistoryPanel: React.FC<SelectionHistoryPanelProps> = ({
  onSelectionLoad,
  onSelectionCombine,
  className = ''
}) => {
  const [selections, setSelections] = useState<SavedSelection[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [expandAmount, setExpandAmount] = useState(2);

  const history = getSelectionHistory();

  useEffect(() => {
    refreshSelections();
  }, []);

  const refreshSelections = () => {
    setSelections(history.getAll());
  };

  const handleSelect = (id: string, multi: boolean) => {
    const newSelected = new Set(selectedIds);
    if (multi) {
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
    } else {
      newSelected.clear();
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleLoad = (selection: SavedSelection) => {
    history.setActive(selection.id);
    onSelectionLoad?.(selection);
  };

  const handleDelete = (id: string) => {
    history.delete(id);
    selectedIds.delete(id);
    setSelectedIds(new Set(selectedIds));
    refreshSelections();
  };

  const handleRename = (id: string) => {
    const selection = history.get(id);
    if (selection) {
      setEditingId(id);
      setEditName(selection.name);
    }
  };

  const handleSaveRename = () => {
    if (editingId && editName.trim()) {
      history.rename(editingId, editName.trim());
      setEditingId(null);
      refreshSelections();
    }
  };

  const handleCombine = (mode: CombineMode) => {
    const selected = Array.from(selectedIds);
    if (selected.length !== 2) return;

    const sel1 = history.get(selected[0]);
    const sel2 = history.get(selected[1]);
    
    if (sel1 && sel2) {
      try {
        const result = history.combine(sel1, sel2, mode);
        refreshSelections();
        onSelectionCombine?.(result);
      } catch (error) {
        console.error('Combine failed:', error);
      }
    }
  };

  const handleInvert = (id: string) => {
    const selection = history.get(id);
    if (selection) {
      history.invert(selection);
      refreshSelections();
    }
  };

  const handleExpand = (id: string) => {
    const selection = history.get(id);
    if (selection) {
      history.expand(selection, expandAmount);
      refreshSelections();
    }
  };

  const handleContract = (id: string) => {
    const selection = history.get(id);
    if (selection) {
      history.contract(selection, expandAmount);
      refreshSelections();
    }
  };

  const handleExport = () => {
    const json = history.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selections.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          history.importAll(e.target?.result as string);
          refreshSelections();
        } catch (error) {
          console.error('Import failed:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAll = () => {
    history.clear();
    setSelectedIds(new Set());
    refreshSelections();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatPixels = (count: number) => {
    if (count > 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count > 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className={`flex flex-col bg-background border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Selection History</span>
          <Badge variant="secondary" className="text-xs">
            {selections.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleExport}
            title="Export all"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          
          <label>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              title="Import"
              asChild
            >
              <span>
                <Upload className="h-3.5 w-3.5" />
              </span>
            </Button>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImport}
            />
          </label>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-destructive"
            onClick={handleClearAll}
            title="Clear all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Combine Tools */}
      {selectedIds.size === 2 && (
        <div className="flex items-center gap-1 p-2 bg-muted/50 border-b">
          <span className="text-xs text-muted-foreground mr-2">Combine:</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs"
            onClick={() => handleCombine('add')}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs"
            onClick={() => handleCombine('subtract')}
          >
            <Minus className="h-3 w-3 mr-1" /> Subtract
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs"
            onClick={() => handleCombine('intersect')}
          >
            <Layers className="h-3 w-3 mr-1" /> Intersect
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 text-xs"
            onClick={() => handleCombine('xor')}
          >
            <XCircle className="h-3 w-3 mr-1" /> XOR
          </Button>
        </div>
      )}

      {/* Selection List */}
      <ScrollArea className="flex-1 max-h-[400px]">
        {selections.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No saved selections</p>
            <p className="text-xs mt-1">Use the magic wand tool to create selections</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {selections.map((selection) => (
              <div
                key={selection.id}
                className={`
                  group flex items-center gap-2 p-2 rounded-md cursor-pointer
                  transition-colors hover:bg-muted/50
                  ${selectedIds.has(selection.id) ? 'bg-primary/10 border border-primary/30' : ''}
                  ${history.getActive()?.id === selection.id ? 'ring-1 ring-primary' : ''}
                `}
                onClick={(e) => handleSelect(selection.id, e.shiftKey || e.ctrlKey || e.metaKey)}
                onDoubleClick={() => handleLoad(selection)}
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                  {selection.thumbnail ? (
                    <img 
                      src={selection.thumbnail} 
                      alt={selection.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {editingId === selection.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleSaveRename}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                      className="h-6 text-xs"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-medium truncate">{selection.name}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatPixels(selection.pixelCount)} px</span>
                    <span>•</span>
                    <span>{formatTime(selection.timestamp)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleLoad(selection)}>
                        <Copy className="h-3.5 w-3.5 mr-2" /> Load
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRename(selection.id)}>
                        <Edit3 className="h-3.5 w-3.5 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleInvert(selection.id)}>
                        <RotateCcw className="h-3.5 w-3.5 mr-2" /> Invert
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExpand(selection.id)}>
                        <Maximize2 className="h-3.5 w-3.5 mr-2" /> Expand {expandAmount}px
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleContract(selection.id)}>
                        <Minimize2 className="h-3.5 w-3.5 mr-2" /> Contract {expandAmount}px
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(selection.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer with expand/contract settings */}
      <div className="p-2 border-t bg-muted/30">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Expand/Contract:</Label>
          <Input
            type="number"
            value={expandAmount}
            onChange={(e) => setExpandAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-6 text-xs"
            min={1}
            max={50}
          />
          <span className="text-xs text-muted-foreground">px</span>
        </div>
      </div>
    </div>
  );
};

export default SelectionHistoryPanel;
