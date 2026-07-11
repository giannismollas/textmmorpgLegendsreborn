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

export const generateRandomEvent = (playerLevel: number, activeRegionName?: string): AdventureEvent => {
  const roll = Math.random();
  const regionName = activeRegionName || getRegionForLevel(playerLevel);
  const regionConfig = REGIONS_CONFIG.find(r => r.name === regionName) || REGIONS_CONFIG[0];

  // Weightings:
  // Monster Fight: 42%
  // Gathering: 18%
  // Treasure: 15%
  // Nothing: 10%
  // Merchant: 10%
  // NPC Quest: 5%
  
  if (roll < 0.42) {
    // Monster Event
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
  else if (roll < 0.60) {
    // Gathering Event
    const nodes = GATHERING_NODES.filter(n => {
      if (regionConfig.name === 'Greenwood Forest') return n.requiredLevel <= 2;
      if (regionConfig.name === 'Whispering Caves') return n.requiredLevel <= 3;
      return true;
    });
    const node = nodes[Math.floor(Math.random() * nodes.length)] || GATHERING_NODES[0];
    return {
      type: 'Gathering',
      title: `${node.name} Discovered`,
      description: `You spot a rich ${node.name} ripe for harvesting.`,
      gathering: node
    };
  } 
  else if (roll < 0.75) {
    // Treasure Chest
    const goldFound = Math.round(50 + playerLevel * 15 * (0.8 + Math.random() * 0.4));
    const itemsRoll = Math.random();
    let lootItem: Item | undefined;
    
    if (itemsRoll < 0.4) {
      lootItem = generateRandomItem();
    }

    return {
      type: 'Treasure',
      title: 'Hidden Chest Found',
      description: `You discover a dust-covered chest tucked away in ${regionName}.`,
      chestLoot: {
        gold: goldFound,
        item: lootItem
      }
    };
  } 
  else if (roll < 0.85) {
    // Nothing
    const safeXP = Math.round(playerLevel * 3);
    const safeGold = Math.round(playerLevel * 2);
    
    const messages = [
      'You travel along a peaceful pathway, enjoying the views.',
      'The road ahead is clear. You find a moment to catch your breath.',
      'You bypass a sleeping beast quietly and continue on your way.',
      'A traveler greets you warmly and shares a story.',
    ];
    
    return {
      type: 'Nothing',
      title: 'Travel Safely',
      description: messages[Math.floor(Math.random() * messages.length)] + ` You gain minor experience (+${safeXP} XP) and a few coins (+${safeGold} Gold).`,
      chestLoot: {
        gold: safeGold,
        item: undefined
      }
    };
  } 
  else if (roll < 0.95) {
    // Merchant Event
    const merchantItems: Item[] = [
      generateRandomItem('Common'),
      generateRandomItem('Uncommon'),
      generateRandomItem('Rare')
    ];
    
    merchantItems.forEach(item => {
      item.value = Math.round(item.value * 1.5);
    });

    return {
      type: 'Merchant',
      title: 'Wandering Merchant',
      description: 'A hooded merchant sits beside a pack mule. "Greetings, traveler! Care to look at my wares? I will also buy your materials."',
      merchantItems
    };
  } 
  else {
    // NPC Quest Giver
    const questData = regionConfig.quests[Math.floor(Math.random() * regionConfig.quests.length)] || regionConfig.quests[0];
    return {
      type: 'NPC',
      title: 'Mysterious Stranger',
      description: `An NPC flags you down. "Traveler, I need your assistance. ${questData.description}"`,
      quest: questData
    };
  }
};
