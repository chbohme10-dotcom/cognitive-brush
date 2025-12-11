import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Hand, 
  RotateCcw, 
  Copy, 
  Grip,
  Save
} from "lucide-react";
import { toast } from "sonner";

interface FingerPose {
  curl: number;      // 0-100 (finger curl/bend)
  spread: number;    // -50 to 50 (finger spread)
  twist: number;     // -50 to 50 (finger rotation)
}

interface HandPose {
  thumb: FingerPose;
  index: FingerPose;
  middle: FingerPose;
  ring: FingerPose;
  pinky: FingerPose;
  wristBend: number;   // -50 to 50
  wristTwist: number;  // -50 to 50
}

interface FingerPosePanelProps {
  onPoseChange?: (hand: 'left' | 'right', pose: HandPose) => void;
}

const defaultFingerPose: FingerPose = { curl: 0, spread: 0, twist: 0 };
const defaultHandPose: HandPose = {
  thumb: { ...defaultFingerPose },
  index: { ...defaultFingerPose },
  middle: { ...defaultFingerPose },
  ring: { ...defaultFingerPose },
  pinky: { ...defaultFingerPose },
  wristBend: 0,
  wristTwist: 0,
};

// Preset hand poses
const handPresets: { name: string; pose: HandPose }[] = [
  { 
    name: 'Fist', 
    pose: {
      thumb: { curl: 80, spread: -20, twist: 0 },
      index: { curl: 100, spread: 0, twist: 0 },
      middle: { curl: 100, spread: 0, twist: 0 },
      ring: { curl: 100, spread: 0, twist: 0 },
      pinky: { curl: 100, spread: 0, twist: 0 },
      wristBend: 0,
      wristTwist: 0,
    }
  },
  { 
    name: 'Point', 
    pose: {
      thumb: { curl: 60, spread: -30, twist: 0 },
      index: { curl: 0, spread: 0, twist: 0 },
      middle: { curl: 100, spread: 0, twist: 0 },
      ring: { curl: 100, spread: 0, twist: 0 },
      pinky: { curl: 100, spread: 0, twist: 0 },
      wristBend: 0,
      wristTwist: 0,
    }
  },
  { 
    name: 'Peace', 
    pose: {
      thumb: { curl: 70, spread: -30, twist: 0 },
      index: { curl: 0, spread: -15, twist: 0 },
      middle: { curl: 0, spread: 15, twist: 0 },
      ring: { curl: 100, spread: 0, twist: 0 },
      pinky: { curl: 100, spread: 0, twist: 0 },
      wristBend: 0,
      wristTwist: 0,
    }
  },
  { 
    name: 'Thumbs Up', 
    pose: {
      thumb: { curl: 0, spread: 40, twist: 0 },
      index: { curl: 100, spread: 0, twist: 0 },
      middle: { curl: 100, spread: 0, twist: 0 },
      ring: { curl: 100, spread: 0, twist: 0 },
      pinky: { curl: 100, spread: 0, twist: 0 },
      wristBend: 0,
      wristTwist: 0,
    }
  },
  { 
    name: 'OK Sign', 
    pose: {
      thumb: { curl: 50, spread: 20, twist: 10 },
      index: { curl: 60, spread: -10, twist: 0 },
      middle: { curl: 0, spread: 0, twist: 0 },
      ring: { curl: 0, spread: 10, twist: 0 },
      pinky: { curl: 0, spread: 20, twist: 0 },
      wristBend: 0,
      wristTwist: 0,
    }
  },
  { 
    name: 'Spread', 
    pose: {
      thumb: { curl: 0, spread: 50, twist: 0 },
      index: { curl: 0, spread: -30, twist: 0 },
      middle: { curl: 0, spread: -10, twist: 0 },
      ring: { curl: 0, spread: 10, twist: 0 },
      pinky: { curl: 0, spread: 30, twist: 0 },
      wristBend: 0,
      wristTwist: 0,
    }
  },
  { 
    name: 'Relaxed', 
    pose: {
      thumb: { curl: 20, spread: 10, twist: 0 },
      index: { curl: 30, spread: -5, twist: 0 },
      middle: { curl: 35, spread: 0, twist: 0 },
      ring: { curl: 40, spread: 5, twist: 0 },
      pinky: { curl: 45, spread: 10, twist: 0 },
      wristBend: -5,
      wristTwist: 0,
    }
  },
  { 
    name: 'Grip', 
    pose: {
      thumb: { curl: 40, spread: -10, twist: 0 },
      index: { curl: 70, spread: 0, twist: 0 },
      middle: { curl: 75, spread: 0, twist: 0 },
      ring: { curl: 80, spread: 0, twist: 0 },
      pinky: { curl: 85, spread: 0, twist: 0 },
      wristBend: 10,
      wristTwist: 0,
    }
  },
];

const fingerNames = ['thumb', 'index', 'middle', 'ring', 'pinky'] as const;
const fingerLabels = { thumb: 'Thumb', index: 'Index', middle: 'Middle', ring: 'Ring', pinky: 'Pinky' };
const fingerColors = {
  thumb: 'hsl(30 80% 55%)',
  index: 'hsl(200 80% 55%)',
  middle: 'hsl(280 80% 55%)',
  ring: 'hsl(340 80% 55%)',
  pinky: 'hsl(160 80% 55%)',
};

export const FingerPosePanel = ({ onPoseChange }: FingerPosePanelProps) => {
  const [activeHand, setActiveHand] = useState<'left' | 'right'>('right');
  const [leftPose, setLeftPose] = useState<HandPose>({ ...defaultHandPose });
  const [rightPose, setRightPose] = useState<HandPose>({ ...defaultHandPose });
  const [selectedFinger, setSelectedFinger] = useState<typeof fingerNames[number] | null>(null);

  const currentPose = activeHand === 'left' ? leftPose : rightPose;
  const setCurrentPose = activeHand === 'left' ? setLeftPose : setRightPose;

  const updateFingerPose = (finger: typeof fingerNames[number], property: keyof FingerPose, value: number) => {
    const newPose = {
      ...currentPose,
      [finger]: { ...currentPose[finger], [property]: value }
    };
    setCurrentPose(newPose);
    onPoseChange?.(activeHand, newPose);
  };

  const updateWrist = (property: 'wristBend' | 'wristTwist', value: number) => {
    const newPose = { ...currentPose, [property]: value };
    setCurrentPose(newPose);
    onPoseChange?.(activeHand, newPose);
  };

  const applyPreset = (preset: HandPose) => {
    setCurrentPose({ ...preset });
    onPoseChange?.(activeHand, preset);
    toast.success('Pose applied');
  };

  const resetPose = () => {
    setCurrentPose({ ...defaultHandPose });
    onPoseChange?.(activeHand, defaultHandPose);
    toast.success('Pose reset');
  };

  const mirrorPose = () => {
    if (activeHand === 'left') {
      setRightPose({ ...leftPose });
      onPoseChange?.('right', leftPose);
    } else {
      setLeftPose({ ...rightPose });
      onPoseChange?.('left', rightPose);
    }
    toast.success(`Mirrored to ${activeHand === 'left' ? 'right' : 'left'} hand`);
  };

  const setCurlAll = (value: number) => {
    const newPose = {
      ...currentPose,
      thumb: { ...currentPose.thumb, curl: value },
      index: { ...currentPose.index, curl: value },
      middle: { ...currentPose.middle, curl: value },
      ring: { ...currentPose.ring, curl: value },
      pinky: { ...currentPose.pinky, curl: value },
    };
    setCurrentPose(newPose);
    onPoseChange?.(activeHand, newPose);
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-1">
        {/* Hand Selector */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeHand === 'left' ? 'default' : 'outline'}
            className={`flex-1 h-8 ${activeHand === 'left' ? 'bg-[hsl(280_70%_50%)]' : ''}`}
            onClick={() => setActiveHand('left')}
          >
            <Hand className="w-4 h-4 mr-1 scale-x-[-1]" /> Left
          </Button>
          <Button
            size="sm"
            variant={activeHand === 'right' ? 'default' : 'outline'}
            className={`flex-1 h-8 ${activeHand === 'right' ? 'bg-[hsl(280_70%_50%)]' : ''}`}
            onClick={() => setActiveHand('right')}
          >
            <Hand className="w-4 h-4 mr-1" /> Right
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={resetPose}>
            <RotateCcw className="w-3 h-3 mr-1" /> Reset
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={mirrorPose}>
            <Copy className="w-3 h-3 mr-1" /> Mirror
          </Button>
        </div>

        {/* Presets */}
        <div className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
          <h4 className="text-[10px] font-semibold text-[hsl(var(--cde-text-muted))] uppercase tracking-wider mb-2">
            Hand Presets
          </h4>
          <div className="grid grid-cols-4 gap-1">
            {handPresets.map((preset) => (
              <Button
                key={preset.name}
                size="sm"
                variant="ghost"
                className="h-8 text-[10px] px-1"
                onClick={() => applyPreset(preset.pose)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Global Curl Control */}
        <div className="p-2 rounded-lg bg-[hsl(var(--cde-bg-primary))] border border-[hsl(var(--cde-border-subtle))]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[hsl(var(--cde-text-secondary))]">All Fingers Curl</span>
            <Grip className="w-3 h-3 text-[hsl(var(--cde-text-muted))]" />
          </div>
          <Slider
            value={[currentPose.index.curl]}
            onValueChange={([v]) => setCurlAll(v)}
            max={100}
            step={1}
          />
        </div>

        {/* Wrist Controls */}
        <div className="p-2 rounded-lg bg-[hsl(var(--cde-bg-tertiary))] border border-[hsl(var(--cde-border-subtle))]">
          <h4 className="text-[10px] font-semibold text-[hsl(var(--cde-text-muted))] uppercase tracking-wider mb-2">
            Wrist
          </h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">Bend</span>
                <span className="text-[10px] text-[hsl(var(--cde-text-secondary))] tabular-nums">{currentPose.wristBend}</span>
              </div>
              <Slider
                value={[currentPose.wristBend + 50]}
                onValueChange={([v]) => updateWrist('wristBend', v - 50)}
                max={100}
                step={1}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">Twist</span>
                <span className="text-[10px] text-[hsl(var(--cde-text-secondary))] tabular-nums">{currentPose.wristTwist}</span>
              </div>
              <Slider
                value={[currentPose.wristTwist + 50]}
                onValueChange={([v]) => updateWrist('wristTwist', v - 50)}
                max={100}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Individual Finger Controls */}
        <div className="space-y-2">
          {fingerNames.map((finger) => (
            <div
              key={finger}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                selectedFinger === finger
                  ? 'bg-[hsl(280_70%_50%)]/10 border-[hsl(280_70%_50%)]/50'
                  : 'bg-[hsl(var(--cde-bg-primary))] border-[hsl(var(--cde-border-subtle))] hover:border-[hsl(280_70%_50%)]/30'
              }`}
              onClick={() => setSelectedFinger(selectedFinger === finger ? null : finger)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: fingerColors[finger] }}
                />
                <span className="text-xs font-medium text-[hsl(var(--cde-text-primary))]">
                  {fingerLabels[finger]}
                </span>
                <span className="text-[10px] text-[hsl(var(--cde-text-muted))] ml-auto">
                  {Math.round(currentPose[finger].curl)}%
                </span>
              </div>

              {/* Always show curl, expanded shows spread/twist */}
              <div className="space-y-1.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">Curl</span>
                  </div>
                  <Slider
                    value={[currentPose[finger].curl]}
                    onValueChange={([v]) => updateFingerPose(finger, 'curl', v)}
                    max={100}
                    step={1}
                  />
                </div>

                {selectedFinger === finger && (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">Spread</span>
                        <span className="text-[10px] text-[hsl(var(--cde-text-secondary))] tabular-nums">
                          {currentPose[finger].spread}
                        </span>
                      </div>
                      <Slider
                        value={[currentPose[finger].spread + 50]}
                        onValueChange={([v]) => updateFingerPose(finger, 'spread', v - 50)}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[hsl(var(--cde-text-muted))]">Twist</span>
                        <span className="text-[10px] text-[hsl(var(--cde-text-secondary))] tabular-nums">
                          {currentPose[finger].twist}
                        </span>
                      </div>
                      <Slider
                        value={[currentPose[finger].twist + 50]}
                        onValueChange={([v]) => updateFingerPose(finger, 'twist', v - 50)}
                        max={100}
                        step={1}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
