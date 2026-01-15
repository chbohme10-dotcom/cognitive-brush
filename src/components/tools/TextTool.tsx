import { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas, IText, Textbox } from "fabric";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface TextToolProps {
  canvas: FabricCanvas | null;
  isActive: boolean;
}

type TextAlignment = 'left' | 'center' | 'right' | 'justify';

export const TextTool = ({ canvas, isActive }: TextToolProps) => {
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<TextAlignment>('left');
  const [lineHeight, setLineHeight] = useState(1.2);
  const [charSpacing, setCharSpacing] = useState(0);
  const [hasBackground, setHasBackground] = useState(false);

  const fontFamilies = [
    'Inter',
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
  ];

  const handleClick = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasElement.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasElement.height / rect.height);

    // Create text object
    const text = new IText('Double-click to edit', {
      left: x,
      top: y,
      fontFamily,
      fontSize,
      fill: textColor,
      backgroundColor: hasBackground ? backgroundColor : undefined,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      underline: isUnderline,
      textAlign,
      lineHeight,
      charSpacing: charSpacing * 10,
      editable: true,
      selectable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    canvas.requestRenderAll();
    
    toast.success('Text added! Double-click to edit.');
  }, [canvas, isActive, fontFamily, fontSize, textColor, backgroundColor, isBold, isItalic, isUnderline, textAlign, lineHeight, charSpacing, hasBackground]);

  // Update selected text when properties change
  const updateSelectedText = useCallback((property: string, value: any) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && (activeObject instanceof IText || activeObject instanceof Textbox)) {
      activeObject.set(property as keyof IText, value);
      canvas.requestRenderAll();
    }
  }, [canvas]);

  useEffect(() => {
    if (!canvas || !isActive) return;

    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('click', handleClick);
    canvasElement.style.cursor = 'text';

    return () => {
      canvasElement.removeEventListener('click', handleClick);
      canvasElement.style.cursor = 'default';
    };
  }, [canvas, isActive, handleClick]);

  const resetToDefaults = () => {
    setFontFamily('Inter');
    setFontSize(32);
    setTextColor('#ffffff');
    setBackgroundColor('transparent');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setTextAlign('left');
    setLineHeight(1.2);
    setCharSpacing(0);
    setHasBackground(false);
  };

  const alignButtons = [
    { value: 'left', icon: AlignLeft },
    { value: 'center', icon: AlignCenter },
    { value: 'right', icon: AlignRight },
    { value: 'justify', icon: AlignJustify },
  ] as const;

  if (!isActive) return null;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-[hsl(var(--cde-accent-purple))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--cde-text-primary))]">
          Text Tool
        </h3>
      </div>

      <div className="space-y-4">
        {/* Font Family */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Font Family</Label>
          <Select value={fontFamily} onValueChange={(v) => {
            setFontFamily(v);
            updateSelectedText('fontFamily', v);
          }}>
            <SelectTrigger className="h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map(font => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Font Size</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{fontSize}px</span>
          </div>
          <Slider
            value={[fontSize]}
            onValueChange={(values) => {
              setFontSize(values[0]);
              updateSelectedText('fontSize', values[0]);
            }}
            min={8}
            max={200}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Text Color */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                updateSelectedText('fill', e.target.value);
              }}
              className="w-12 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
            />
            <Input
              type="text"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                updateSelectedText('fill', e.target.value);
              }}
              className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm font-mono"
            />
          </div>
        </div>

        {/* Text Style Buttons */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Style</Label>
          <div className="flex gap-2">
            <Button
              variant={isBold ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsBold(!isBold);
                updateSelectedText('fontWeight', !isBold ? 'bold' : 'normal');
              }}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={isItalic ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsItalic(!isItalic);
                updateSelectedText('fontStyle', !isItalic ? 'italic' : 'normal');
              }}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={isUnderline ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsUnderline(!isUnderline);
                updateSelectedText('underline', !isUnderline);
              }}
            >
              <Underline className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <Label className="text-xs text-[hsl(var(--cde-text-secondary))] mb-2 block">Alignment</Label>
          <div className="flex gap-2">
            {alignButtons.map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={textAlign === value ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setTextAlign(value);
                  updateSelectedText('textAlign', value);
                }}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Line Height</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{lineHeight.toFixed(1)}</span>
          </div>
          <Slider
            value={[lineHeight * 10]}
            onValueChange={(values) => {
              const val = values[0] / 10;
              setLineHeight(val);
              updateSelectedText('lineHeight', val);
            }}
            min={8}
            max={30}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Character Spacing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Letter Spacing</Label>
            <span className="text-xs text-[hsl(var(--cde-text-muted))]">{charSpacing}</span>
          </div>
          <Slider
            value={[charSpacing]}
            onValueChange={(values) => {
              setCharSpacing(values[0]);
              updateSelectedText('charSpacing', values[0] * 10);
            }}
            min={-50}
            max={200}
            step={1}
            className="[&_[role=slider]]:bg-[hsl(var(--cde-accent-purple))]"
          />
        </div>

        {/* Background */}
        <div className="space-y-3 pt-4 border-t border-[hsl(var(--cde-border-subtle))]">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[hsl(var(--cde-text-secondary))]">Text Background</Label>
            <Switch checked={hasBackground} onCheckedChange={setHasBackground} />
          </div>
          
          {hasBackground && (
            <div className="flex gap-2">
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                  updateSelectedText('backgroundColor', e.target.value);
                }}
                className="w-12 h-8 p-1 cursor-pointer bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))]"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                  updateSelectedText('backgroundColor', e.target.value);
                }}
                className="flex-1 h-8 bg-[hsl(var(--cde-bg-tertiary))] border-[hsl(var(--cde-border-subtle))] text-sm font-mono"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 bg-[hsl(var(--cde-bg-tertiary))] rounded-lg">
          <p className="text-xs text-[hsl(var(--cde-text-muted))]">
            💡 Click on canvas to add text. Double-click text to edit it.
          </p>
        </div>

        {/* Reset Button */}
        <Button onClick={resetToDefaults} variant="outline" className="w-full" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset Settings
        </Button>
      </div>
    </div>
  );
};
