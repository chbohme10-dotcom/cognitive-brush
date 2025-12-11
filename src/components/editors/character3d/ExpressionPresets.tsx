import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Star,
  StarOff,
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";

export interface ExpressionPreset {
  id: string;
  name: string;
  values: Record<string, number>;
  isFavorite: boolean;
  createdAt: number;
}

interface ExpressionPresetsProps {
  currentValues: Record<string, number>;
  onLoadPreset: (values: Record<string, number>) => void;
}

const STORAGE_KEY = 'lucid-vrm-expression-presets';

// Built-in presets
const defaultPresets: ExpressionPreset[] = [
  { id: 'happy', name: 'Happy', values: { happy: 1, blinkLeft: 0, blinkRight: 0 }, isFavorite: true, createdAt: 0 },
  { id: 'sad', name: 'Sad', values: { sad: 1, blinkLeft: 0.2, blinkRight: 0.2 }, isFavorite: true, createdAt: 0 },
  { id: 'angry', name: 'Angry', values: { angry: 1, blinkLeft: 0.1, blinkRight: 0.1 }, isFavorite: false, createdAt: 0 },
  { id: 'surprised', name: 'Surprised', values: { surprised: 1 }, isFavorite: false, createdAt: 0 },
  { id: 'neutral', name: 'Neutral', values: { neutral: 1 }, isFavorite: false, createdAt: 0 },
  { id: 'blink', name: 'Blink', values: { blink: 1 }, isFavorite: false, createdAt: 0 },
  { id: 'wink-left', name: 'Wink Left', values: { blinkLeft: 1, blinkRight: 0 }, isFavorite: false, createdAt: 0 },
  { id: 'wink-right', name: 'Wink Right', values: { blinkLeft: 0, blinkRight: 1 }, isFavorite: false, createdAt: 0 },
];

export const ExpressionPresets = ({ currentValues, onLoadPreset }: ExpressionPresetsProps) => {
  const [presets, setPresets] = useState<ExpressionPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Load presets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPresets([...defaultPresets, ...parsed]);
      } catch {
        setPresets(defaultPresets);
      }
    } else {
      setPresets(defaultPresets);
    }
  }, []);

  // Save custom presets to localStorage
  const saveToStorage = (customPresets: ExpressionPreset[]) => {
    const toSave = customPresets.filter(p => !defaultPresets.some(d => d.id === p.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }

    const hasValues = Object.values(currentValues).some(v => v > 0);
    if (!hasValues) {
      toast.error('Adjust some expressions first');
      return;
    }

    const newPreset: ExpressionPreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      values: { ...currentValues },
      isFavorite: false,
      createdAt: Date.now(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    saveToStorage(updated);
    setNewPresetName('');
    setShowSaveInput(false);
    toast.success(`Saved preset: ${newPreset.name}`);
  };

  const handleDeletePreset = (id: string) => {
    if (defaultPresets.some(p => p.id === id)) {
      toast.error('Cannot delete built-in presets');
      return;
    }
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    saveToStorage(updated);
    toast.success('Preset deleted');
  };

  const handleToggleFavorite = (id: string) => {
    const updated = presets.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    setPresets(updated);
    saveToStorage(updated);
  };

  const handleExportPresets = () => {
    const customPresets = presets.filter(p => !defaultPresets.some(d => d.id === p.id));
    const blob = new Blob([JSON.stringify(customPresets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vrm-expression-presets.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Presets exported');
  };

  const handleImportPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as ExpressionPreset[];
        const newPresets = imported.map(p => ({
          ...p,
          id: `imported-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          createdAt: Date.now(),
        }));
        const updated = [...presets, ...newPresets];
        setPresets(updated);
        saveToStorage(updated);
        toast.success(`Imported ${newPresets.length} presets`);
      } catch {
        toast.error('Invalid preset file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const favorites = presets.filter(p => p.isFavorite);
  const builtIn = presets.filter(p => defaultPresets.some(d => d.id === p.id) && !p.isFavorite);
  const custom = presets.filter(p => !defaultPresets.some(d => d.id === p.id) && !p.isFavorite);

  const renderPreset = (preset: ExpressionPreset) => (
    <div
      key={preset.id}
      className="flex items-center gap-2 p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] hover:bg-[hsl(280_70%_50%)]/10 transition-colors group"
    >
      <button
        onClick={() => handleToggleFavorite(preset.id)}
        className="text-[hsl(var(--cde-text-muted))] hover:text-yellow-400"
      >
        {preset.isFavorite ? (
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ) : (
          <StarOff className="w-3 h-3" />
        )}
      </button>
      
      <button
        onClick={() => onLoadPreset(preset.values)}
        className="flex-1 text-left"
      >
        <span className="text-xs text-[hsl(var(--cde-text-primary))]">{preset.name}</span>
        <p className="text-[10px] text-[hsl(var(--cde-text-muted))]">
          {Object.keys(preset.values).length} expressions
        </p>
      </button>
      
      {!defaultPresets.some(d => d.id === preset.id) && (
        <button
          onClick={() => handleDeletePreset(preset.id)}
          className="opacity-0 group-hover:opacity-100 text-[hsl(var(--cde-text-muted))] hover:text-red-400 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Save Current */}
      <div className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
        {showSaveInput ? (
          <div className="space-y-2">
            <Input
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Preset name..."
              className="h-7 text-xs"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
            />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleSavePreset}>
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowSaveInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            size="sm" 
            className="w-full h-7 text-xs bg-[hsl(280_70%_50%)] hover:bg-[hsl(280_70%_40%)]"
            onClick={() => setShowSaveInput(true)}
          >
            <Save className="w-3 h-3 mr-1" /> Save Current Expression
          </Button>
        )}
      </div>

      {/* Import/Export */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={handleExportPresets}>
          <Download className="w-3 h-3 mr-1" /> Export
        </Button>
        <label>
          <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
            <span>
              <Upload className="w-3 h-3 mr-1" /> Import
            </span>
          </Button>
          <input type="file" accept=".json" className="hidden" onChange={handleImportPresets} />
        </label>
      </div>

      <ScrollArea className="h-[250px]">
        <div className="space-y-3 pr-2">
          {/* Favorites */}
          {favorites.length > 0 && (
            <div>
              <h5 className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Star className="w-3 h-3" /> Favorites
              </h5>
              <div className="space-y-1">
                {favorites.map(renderPreset)}
              </div>
            </div>
          )}

          {/* Built-in */}
          {builtIn.length > 0 && (
            <div>
              <h5 className="text-[10px] font-semibold text-[hsl(var(--cde-text-muted))] uppercase tracking-wider mb-2 flex items-center gap-1">
                <FolderOpen className="w-3 h-3" /> Built-in
              </h5>
              <div className="space-y-1">
                {builtIn.map(renderPreset)}
              </div>
            </div>
          )}

          {/* Custom */}
          {custom.length > 0 && (
            <div>
              <h5 className="text-[10px] font-semibold text-[hsl(280_70%_60%)] uppercase tracking-wider mb-2">
                Custom Presets
              </h5>
              <div className="space-y-1">
                {custom.map(renderPreset)}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
