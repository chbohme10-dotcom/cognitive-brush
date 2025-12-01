// Ghost in the Shell Project Data Structure
// Comprehensive metadata for characters, scenes, props, and story sequences

export interface CharacterData {
  id: string;
  name: string;
  role: string;
  description: string;
  outfits: {
    id: string;
    name: string;
    description: string;
    imagePath: string;
    aiPrompt: string;
  }[];
  expressions: string[];
  personality: string;
  capabilities: string[];
}

export interface SceneData {
  id: string;
  name: string;
  location: string;
  description: string;
  mood: string;
  lighting: string;
  timeOfDay: string;
  imagePath?: string;
  videoPath?: string;
  aiPrompt: string;
  relatedCharacters: string[];
  relatedProps: string[];
}

export interface PropData {
  id: string;
  name: string;
  category: string;
  description: string;
  imagePath?: string;
  aiPrompt: string;
  associatedCharacters: string[];
}

export interface StorySequence {
  id: string;
  name: string;
  scenes: string[];
  description: string;
  duration: string;
  keyVisuals: string[];
}

// ===== CHARACTERS =====

export const gitsCharacters: CharacterData[] = [
  {
    id: "motoko",
    name: "Major Motoko Kusanagi",
    role: "Protagonist - Section 9 Leader",
    description: "Full-body cyborg with exceptional combat and hacking abilities. Former military, now leads elite counter-terrorism unit Section 9. Philosophical about identity and consciousness.",
    outfits: [
      {
        id: "armor",
        name: "Tactical Armor",
        description: "Purple-black tactical suit with integrated systems. Combat-ready with optical camouflage capability.",
        imagePath: "/src/assets/gits/characters/motoko-armor.png",
        aiPrompt: "Motoko Kusanagi in tactical purple-black armor suit, cyberpunk aesthetic, full body cyborg, athletic build, short dark hair, intense gaze, professional lighting, dark studio background, front view, photorealistic, cinematic quality"
      },
      {
        id: "casual",
        name: "Casual Outfit",
        description: "Jacket and pants for undercover or off-duty. Still maintains tactical readiness.",
        imagePath: "/src/assets/gits/characters/motoko-casual.png",
        aiPrompt: "Motoko Kusanagi in casual leather jacket and dark pants, cyberpunk style, short dark hair, confident pose, dark studio background, cinematic lighting, photorealistic"
      }
    ],
    expressions: ["Focused", "Determined", "Contemplative", "Combat-ready", "Analytical"],
    personality: "Strategic, philosophical, fearless, questions existence and consciousness",
    capabilities: ["Cyberbrain hacking", "Optical camouflage", "Superhuman strength", "Advanced combat", "Network diving"]
  },
  {
    id: "batou",
    name: "Batou",
    role: "Section 9 Second-in-Command",
    description: "Heavily augmented cyborg with distinctive eyes. Former ranger, loyal to Motoko. Tough exterior with philosophical depth.",
    outfits: [
      {
        id: "tactical",
        name: "Section 9 Tactical",
        description: "Military-style tactical gear with integrated weapons systems.",
        imagePath: "/src/assets/gits/characters/batou-profile.png",
        aiPrompt: "Batou from Ghost in the Shell, large muscular build, distinctive cybernetic eyes, tactical military gear, short hair, rugged appearance, dark studio background, professional lighting, front view, photorealistic, cinematic"
      },
      {
        id: "commando",
        name: "Jungle Commando",
        description: "Camouflage gear for stealth operations in natural environments.",
        imagePath: "",
        aiPrompt: "Batou in jungle camouflage tactical gear, large build, cybernetic eyes, carrying specialized recon equipment, military precision, photorealistic"
      }
    ],
    expressions: ["Serious", "Protective", "Amused", "Alert", "Contemplative"],
    personality: "Loyal, philosophical despite tough exterior, protective of team",
    capabilities: ["Heavy weapons expert", "Enhanced strength", "Cybernetic eyes with thermal/night vision", "Close combat specialist"]
  },
  {
    id: "togusa",
    name: "Togusa",
    role: "Section 9 Detective",
    description: "Least cyberized member of Section 9. Former police detective with strong intuition and traditional investigative skills.",
    outfits: [
      {
        id: "detective",
        name: "Detective Style",
        description: "Professional suit appropriate for investigations and urban operations.",
        imagePath: "/src/assets/gits/characters/togusa-profile.png",
        aiPrompt: "Togusa from Ghost in the Shell, lean build, professional suit, neat hairstyle, intelligent expression, holding Mateba revolver, dark studio background, cinematic lighting, detective aesthetic, photorealistic"
      }
    ],
    expressions: ["Thoughtful", "Concerned", "Determined", "Surprised", "Focused"],
    personality: "Analytical, intuitive, values human connection, family man",
    capabilities: ["Expert marksmanship (Mateba revolver)", "Traditional detective work", "Cyber investigation", "Fast reflexes"]
  }
];

// ===== SCENES =====

export const gitsScenes: SceneData[] = [
  {
    id: "tunnel_infiltration",
    name: "Tunnel Infiltration",
    location: "Underground Communication Tunnel",
    description: "Military submarine aesthetic tunnel. Motoko infiltrates from overhead hatch, throws smoke grenade, drops in with acrobatic pose. Overhead light illuminates smoke in darkness with red alert lights creating dramatic visual.",
    mood: "Intense, dramatic, action-packed",
    lighting: "Overhead spotlight through smoke, red alert lights, high contrast shadows",
    timeOfDay: "N/A - Underground",
    imagePath: "/src/assets/gits/characters/motoko-armor.png",
    videoPath: "/src/assets/gits/videos/tunnel-sequence-1.mp4",
    aiPrompt: "Underground military tunnel with submarine aesthetic, red alert lights, overhead hatch with dramatic lighting, smoke-filled atmosphere, high contrast shadows, industrial textures, photorealistic, cinematic quality",
    relatedCharacters: ["motoko"],
    relatedProps: ["smoke_grenade", "hatch"]
  },
  {
    id: "city_skyline",
    name: "Neo-Tokyo Cityscape",
    location: "Neo-Tokyo Skyline",
    description: "Sprawling cyberpunk metropolis with massive skyscrapers, holographic advertisements, flying vehicles. Opening shot and establishing scenes.",
    mood: "Vast, technological, overwhelming",
    lighting: "Neon glow, artificial lights, night atmosphere",
    timeOfDay: "Night",
    imagePath: "/src/assets/gits/scenes/city-skyline.png",
    videoPath: "/src/assets/gits/videos/city-scene.mp4",
    aiPrompt: "Cyberpunk Neo-Tokyo cityscape at night, massive skyscrapers, holographic advertisements in Japanese, flying vehicles, neon lights reflecting off wet streets, atmospheric fog, cinematic wide shot, photorealistic",
    relatedCharacters: [],
    relatedProps: []
  },
  {
    id: "lab_facility",
    name: "Cyber Research Laboratory",
    location: "Section 9 or Corporate Lab",
    description: "High-tech laboratory with advanced cybernetic equipment, holographic displays, sterile yet ominous atmosphere.",
    mood: "Clinical, mysterious, technological",
    lighting: "Cool blue-white fluorescent, holographic displays",
    timeOfDay: "N/A - Interior",
    imagePath: "/src/assets/gits/scenes/lab-facility.jpeg",
    videoPath: "/src/assets/gits/videos/lab-scene.mp4",
    aiPrompt: "Futuristic cybernetics laboratory, advanced medical equipment, holographic brain displays, sterile environment, blue-white lighting, industrial sci-fi aesthetic, photorealistic",
    relatedCharacters: ["motoko"],
    relatedProps: ["cyborg_skull", "medical_equipment"]
  },
  {
    id: "rooftop_assassination",
    name: "Skyscraper Assassination Setup",
    location: "High-rise Building Rooftop",
    description: "Motoko observes target meeting from skyscraper vantage point. Urban sprawl below, preparing for precision strike.",
    mood: "Tense, focused, predatory",
    lighting: "Night city lights, shadows, sniper scope view",
    timeOfDay: "Night",
    aiPrompt: "Skyscraper rooftop at night, overlooking Neo-Tokyo cityscape, sniper vantage point, urban lights below, tactical position, cinematic composition, photorealistic",
    relatedCharacters: ["motoko"],
    relatedProps: ["sniper_rifle"]
  },
  {
    id: "mountain_drive",
    name: "Mountain Highway - Autumn",
    location: "Highway from City to Mountains",
    description: "Batou driving yellow Lotus through mountain roads during fall. Urban density transitions to natural beauty with colorful autumn trees.",
    mood: "Contemplative, peaceful, transitional",
    lighting: "Natural daylight, autumn golden hour",
    timeOfDay: "Afternoon",
    aiPrompt: "Winding mountain highway in autumn, colorful fall foliage, yellow sports car on scenic road, transition from urban to rural Japan, cinematic landscape, photorealistic",
    relatedCharacters: ["batou"],
    relatedProps: ["lotus_car"]
  },
  {
    id: "city_chase",
    name: "City High-Speed Chase",
    location: "Neo-Tokyo Streets",
    description: "Motoko driving Audi Quattro through city streets with Togusa. Fast-paced, showing her enjoying human thrills.",
    mood: "Exhilarating, dynamic, liberated",
    lighting: "Night neon reflections, motion blur, city lights",
    timeOfDay: "Night",
    aiPrompt: "High-speed car chase through cyberpunk city streets at night, Audi Quattro, motion blur, neon reflections, dynamic angle, cinematic action, photorealistic",
    relatedCharacters: ["motoko", "togusa"],
    relatedProps: ["audi_quattro"]
  },
  {
    id: "jungle_mission",
    name: "Jungle Reconnaissance",
    location: "Tropical Island Jungle",
    description: "Batou in commando camouflage moving through dense jungle for stealth recon mission. Photography secret meeting from vantage point.",
    mood: "Stealthy, tense, methodical",
    lighting: "Dappled jungle sunlight, green canopy shadows",
    timeOfDay: "Day",
    aiPrompt: "Dense tropical jungle, military reconnaissance operation, camouflage gear, jungle canopy lighting, stealth aesthetic, tactical photography equipment, photorealistic",
    relatedCharacters: ["batou"],
    relatedProps: ["recon_camera", "rifle"]
  },
  {
    id: "dark_street_ambush",
    name: "Downtown Tokyo Ambush",
    location: "Dark Tokyo Street",
    description: "Togusa walking down dark street, notices follower in reflection. Quick-draw confrontation as follower pulls weapon, Togusa's instincts kick in.",
    mood: "Suspenseful, sudden violence, reflexive",
    lighting: "Dark street, neon signs, reflective surfaces",
    timeOfDay: "Night",
    aiPrompt: "Dark Tokyo alleyway at night, suspicious figure following, reflections in windows, noir aesthetic, sudden confrontation, cinematic tension, photorealistic",
    relatedCharacters: ["togusa"],
    relatedProps: ["mateba_revolver"]
  },
  {
    id: "solar_sail_boat",
    name: "Solar Sail Submarine",
    location: "Ocean - Remote Waters",
    description: "Motoko on elegant solar sail boat/submarine in beautiful dress, drinking champagne alone with robot companions. Meets mysterious agent in massive black submarine rising from water.",
    mood: "Elegant, isolated, mysterious rendezvous",
    lighting: "Ocean sunset/sunrise, dramatic submarine emergence",
    timeOfDay: "Dawn or Dusk",
    aiPrompt: "Sleek futuristic solar sail boat on calm ocean, sunset lighting, elegant atmosphere, massive black submarine emerging from water, dramatic scale, cinematic composition, photorealistic",
    relatedCharacters: ["motoko"],
    relatedProps: ["solar_boat", "submarine", "champagne"]
  }
];

// ===== PROPS =====

export const gitsProps: PropData[] = [
  {
    id: "cyborg_skull",
    name: "Cyborg Skull",
    category: "Technology",
    description: "Exposed cybernetic skull showing internal systems, representing the fusion of human and machine.",
    imagePath: "/src/assets/gits/props/cyborg-skull.png",
    aiPrompt: "Detailed cybernetic skull, exposed circuitry and mechanical components, bio-mechanical fusion, Ghost in the Shell aesthetic, photorealistic, dramatic lighting",
    associatedCharacters: ["motoko"]
  },
  {
    id: "mateba_revolver",
    name: "Mateba Autorevolver",
    category: "Weapons",
    description: "Togusa's signature weapon - distinctive top-barrel automatic revolver.",
    aiPrompt: "Mateba 2006M autorevolver, distinctive top-firing barrel design, detailed metalwork, professional weapon photography, photorealistic",
    associatedCharacters: ["togusa"]
  },
  {
    id: "smoke_grenade",
    name: "Tactical Smoke Grenade",
    category: "Equipment",
    description: "Military-grade smoke grenade for infiltration and tactical cover.",
    aiPrompt: "Military smoke grenade, tactical equipment, professional product shot, photorealistic",
    associatedCharacters: ["motoko", "batou"]
  },
  {
    id: "audi_quattro",
    name: "Audi Quattro",
    category: "Vehicles",
    description: "Motoko's sports car for high-speed urban operations.",
    aiPrompt: "Audi Quattro sports car, sleek design, cyberpunk modifications, city environment, photorealistic automotive photography",
    associatedCharacters: ["motoko"]
  },
  {
    id: "lotus_car",
    name: "Yellow Lotus Elise",
    category: "Vehicles",
    description: "Batou's distinctive yellow sports car.",
    aiPrompt: "Yellow Lotus Elise sports car, mountain road setting, autumn environment, automotive photography, photorealistic",
    associatedCharacters: ["batou"]
  },
  {
    id: "solar_boat",
    name: "Solar Sail Boat",
    category: "Vehicles",
    description: "Elegant futuristic boat with solar sails, also functions as submarine.",
    aiPrompt: "Futuristic solar sail boat, elegant design, ocean setting, advanced technology, photorealistic",
    associatedCharacters: ["motoko"]
  },
  {
    id: "thermoptic_suit",
    name: "Thermoptic Camouflage Suit",
    category: "Equipment",
    description: "Optical camouflage technology allowing near-invisibility.",
    aiPrompt: "Invisible camouflage suit effect, thermoptic distortion, sci-fi technology, Ghost in the Shell aesthetic, photorealistic",
    associatedCharacters: ["motoko"]
  }
];

// ===== STORY SEQUENCES =====

export const gitsStorySequences: StorySequence[] = [
  {
    id: "opening_sequence",
    name: "Opening - City Assassination",
    scenes: ["city_skyline", "rooftop_assassination"],
    description: "Opening sequence establishing Neo-Tokyo and introducing Motoko through assassination mission. Mirrors 1989 manga opening.",
    duration: "3-5 minutes",
    keyVisuals: ["City establishing shot", "Rooftop sniper setup", "Target observation", "Precision strike"]
  },
  {
    id: "tunnel_infiltration_sequence",
    name: "Tunnel Infiltration",
    scenes: ["tunnel_infiltration"],
    description: "Signature action sequence - Motoko's dramatic entry into underground facility. Core visual for film and trailer.",
    duration: "2-3 minutes",
    keyVisuals: ["Overhead hatch opening", "Smoke grenade drop", "Illuminated smoke", "Acrobatic landing pose", "Combat initiation"]
  },
  {
    id: "character_moments",
    name: "Character Development Scenes",
    scenes: ["mountain_drive", "city_chase", "jungle_mission", "dark_street_ambush", "solar_sail_boat"],
    description: "Individual character moments showing personality, skills, and humanity.",
    duration: "15-20 minutes total",
    keyVisuals: ["Batou's contemplative drive", "Motoko's joy in speed", "Batou's tactical precision", "Togusa's instincts", "Motoko's isolation"]
  }
];

export const gitsProjectMetadata = {
  title: "Ghost in the Shell - Live Action Remake",
  basedOn: "1989 Manga by Masamune Shirow",
  description: "Live action remake capturing the philosophical depth and visual brilliance of the original manga.",
  themes: ["Identity and consciousness", "Human-machine fusion", "Corporate power", "Isolation in connection", "What makes us human"],
  visualStyle: "Cyberpunk noir with practical effects emphasis, dramatic lighting, philosophical undertones",
  colorPalette: ["Deep purples", "Neon blues", "Red alerts", "Industrial grays", "Warm skin tones"],
  status: "Pre-production - Building assets and sequences"
};
