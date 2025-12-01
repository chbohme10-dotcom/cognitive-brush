import { AssetMetadata } from './useAssets';
import motokoArmor from '@/assets/gits/characters/motoko-armor.png';
import motokoCasual from '@/assets/gits/characters/motoko-casual.png';
import batouProfile from '@/assets/gits/characters/batou-profile.png';
import togusaProfile from '@/assets/gits/characters/togusa-profile.png';
import tunnelInfiltration from '@/assets/gits/scenes/tunnel-infiltration.png';
import citySkyline from '@/assets/gits/scenes/city-skyline.png';
import labFacility from '@/assets/gits/scenes/lab-facility.jpeg';
import labWide from '@/assets/gits/scenes/lab-wide.png';
import cyborgSkull from '@/assets/gits/props/cyborg-skull.png';

// Pre-loaded Ghost in the Shell assets for showcase
export const gitsAssets: AssetMetadata[] = [
  // ===== CHARACTERS =====
  {
    id: 'gits-motoko-armor',
    name: 'Motoko - Tactical Armor',
    url: motokoArmor,
    category: 'character',
    complexity: 'very_high',
    recommendedTool: 'ICE Canvas with reference consistency',
    imageHint: ['motoko', 'kusanagi', 'major', 'armor', 'tactical', 'cyborg', 'protagonist'],
    description: 'Major Motoko Kusanagi in signature purple-black tactical armor. Full-body cyborg, Section 9 leader. Use for action scenes and infiltration sequences.',
    contextual_previews: {
      expressions: {
        focused: 'Intense analytical stare, mission-focused',
        combat: 'Determined battle-ready expression',
        contemplative: 'Philosophical, questioning existence'
      },
      poses: {
        standing: 'Professional tactical stance',
        action: 'Dynamic combat pose',
        landing: 'Acrobatic ninja landing from infiltration'
      }
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-motoko-casual',
    name: 'Motoko - Casual Outfit',
    url: motokoCasual,
    category: 'character',
    complexity: 'very_high',
    recommendedTool: 'ICE Canvas for consistent character',
    imageHint: ['motoko', 'casual', 'jacket', 'undercover', 'off-duty'],
    description: 'Motoko in casual leather jacket outfit. Use for undercover operations, character development scenes, and showing her more human side.',
    contextual_previews: {
      mood: {
        relaxed: 'More at ease, less tactical',
        focused: 'Still maintaining alertness'
      }
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-batou',
    name: 'Batou',
    url: batouProfile,
    category: 'character',
    complexity: 'very_high',
    recommendedTool: 'ICE Canvas with consistent features',
    imageHint: ['batou', 'cyborg', 'eyes', 'tactical', 'section9', 'ranger'],
    description: 'Batou - Section 9 second-in-command. Heavily augmented with distinctive cybernetic eyes. Loyal, philosophical warrior.',
    contextual_previews: {
      outfits: {
        tactical: 'Section 9 standard gear',
        commando: 'Jungle camouflage for stealth ops',
        casual: 'Off-duty relaxed attire'
      }
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-togusa',
    name: 'Togusa',
    url: togusaProfile,
    category: 'character',
    complexity: 'high',
    recommendedTool: 'Standard generation with detective aesthetic',
    imageHint: ['togusa', 'detective', 'section9', 'mateba', 'investigator'],
    description: 'Togusa - Section 9 detective. Least augmented member, relies on intuition and traditional investigation. Signature Mateba revolver.',
    contextual_previews: {
      scenes: {
        investigation: 'Thoughtful analytical pose',
        action: 'Quick-draw reflex stance',
        interrogation: 'Professional detective demeanor'
      }
    },
    created_at: new Date().toISOString()
  },

  // ===== SCENES =====
  {
    id: 'gits-tunnel',
    name: 'Tunnel Infiltration',
    url: tunnelInfiltration,
    category: 'landscape',
    complexity: 'very_high',
    recommendedTool: 'Outpainting for extended tunnel, ICE for lighting consistency',
    imageHint: ['tunnel', 'infiltration', 'underground', 'military', 'smoke', 'dramatic', 'signature'],
    description: 'THE signature scene - Motoko infiltrating underground tunnel with smoke grenade. Overhead light through smoke, red alerts, acrobatic landing. Core visual of the film and trailer.',
    contextual_previews: {
      shots: {
        wide: 'Full tunnel establishing shot',
        character: 'Motoko in dramatic landing pose',
        detail: 'Smoke and lighting effects focus'
      },
      lighting: {
        overhead: 'Cone of light through hatch',
        alert: 'Red emergency lights',
        smoke: 'Volumetric lighting through smoke'
      }
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-city',
    name: 'Neo-Tokyo Cityscape',
    url: citySkyline,
    category: 'landscape',
    complexity: 'very_high',
    recommendedTool: 'Wide generation with cyberpunk aesthetic',
    imageHint: ['neo-tokyo', 'cyberpunk', 'city', 'skyline', 'neon', 'future', 'establishing'],
    description: 'Sprawling Neo-Tokyo cityscape at night. Massive skyscrapers, holographic ads, flying vehicles. Opening and establishing shots.',
    contextual_previews: {
      timeOfDay: {
        night: 'Primary neon-lit atmosphere',
        dusk: 'Transition lighting with sunset'
      },
      detail: {
        wide: 'Full cityscape panorama',
        medium: 'Building detail with holograms',
        street: 'Ground-level urban density'
      }
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-lab-facility',
    name: 'Cyber Research Lab',
    url: labFacility,
    category: 'landscape',
    complexity: 'high',
    recommendedTool: 'Interior generation with sci-fi medical aesthetic',
    imageHint: ['laboratory', 'cybernetics', 'research', 'facility', 'medical', 'technology'],
    description: 'High-tech cybernetics laboratory. Advanced medical equipment, holographic displays, sterile yet ominous atmosphere.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-lab-wide',
    name: 'Lab Facility - Wide',
    url: labWide,
    category: 'landscape',
    complexity: 'high',
    imageHint: ['laboratory', 'wide', 'facility', 'industrial', 'research'],
    description: 'Wide shot of laboratory facility showing full scale and scope of operations.',
    created_at: new Date().toISOString()
  },

  // ===== PROPS =====
  {
    id: 'gits-cyborg-skull',
    name: 'Cyborg Skull',
    url: cyborgSkull,
    category: 'product',
    complexity: 'high',
    recommendedTool: 'Detail generation with mechanical focus',
    imageHint: ['cyborg', 'skull', 'mechanical', 'circuitry', 'biomechanical', 'technology'],
    description: 'Exposed cybernetic skull showing internal systems. Represents human-machine fusion central to Ghost in the Shell themes.',
    contextual_previews: {
      angles: {
        front: 'Face-on view of mechanical systems',
        profile: 'Side view showing depth of augmentation',
        detail: 'Close-up of circuitry and components'
      }
    },
    created_at: new Date().toISOString()
  }
];

// Categories for Asset Browser filtering
export const gitsCategories = [
  { id: 'character', label: 'Characters', count: 3 },
  { id: 'landscape', label: 'Scenes', count: 4 },
  { id: 'product', label: 'Props', count: 1 },
  { id: 'all', label: 'All Assets', count: 8 }
];

// Asset organization metadata
export const gitsAssetMetadata = {
  projectName: 'Ghost in the Shell - Live Action',
  totalAssets: gitsAssets.length,
  characterAssets: gitsAssets.filter(a => a.category === 'character').length,
  sceneAssets: gitsAssets.filter(a => a.category === 'landscape').length,
  propAssets: gitsAssets.filter(a => a.category === 'product').length,
  aiReadyAssets: gitsAssets.filter(a => a.recommendedTool).length,
  lastUpdated: new Date().toISOString()
};
