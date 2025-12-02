import { AssetMetadata } from './useAssets';
import motokoArmor from '@/assets/gits/characters/motoko-armor.png';
import motokoCasual from '@/assets/gits/characters/motoko-casual.png';
import batouProfile from '@/assets/gits/characters/batou-profile.png';
import togusaProfile from '@/assets/gits/characters/togusa-profile.png';
import tunnelInfiltration from '@/assets/gits/scenes/tunnel-infiltration.png';
import tunnelCloseup from '@/assets/gits/scenes/tunnel-closeup.jpeg';
import citySkyline from '@/assets/gits/scenes/city-skyline.png';
import labFacility from '@/assets/gits/scenes/lab-facility.jpeg';
import labWide from '@/assets/gits/scenes/lab-wide.png';
import cyborgSkull from '@/assets/gits/props/cyborg-skull.png';
// New scene imports
import tokyoCrossing from '@/assets/gits/scenes/tokyo-crossing.avif';
import cityAerial from '@/assets/gits/scenes/city-aerial.avif';
import kyotoTemple from '@/assets/gits/scenes/kyoto-temple.avif';
import mountainTown from '@/assets/gits/scenes/mountain-town.avif';
import taipeiOverview from '@/assets/gits/scenes/taipei-overview.avif';
import stationArchitecture from '@/assets/gits/scenes/station-architecture.webp';
import rainyStreetNight from '@/assets/gits/scenes/rainy-street-night.jpeg';
import neonDistrict from '@/assets/gits/scenes/neon-district.jpg';
import skyscraperVertigo from '@/assets/gits/scenes/skyscraper-vertigo.jpg';
import japanPanorama from '@/assets/gits/scenes/japan-panorama.avif';

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
  {
    id: 'gits-tunnel-closeup',
    name: 'Tunnel Closeup',
    url: tunnelCloseup,
    category: 'landscape',
    complexity: 'high',
    imageHint: ['tunnel', 'closeup', 'underground', 'military', 'industrial'],
    description: 'Close-up shot of tunnel interior details for reference.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-tokyo-crossing',
    name: 'Tokyo Crossing',
    url: tokyoCrossing,
    category: 'landscape',
    complexity: 'very_high',
    imageHint: ['tokyo', 'shibuya', 'crossing', 'urban', 'crowds', 'city'],
    description: 'Iconic Tokyo crossing - massive urban intersection for establishing city shots.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-city-aerial',
    name: 'City Aerial View',
    url: cityAerial,
    category: 'landscape',
    complexity: 'very_high',
    imageHint: ['aerial', 'city', 'skyline', 'urban', 'overview'],
    description: 'Aerial view of city for establishing shots and transitions.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-kyoto-temple',
    name: 'Kyoto Temple',
    url: kyotoTemple,
    category: 'landscape',
    complexity: 'high',
    imageHint: ['kyoto', 'temple', 'traditional', 'japan', 'spiritual'],
    description: 'Traditional Japanese temple - contrast to cyberpunk technology for philosophical scenes.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-mountain-town',
    name: 'Mountain Town',
    url: mountainTown,
    category: 'landscape',
    complexity: 'high',
    imageHint: ['mountain', 'town', 'traditional', 'japan', 'countryside', 'batou'],
    description: 'Traditional Japanese mountain town - Batou\'s destination when visiting distant relative.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-taipei-overview',
    name: 'Taipei Overview',
    url: taipeiOverview,
    category: 'landscape',
    complexity: 'very_high',
    imageHint: ['taipei', 'city', 'modern', 'asia', 'urban'],
    description: 'Modern Asian city skyline for location variety.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-station-architecture',
    name: 'Station Architecture',
    url: stationArchitecture,
    category: 'landscape',
    complexity: 'high',
    imageHint: ['station', 'architecture', 'modern', 'infrastructure', 'urban'],
    description: 'Modern station architecture for urban infrastructure scenes.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-rainy-street',
    name: 'Rainy Street Night',
    url: rainyStreetNight,
    category: 'landscape',
    complexity: 'very_high',
    imageHint: ['night', 'rain', 'street', 'neon', 'noir', 'togusa', 'ambush'],
    description: 'Rainy night street - perfect for Togusa ambush scene and noir atmosphere.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-neon-district',
    name: 'Neon District',
    url: neonDistrict,
    category: 'landscape',
    complexity: 'very_high',
    imageHint: ['neon', 'district', 'cyberpunk', 'city', 'night', 'urban'],
    description: 'Vibrant neon-lit district - quintessential cyberpunk atmosphere.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-skyscraper-vertigo',
    name: 'Skyscraper Vertigo',
    url: skyscraperVertigo,
    category: 'landscape',
    complexity: 'very_high',
    imageHint: ['skyscraper', 'vertigo', 'height', 'rooftop', 'assassination'],
    description: 'Dramatic skyscraper perspective - ideal for rooftop assassination setup scene.',
    created_at: new Date().toISOString()
  },
  {
    id: 'gits-japan-panorama',
    name: 'Japan Panorama',
    url: japanPanorama,
    category: 'landscape',
    complexity: 'very_high',
    imageHint: ['japan', 'panorama', 'landscape', 'wide', 'establishing'],
    description: 'Wide Japan panorama for establishing shots and transitions.',
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
  { id: 'character', label: 'Characters', count: 4 },
  { id: 'landscape', label: 'Scenes', count: 16 },
  { id: 'product', label: 'Props', count: 1 },
  { id: 'all', label: 'All Assets', count: 21 }
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
