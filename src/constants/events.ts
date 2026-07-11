import { AdventureEvent, MonsterData, GatheringNodeData, Item } from '../types';
import { generateRandomItem } from './items';

export interface RegionConfig {
  name: string;
  minLevel: number;
  maxLevel: number;
  description: string;
  townName: string;
  boss: MonsterData;
  monsters: MonsterData[];
  quests: { quest_id: string; name: string; description: string; target: number; reward_gold: number; reward_xp: number }[];
}

export const REGIONS_CONFIG: RegionConfig[] = [
  {
    name: 'Greenwood Forest',
    minLevel: 1,
    maxLevel: 10,
    description: 'A serene woodland filled with giant oaks, hiding mischievous goblins and rabid beasts.',
    townName: 'Oakvale Village',
    boss: { name: 'Spore Golem', hp: 300, max_hp: 300, attack: 15, xpReward: 150, goldReward: 100, lootChance: 0.8 },
    monsters: [
      { name: 'Forest Slime', hp: 30, max_hp: 30, attack: 3, xpReward: 10, goldReward: 5, lootChance: 0.2 },
      { name: 'Wild Goblin', hp: 45, max_hp: 45, attack: 5, xpReward: 15, goldReward: 12, lootChance: 0.3 },
      { name: 'Rabid Wolf', hp: 55, max_hp: 55, attack: 7, xpReward: 18, goldReward: 8, lootChance: 0.25 },
      { name: 'Greenwood Spider', hp: 40, max_hp: 40, attack: 6, xpReward: 14, goldReward: 10, lootChance: 0.35 }
    ],
    quests: [
      { quest_id: 'goblin_threat', name: 'Goblin Threat', description: 'Defeat 5 goblins causing trouble in the outskirts.', target: 5, reward_gold: 150, reward_xp: 200 },
      { quest_id: 'mining_materials', name: 'Iron Gathering', description: 'Mine 5 pieces of Iron Ore for the local blacksmith.', target: 5, reward_gold: 120, reward_xp: 150 }
    ]
  },
  {
    name: 'Whispering Caves',
    minLevel: 10,
    maxLevel: 30,
    description: 'Deep subterranean caverns resonating with soft murmurs and glittering crystal deposits.',
    townName: 'Underforge Cavern',
    boss: { name: 'Cave Beholder', hp: 800, max_hp: 800, attack: 35, xpReward: 500, goldReward: 400, lootChance: 0.9 },
    monsters: [
      { name: 'Cave Bat', hp: 120, max_hp: 120, attack: 14, xpReward: 45, goldReward: 20, lootChance: 0.2 },
      { name: 'Crystal Golem', hp: 200, max_hp: 200, attack: 22, xpReward: 70, goldReward: 35, lootChance: 0.4 },
      { name: 'Shadow Specter', hp: 150, max_hp: 150, attack: 18, xpReward: 55, goldReward: 25, lootChance: 0.3 },
      { name: 'Stone Lurker', hp: 180, max_hp: 180, attack: 20, xpReward: 60, goldReward: 30, lootChance: 0.35 }
    ],
    quests: [
      { quest_id: 'crystal_harvest', name: 'Crystal Harvest', description: 'Defeat 5 Crystal Golems to harvest their shards.', target: 5, reward_gold: 300, reward_xp: 400 },
      { quest_id: 'bat_wings', name: 'Cavern Safety', description: 'Defeat 5 Cave Bats to clear path routes.', target: 5, reward_gold: 250, reward_xp: 350 }
    ]
  },
  {
    name: 'Sunken Reefs',
    minLevel: 30,
    maxLevel: 60,
    description: 'Ruins of a lost coastal empire swallowed by the tides, now crawling with sea horrors.',
    townName: 'Coral Cove',
    boss: { name: 'Kraken Warlord', hp: 2200, max_hp: 2200, attack: 75, xpReward: 1800, goldReward: 1200, lootChance: 1.0 },
    monsters: [
      { name: 'Murloc Raider', hp: 350, max_hp: 350, attack: 34, xpReward: 120, goldReward: 60, lootChance: 0.25 },
      { name: 'Coral Golem', hp: 500, max_hp: 500, attack: 45, xpReward: 180, goldReward: 90, lootChance: 0.4 },
      { name: 'Deep Sea Siren', hp: 420, max_hp: 420, attack: 40, xpReward: 150, goldReward: 75, lootChance: 0.35 },
      { name: 'Great White Shark', hp: 600, max_hp: 600, attack: 52, xpReward: 220, goldReward: 110, lootChance: 0.3 }
    ],
    quests: [
      { quest_id: 'siren_song', name: 'Siren Hunting', description: 'Defeat 5 Deep Sea Sirens that lure sailors.', target: 5, reward_gold: 600, reward_xp: 800 },
      { quest_id: 'reef_clearing', name: 'Murloc Bounty', description: 'Slay 5 Murloc Raiders raiding supplies.', target: 5, reward_gold: 550, reward_xp: 750 }
    ]
  },
  {
    name: 'Scorched Wastes',
    minLevel: 60,
    maxLevel: 100,
    description: 'Desolate volcanic valleys filled with cinderstorms and cracks leaking liquid magma.',
    townName: 'Obsidian Outpost',
    boss: { name: 'Ash Titan', hp: 6500, max_hp: 6500, attack: 180, xpReward: 5000, goldReward: 3500, lootChance: 1.0 },
    monsters: [
      { name: 'Lava Beetle', hp: 1000, max_hp: 1000, attack: 85, xpReward: 400, goldReward: 200, lootChance: 0.25 },
      { name: 'Magma Hound', hp: 1200, max_hp: 1200, attack: 98, xpReward: 500, goldReward: 250, lootChance: 0.3 },
      { name: 'Fire Elemental', hp: 1500, max_hp: 1500, attack: 115, xpReward: 650, goldReward: 300, lootChance: 0.45 },
      { name: 'Scorched Berserker', hp: 1800, max_hp: 1800, attack: 130, xpReward: 800, goldReward: 400, lootChance: 0.35 }
    ],
    quests: [
      { quest_id: 'elemental_culling', name: 'Fire Culling', description: 'Defeat 5 Fire Elementals to cool down parameters.', target: 5, reward_gold: 1500, reward_xp: 2000 }
    ]
  },
  {
    name: 'Dragon Peaks',
    minLevel: 100,
    maxLevel: 150,
    description: 'Freezing, high-altitude mountain cliffs where wild dragons guard their sky sanctuaries.',
    townName: 'Wyvern Nest Outpost',
    boss: { name: 'Frost Wyrm', hp: 18000, max_hp: 18000, attack: 450, xpReward: 15000, goldReward: 10000, lootChance: 1.0 },
    monsters: [
      { name: 'Ice Wyvern', hp: 3200, max_hp: 3200, attack: 240, xpReward: 1800, goldReward: 800, lootChance: 0.35 },
      { name: 'Snow Yeti', hp: 4000, max_hp: 4000, attack: 280, xpReward: 2200, goldReward: 1000, lootChance: 0.3 },
      { name: 'Frost Giant', hp: 5500, max_hp: 5500, attack: 350, xpReward: 3000, goldReward: 1500, lootChance: 0.45 },
      { name: 'Glacier Drake', hp: 7000, max_hp: 7000, attack: 420, xpReward: 4000, goldReward: 2000, lootChance: 0.4 }
    ],
    quests: [
      { quest_id: 'giant_slayer', name: 'Giant Hunter', description: 'Slay 5 Frost Giants blocking trails.', target: 5, reward_gold: 5000, reward_xp: 8000 }
    ]
  },
  {
    name: 'Void Citadel',
    minLevel: 150,
    maxLevel: 200,
    description: 'A floating celestial castle suspended in a chaotic vacuum of dark matter and rifts.',
    townName: 'Eternity Sanctuary',
    boss: { name: 'Void Overlord', hp: 50000, max_hp: 50000, attack: 1200, xpReward: 50000, goldReward: 30000, lootChance: 1.0 },
    monsters: [
      { name: 'Void Walker', hp: 10000, max_hp: 10000, attack: 680, xpReward: 8000, goldReward: 4000, lootChance: 0.4 },
      { name: 'Chaos Horror', hp: 12500, max_hp: 12500, attack: 790, xpReward: 10000, goldReward: 5000, lootChance: 0.45 },
      { name: 'Rift Specter', hp: 15000, max_hp: 15000, attack: 920, xpReward: 12000, goldReward: 6000, lootChance: 0.5 },
      { name: 'Nether Weaver', hp: 18000, max_hp: 18000, attack: 1100, xpReward: 15000, goldReward: 8000, lootChance: 0.4 }
    ],
    quests: [
      { quest_id: 'void_closing', name: 'Closing Rifts', description: 'Defeat 5 Void Walkers to stabilize.', target: 5, reward_gold: 15000, reward_xp: 25000 }
    ]
  }
];

export const GATHERING_NODES: GatheringNodeData[] = [
  { name: 'Copper Deposit', profession: 'mining', requiredLevel: 1, xpReward: 15, materialName: 'Copper Ore' },
  { name: 'Iron Vein', profession: 'mining', requiredLevel: 1, xpReward: 25, materialName: 'Iron Ore' },
  { name: 'Silver Seam', profession: 'mining', requiredLevel: 3, xpReward: 40, materialName: 'Silver Ore' },
  { name: 'Gold Ore Node', profession: 'mining', requiredLevel: 5, xpReward: 70, materialName: 'Gold Ore' },
  { name: 'Obsidian Spire', profession: 'mining', requiredLevel: 7, xpReward: 120, materialName: 'Obsidian Ore' },
  
  { name: 'Wild Herbs Patch', profession: 'herbalism', requiredLevel: 1, xpReward: 15, materialName: 'Herbs' },
  { name: 'Glow Herbs Bush', profession: 'herbalism', requiredLevel: 2, xpReward: 30, materialName: 'Glow Herbs' },
  { name: 'Mana Blossom', profession: 'herbalism', requiredLevel: 5, xpReward: 65, materialName: 'Mana Shard' },

  { name: 'Tranquil Pond', profession: 'fishing', requiredLevel: 1, xpReward: 15, materialName: 'Raw Fish' },
  { name: 'Brimming River', profession: 'fishing', requiredLevel: 2, xpReward: 30, materialName: 'Raw Salmon' },
];

// Fallback arrays for backward compatibility
export const MONSTERS: MonsterData[] = REGIONS_CONFIG[0].monsters;
export const BOSSES: MonsterData[] = REGIONS_CONFIG.map(r => r.boss);

export const getRegionForLevel = (level: number): string => {
  const conf = REGIONS_CONFIG.find(r => level >= r.minLevel && level <= r.maxLevel);
  return conf ? conf.name : REGIONS_CONFIG[REGIONS_CONFIG.length - 1].name;
};

export const MATERIALS_BY_RARITY: Record<string, Array<{ name: string; emoji: string }>> = {
  Common: [
    { name: 'Wood Log', emoji: '🪵' }, { name: 'Stone', emoji: '🪨' },
    { name: 'Iron Ore', emoji: '🔩' }, { name: 'Copper Ore', emoji: '🪙' },
    { name: 'Coal', emoji: '⬛' }, { name: 'Plant Fiber', emoji: '🌾' },
    { name: 'Leather Scraps', emoji: '🏷️' }, { name: 'Animal Hide', emoji: '🐏' },
    { name: 'Bones', emoji: '🦴' }, { name: 'Feathers', emoji: '🪶' },
    { name: 'Mushrooms', emoji: '🍄' }, { name: 'Herbs', emoji: '🌿' },
    { name: 'Flowers', emoji: '🌸' }, { name: 'Clay', emoji: '🏺' },
    { name: 'Sand', emoji: '🏜️' }, { name: 'Water Flask', emoji: '🧪' },
    { name: 'Salt', emoji: '🧂' }, { name: 'Wheat', emoji: '🌾' },
    { name: 'Wool', emoji: '🧶' }, { name: 'Raw Meat', emoji: '🥩' }
  ],
  Uncommon: [
    { name: 'Silver Ore', emoji: '🥈' }, { name: 'Gold Ore', emoji: '🥇' },
    { name: 'Steel Ingot', emoji: '🧱' }, { name: 'Oak Wood', emoji: '🪵' },
    { name: 'Maple Wood', emoji: '🪵' }, { name: 'Silk Thread', emoji: '🧵' },
    { name: 'Spider Silk', emoji: '🕸️' }, { name: 'Crystal Shard', emoji: '🔮' },
    { name: 'Quartz', emoji: '💎' }, { name: 'Wolf Fur', emoji: '🐺' },
    { name: 'Bear Hide', emoji: '🐻' }, { name: 'Venom Sac', emoji: '🧪' },
    { name: 'Bat Wing', emoji: '🦇' }, { name: 'Pearl', emoji: '🦪' },
    { name: 'Coral', emoji: '🪸' }, { name: 'Obsidian', emoji: '🪨' }
  ],
  Rare: [
    { name: 'Mythril Ore', emoji: '🪙' }, { name: 'Sapphire', emoji: '🔷' },
    { name: 'Ruby', emoji: '🔻' }, { name: 'Emerald', emoji: '💚' },
    { name: 'Topaz', emoji: '💛' }, { name: 'Moonstone', emoji: '🌙' },
    { name: 'Sun Crystal', emoji: '☀️' }, { name: 'Ancient Bark', emoji: '🪵' },
    { name: 'Dragon Bone', emoji: '🦴' }, { name: 'Dragon Scale', emoji: '🛡️' },
    { name: 'Phoenix Feather', emoji: '🪶' }, { name: 'Griffin Feather', emoji: '🪶' },
    { name: 'Frost Core', emoji: '❄️' }, { name: 'Flame Core', emoji: '🔥' },
    { name: 'Storm Essence', emoji: '⚡' }
  ],
  Epic: [
    { name: 'Adamantite Ore', emoji: '🧱' }, { name: 'Void Crystal', emoji: '🔮' },
    { name: 'Spirit Essence', emoji: '✨' }, { name: 'Titan Steel', emoji: '🛡️' },
    { name: 'Ancient Relic', emoji: '🏺' }, { name: 'Leviathan Scale', emoji: '🐠' },
    { name: 'Hydra Blood', emoji: '🧪' }, { name: 'Giant Heart', emoji: '❤️' },
    { name: 'Celestial Thread', emoji: '🧵' }, { name: 'Arcane Dust', emoji: '✨' }
  ],
  Legendary: [
    { name: 'Phoenix Ash', emoji: '🌪️' }, { name: 'Divine Crystal', emoji: '💎' },
    { name: 'Dragon Heart', emoji: '🌋' }, { name: 'World Tree Branch', emoji: '🌿' },
    { name: 'Eternal Ice', emoji: '❄️' }, { name: 'Infernal Ember', emoji: '🔥' },
    { name: 'Kraken Ink', emoji: '🦑' }, { name: 'Soul Fragment', emoji: '👻' },
    { name: 'Celestial Ore', emoji: '🧱' }, { name: 'Ancient Rune', emoji: '📜' }
  ],
  Mythic: [
    { name: 'Time Fragment', emoji: '⏳' }, { name: 'Chaos Core', emoji: '🌀' },
    { name: 'Void Heart', emoji: '🖤' }, { name: 'Astral Crystal', emoji: '🌌' },
    { name: 'Fallen Star', emoji: '🌠' }, { name: 'Eclipse Stone', emoji: '🌑' },
    { name: 'Godsteel Ingot', emoji: '🪙' }, { name: 'Titan Bone', emoji: '🦴' }
  ],
  Divine: [
    { name: 'Heart of Creation', emoji: '💖' }, { name: 'Essence of Life', emoji: '🌱' },
    { name: 'Celestial Flame', emoji: '💥' }, { name: 'Divine Soul', emoji: '😇' },
    { name: 'Eternity Crystal', emoji: '⏳' }, { name: 'Cosmic Core', emoji: '🪐' },
    { name: 'World Seed', emoji: '🌰' }, { name: 'Genesis Stone', emoji: '☄️' }
  ],
  Gem: [
    { name: 'Ruby', emoji: '🔴' }, { name: 'Sapphire', emoji: '🔵' },
    { name: 'Emerald', emoji: '🟢' }, { name: 'Diamond', emoji: '💎' },
    { name: 'Amethyst', emoji: '🟣' }, { name: 'Topaz', emoji: '🟡' },
    { name: 'Opal', emoji: '⚪' }, { name: 'Moonstone', emoji: '🔵' },
    { name: 'Onyx', emoji: '⚫' }, { name: 'Aquamarine', emoji: '🌐' }
  ],
  Alchemy: [
    { name: 'Healing Herb', emoji: '🌿' }, { name: 'Mana Herb', emoji: '🌿' },
    { name: 'Nightshade', emoji: '🪻' }, { name: 'Blood Moss', emoji: '🪹' },
    { name: 'Frost Bloom', emoji: '❄️' }, { name: 'Fire Blossom', emoji: '🔥' },
    { name: 'Golden Lotus', emoji: '🪷' }, { name: 'Poison Ivy', emoji: '☘️' },
    { name: 'Crystal Mushroom', emoji: '🍄' }, { name: 'Glowcap Mushroom', emoji: '🍄' },
    { name: 'Honeycomb', emoji: '🐝' }, { name: 'Bee Wax', emoji: '🍯' },
    { name: 'Slime Gel', emoji: '🟢' }, { name: 'Magic Dust', emoji: '✨' },
    { name: 'Fairy Dust', emoji: '✨' }
  ],
  Boss: [
    { name: "Goblin King's Crown", emoji: '👑' }, { name: 'Forest Guardian Bark', emoji: '🪵' },
    { name: 'Ancient Golem Core', emoji: '🪨' }, { name: 'Ice Dragon Scale', emoji: '❄️' },
    { name: 'Fire Dragon Heart', emoji: '❤️' }, { name: 'Sea Serpent Fang', emoji: '🦷' },
    { name: 'Demon Lord Horn', emoji: '😈' }, { name: 'Shadow Lord Cloak', emoji: '🧥' },
    { name: 'Phoenix Core', emoji: '🔴' }, { name: 'Titan Hammer Fragment', emoji: '🔨' },
    { name: 'Kraken Tentacle', emoji: '🦑' }, { name: 'Lich King\'s Phylactery', emoji: '💀' }
  ]
};

const rollMaterialForRegion = (region: string): { name: string; emoji: string } => {
  const r = Math.random();
  let rarityList: string[] = ['Common'];

  if (region === 'Greenwood Forest') {
    rarityList = r < 0.85 ? ['Common'] : r < 0.95 ? ['Alchemy'] : ['Uncommon'];
  } else if (region === 'Whispering Caves') {
    rarityList = r < 0.60 ? ['Common'] : r < 0.85 ? ['Uncommon'] : r < 0.95 ? ['Alchemy'] : ['Gem'];
  } else if (region === 'Sunken Reefs') {
    rarityList = r < 0.35 ? ['Common'] : r < 0.70 ? ['Uncommon'] : r < 0.88 ? ['Rare'] : r < 0.95 ? ['Gem'] : ['Epic'];
  } else if (region === 'Scorched Wastes') {
    rarityList = r < 0.40 ? ['Uncommon'] : r < 0.80 ? ['Rare'] : r < 0.92 ? ['Epic'] : ['Legendary'];
  } else if (region === 'Dragon Peaks') {
    rarityList = r < 0.35 ? ['Rare'] : r < 0.70 ? ['Epic'] : r < 0.88 ? ['Legendary'] : r < 0.96 ? ['Mythic'] : ['Divine'];
  } else { // Void Citadel
    rarityList = r < 0.30 ? ['Epic'] : r < 0.65 ? ['Legendary'] : r < 0.85 ? ['Mythic'] : ['Divine'];
  }

  const chosenKey = rarityList[Math.floor(Math.random() * rarityList.length)];
  const pool = MATERIALS_BY_RARITY[chosenKey] || MATERIALS_BY_RARITY.Common;
  return pool[Math.floor(Math.random() * pool.length)];
};


import { ADVENTURE_STORIES } from './adventureStories';

export const generateRandomEvent = (playerLevel: number, activeRegionName?: string): AdventureEvent => {
  const roll = Math.random();
  const regionName = activeRegionName || getRegionForLevel(playerLevel);
  const regionConfig = REGIONS_CONFIG.find(r => r.name === regionName) || REGIONS_CONFIG[0];

  // Specific Loot Table Odds:
  // 5% chance to lose gold (Event)
  // 15% chance to fight a monster (Event)
  // 10% chance to get an item (Loot)
  // 20% chance to get materials (Loot)
  // 50% chance to trigger an adventure story event (Nothing - gaining gold & exp safely)

  if (roll < 0.05) {
    // 5% gold loss (Event)
    const goldLost = Math.max(5, Math.round(10 + playerLevel * 1.5 * (0.8 + Math.random() * 0.4)));
    return {
      type: 'Treasure',
      title: '💸 Pickpocketed!',
      description: `A stealthy bandit pickpockets you in the crowd, stealing ${goldLost} Gold before disappearing into the brush!`,
      chestLoot: {
        gold: -goldLost,
        item: undefined,
        xp: 0
      }
    };
  } 
  else if (roll < 0.20) {
    // 15% monster fight (Event)
    const baseMonster = regionConfig.monsters[Math.floor(Math.random() * regionConfig.monsters.length)];
    const scalingFactor = 1 + (playerLevel - regionConfig.minLevel) * 0.05;
    
    const monster: MonsterData = {
      name: `${baseMonster.name}`,
      hp: Math.round(baseMonster.hp * scalingFactor),
      max_hp: Math.round(baseMonster.max_hp * scalingFactor),
      attack: Math.round(baseMonster.attack * scalingFactor),
      xpReward: Math.round(baseMonster.xpReward * scalingFactor),
      goldReward: Math.round(baseMonster.goldReward * scalingFactor),
      lootChance: baseMonster.lootChance
    };

    return {
      type: 'Monster',
      title: `Wild ${monster.name}!`,
      description: `A hostile ${monster.name} leaps from the shadows of ${regionName}!`,
      monster
    };
  } 
  else if (roll < 0.30) {
    // 10% item drop (Loot)
    const rolledItem = generateRandomItem();
    return {
      type: 'Treasure',
      title: '🎁 Glimmering Cache',
      description: `You spot a leather sack caught in the branches. Inside, you find a pristine gear piece!`,
      chestLoot: {
        gold: 0,
        item: rolledItem,
        xp: Math.round(playerLevel * 3 + 10)
      }
    };
  } 
  else if (roll < 0.50) {
    // 20% gathering materials (Loot)
    const mat = rollMaterialForRegion(regionConfig.name);
    
    // Auto-map material keyword to relevant skill
    const skills = ['mining', 'woodcutting', 'herbalism', 'skinning', 'fishing', 'foraging'];
    let skill = 'foraging';
    const n = mat.name.toLowerCase();
    
    if (n.includes('ore') || n.includes('coal') || n.includes('crystal') || n.includes('stone') || n.includes('obsidian') || n.includes('ingot') || n.includes('seam') || n.includes('shard') || n.includes('quartz')) {
      skill = 'mining';
    } else if (n.includes('log') || n.includes('wood') || n.includes('bark') || n.includes('branch')) {
      skill = 'woodcutting';
    } else if (n.includes('herb') || n.includes('flower') || n.includes('bloom') || n.includes('lotus') || n.includes('nightshade') || n.includes('mushroom') || n.includes('glowcap') || n.includes('dust') || n.includes('gel') || n.includes('slime')) {
      skill = 'herbalism';
    } else if (n.includes('hide') || n.includes('fur') || n.includes('leather') || n.includes('bone') || n.includes('scraps') || n.includes('fang') || n.includes('tooth')) {
      skill = 'skinning';
    } else if (n.includes('pearl') || n.includes('coral') || n.includes('fish') || n.includes('scale') || n.includes('tentacle') || n.includes('ink') || n.includes('sea')) {
      skill = 'fishing';
    }

    const node: GatheringNodeData = {
      name: `${mat.emoji} ${mat.name}`,
      profession: skill as any,
      requiredLevel: Math.max(1, Math.floor(regionConfig.minLevel / 12)),
      xpReward: Math.round(15 + regionConfig.minLevel * 0.4),
      materialName: `${mat.emoji} ${mat.name}`
    };

    return {
      type: 'Gathering',
      title: `Resource Located`,
      description: `You spot a prime node of ${mat.emoji} ${mat.name} that can be harvested.`,
      gathering: node
    };
  } 
  else {
    // 50% story encounter (Nothing)
    const safeXP = Math.round(playerLevel * 4 + 12);
    const safeGold = Math.round(playerLevel * 3 + 10);
    const randomStory = ADVENTURE_STORIES[Math.floor(Math.random() * ADVENTURE_STORIES.length)];
    
    return {
      type: 'Nothing',
      title: '🌿 Wilds Encounter',
      description: `${randomStory}\n\nYou safely proceed, gaining experience and minor loot.`,
      chestLoot: {
        gold: safeGold,
        item: undefined,
        xp: safeXP
      }
    };
  }
};
