// Tunnel Infiltration Scene - Detailed Storyboard Sequence
// Shot-by-shot breakdown with camera angles, timing, and AI generation prompts

export interface StoryboardFrame {
  id: number;
  shotType: string;
  duration: string;
  description: string;
  cameraAngle: string;
  movement: string;
  lighting: string;
  aiPrompt: string;
  notes: string;
}

export const tunnelInfiltrationStoryboard: StoryboardFrame[] = [
  {
    id: 1,
    shotType: "WIDE",
    duration: "4s",
    description: "Establishing shot - Underground tunnel interior, military submarine aesthetic with industrial pipes and red alert lights",
    cameraAngle: "Wide angle from tunnel end, symmetrical composition",
    movement: "Slow dolly forward",
    lighting: "Red alert lights, minimal ambient, high contrast shadows",
    aiPrompt: "Wide establishing shot of underground military tunnel interior, submarine aesthetic, industrial pipes and conduits, red alert lights creating dramatic shadows, metallic surfaces, high contrast lighting, symmetrical composition, cinematic, photorealistic, Ghost in the Shell style",
    notes: "Sets the atmosphere - industrial, militaristic, tense"
  },
  {
    id: 2,
    shotType: "MED",
    duration: "2s",
    description: "Overhead hatch from below - circular entrance with dramatic rim lighting",
    cameraAngle: "Looking up at hatch, low angle",
    movement: "Static",
    lighting: "Rim light from above creating circle of light, surrounding darkness",
    aiPrompt: "Looking up at circular overhead hatch from below in dark tunnel, dramatic rim lighting creating halo effect, industrial metal texture, shadows around edges, high contrast, cinematic composition, photorealistic",
    notes: "Anticipation moment - something is about to happen"
  },
  {
    id: 3,
    shotType: "CU",
    duration: "1.5s",
    description: "Hatch mechanism unlocking - Close detail of locks releasing",
    cameraAngle: "Extreme close-up on hatch locks",
    movement: "Static with focus on mechanical movement",
    lighting: "Sharp edge lighting on metal",
    aiPrompt: "Extreme close-up of industrial hatch lock mechanism releasing, metallic details, mechanical precision, sharp lighting on metal edges, high detail, photorealistic, cinematic macro shot",
    notes: "Builds tension through mechanical detail"
  },
  {
    id: 4,
    shotType: "WIDE",
    duration: "3s",
    description: "Hatch opens - silhouette of Motoko above, smoke grenade drops through opening",
    cameraAngle: "Wide from below, centered on hatch",
    movement: "Static as grenade falls toward camera",
    lighting: "Backlit silhouette from above, grenade visible against light",
    aiPrompt: "Overhead hatch opening from below perspective, silhouette of female figure above backlit by bright light, cylindrical smoke grenade falling through opening toward camera, dramatic contrast, cinematic wide shot, photorealistic, Ghost in the Shell style",
    notes: "Iconic visual - Motoko revealed in silhouette"
  },
  {
    id: 5,
    shotType: "INSERT",
    duration: "1s",
    description: "Smoke grenade hits tunnel floor - impact and initial smoke release",
    cameraAngle: "Ground level, tight on grenade",
    movement: "Static",
    lighting: "Red alert lights, smoke beginning to catch light",
    aiPrompt: "Tactical smoke grenade hitting industrial metal floor, initial burst of smoke, red alert lights reflecting off metal, detail shot, high speed photography aesthetic, photorealistic, cinematic detail",
    notes: "Impact moment - transitions to smoke-filled atmosphere"
  },
  {
    id: 6,
    shotType: "WIDE",
    duration: "2s",
    description: "Smoke rapidly fills tunnel from floor - atmospheric buildup",
    cameraAngle: "Wide angle down tunnel length",
    movement: "Static as smoke billows upward",
    lighting: "Red lights penetrating smoke, creating volumetric lighting",
    aiPrompt: "Military tunnel rapidly filling with tactical smoke from floor upward, red alert lights creating volumetric beams through smoke, atmospheric depth, industrial setting, cinematic wide shot, photorealistic, Ghost in the Shell aesthetic",
    notes: "Creates the iconic smoky atmosphere"
  },
  {
    id: 7,
    shotType: "DRAMATIC WIDE",
    duration: "3s",
    description: "Motoko drops through smoke in acrobatic ninja pose - THE signature shot of the film",
    cameraAngle: "Wide from tunnel end, capturing full scene",
    movement: "Slow motion as she descends",
    lighting: "Overhead light beam illuminating smoke and Motoko, red alert lights, dramatic contrast",
    aiPrompt: "Major Motoko Kusanagi in purple-black tactical armor dropping through overhead light beam in smoke-filled military tunnel, acrobatic low ninja landing pose, one knee down, dramatic shadows, overhead spotlight creating cone of light through smoke, red alert lights, photorealistic, cinematic masterpiece, Ghost in the Shell live action, 8k quality",
    notes: "CORE VISUAL OF ENTIRE FILM - This is the trailer shot. Motoko in perfect form, smoke illuminated dramatically, red lights, should be absolutely stunning"
  },
  {
    id: 8,
    shotType: "CU",
    duration: "1.5s",
    description: "Motoko's face through smoke - intense focus, combat-ready expression",
    cameraAngle: "Close-up, slightly low angle",
    movement: "Push in slowly",
    lighting: "Side lighting through smoke, dramatic shadows on face",
    aiPrompt: "Close-up of Major Motoko Kusanagi's face through smoke, intense focused expression, short dark hair, side lighting creating dramatic shadows, smoke wisps passing in front, combat-ready determination, photorealistic, cinematic portrait, Ghost in the Shell style",
    notes: "Character moment - shows her intensity and focus"
  },
  {
    id: 9,
    shotType: "MED",
    duration: "2s",
    description: "Motoko rises from landing pose, draws weapon in fluid motion",
    cameraAngle: "Medium shot, eye level",
    movement: "Follow action as she rises and draws",
    lighting: "Backlit by overhead light, rim lighting on figure",
    aiPrompt: "Medium shot of Motoko Kusanagi rising from crouch and drawing weapon in one fluid motion, tactical armor, smoke-filled environment, dramatic backlighting creating rim light on her silhouette, red alert lights, photorealistic action cinema, Ghost in the Shell",
    notes: "Transition to action - fluid, professional, deadly"
  },
  {
    id: 10,
    shotType: "OTS",
    duration: "2s",
    description: "Over Motoko's shoulder - reveals guards in tunnel ahead reacting",
    cameraAngle: "Over the shoulder from behind Motoko",
    movement: "Static",
    lighting: "Motoko in foreground shadow, guards illuminated by red lights",
    aiPrompt: "Over shoulder shot from behind Motoko in tactical armor, looking down smoke-filled tunnel at armed guards reacting in surprise, red alert lights, atmospheric smoke, tunnel perspective, cinematic composition, photorealistic, Ghost in the Shell action scene",
    notes: "Reveals the threat - guards are caught off guard"
  },
  {
    id: 11,
    shotType: "WIDE",
    duration: "3s",
    description: "Full combat initiation - Motoko moves toward guards with superhuman speed through smoke",
    cameraAngle: "Wide profile angle showing full tunnel",
    movement: "Fast tracking shot following her movement",
    lighting: "Motion blur, multiple exposure effect with red lights creating streaks",
    aiPrompt: "Wide action shot of Motoko Kusanagi moving at superhuman speed through smoke-filled tunnel toward guards, motion blur effect, red alert light trails, tactical combat, atmospheric smoke, industrial tunnel, photorealistic action cinematography, Ghost in the Shell style",
    notes: "Shows her enhanced abilities - superhuman speed and combat prowess"
  },
  {
    id: 12,
    shotType: "MONTAGE",
    duration: "4s",
    description: "Quick cuts of combat - strikes, disarms, tactical efficiency",
    cameraAngle: "Multiple angles - close-ups, impacts, movements",
    movement: "Fast cuts, dynamic camera",
    lighting: "High contrast, red lights, dramatic shadows",
    aiPrompt: "Dynamic combat montage, Motoko Kusanagi in close quarter combat, striking guards with precision, disarming weapons, tactical martial arts, smoke and red lights, multiple exposure effects, photorealistic action, Ghost in the Shell fight choreography",
    notes: "Fast-paced action showing her combat mastery"
  }
];

export const tunnelSequenceMetadata = {
  sequenceName: "Tunnel Infiltration",
  totalDuration: "28.5 seconds",
  keyVisual: "Frame 7 - Motoko's dramatic landing in illuminated smoke",
  purpose: "Signature action sequence establishing Motoko's capabilities and visual style of the film",
  technicalNotes: "Heavy use of practical smoke effects, overhead lighting rig for cone of light, high-speed camera for frame 7 slow motion",
  colorGrading: "Deep shadows, preserve red alert light saturation, slight purple tint on Motoko's suit, enhance smoke volume",
  soundDesign: "Industrial ambience, hatch mechanics, smoke hiss, impact sounds, combat foley, red alert klaxon subtle in background",
  musicCue: "Tension build to dramatic crescendo on frame 7 landing"
};
