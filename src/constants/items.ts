import { Item, ItemRarity, ItemType, ItemStats } from '../types';

export const RARITIES: { name: ItemRarity; color: string; chance: number; displayColor: string }[] = [
  { name: 'Common', color: 'gray', chance: 0.60, displayColor: '#9ca3af' },
  { name: 'Uncommon', color: 'green', chance: 0.25, displayColor: '#22c55e' },
  { name: 'Rare', color: 'blue', chance: 0.10, displayColor: '#3b82f6' },
  { name: 'Epic', color: 'purple', chance: 0.035, displayColor: '#a855f7' },
  { name: 'Legendary', color: 'orange', chance: 0.01, displayColor: '#f97316' },
  { name: 'Mythic', color: 'red', chance: 0.004, displayColor: '#ef4444' },
  { name: 'Divine', color: 'gold', chance: 0.001, displayColor: '#eab308' },
];

export const WEAPON_BASES = [
  // Swords
  "Wooden Sword", "Rusty Sword", "Iron Sword", "Bronze Sword", "Steel Sword", "Knight's Sword", "Longsword", "Bastard Sword", "Claymore", "Falchion", "Scimitar", "Cutlass", "Rapier", "Sabre", "Viking Sword", "Gladius", "Highland Blade", "Royal Sword", "Noble Blade", "Dragonfang Sword", "Crystal Blade", "Shadow Blade", "Moonlight Sword", "Sunfire Sword", "Frostblade", "Stormblade", "Blood Sword", "Cursed Sword", "Holy Sword", "Runic Sword", "Phoenix Blade", "Infernal Blade", "Titan Sword", "Mythril Sword", "Adamant Sword", "Divine Sword",
  // Greatswords
  "Iron Greatsword", "Steel Greatsword", "Executioner's Blade", "Dragon Greatsword", "Titan Greatsword", "King's Greatsword", "Eternal Greatsword", "Worldbreaker", "Doombringer", "Celestial Greatsword",
  // Daggers
  "Rusty Dagger", "Iron Dagger", "Assassin's Dagger", "Poison Dagger", "Shadow Dagger", "Crystal Dagger", "Bone Knife", "Obsidian Knife", "Moon Dagger", "Phantom Blade", "Silent Fang", "Venom Fang", "Blood Dagger", "Dragon Fang", "Divine Dagger",
  // Axes
  "Hand Axe", "Iron Axe", "Steel Axe", "Battle Axe", "Double Axe", "War Axe", "Berserker Axe", "Orcish Axe", "Dragon Axe", "Titan Axe", "Frost Axe", "Infernal Axe", "Runic Axe", "Divine Axe",
  // Hammers
  "Wooden Hammer", "Blacksmith Hammer", "Iron Hammer", "Steel Hammer", "War Hammer", "Spiked Hammer", "Thunder Hammer", "Titan Hammer", "Holy Hammer", "Doom Hammer", "Dragon Hammer", "Celestial Hammer",
  // Spears
  "Wooden Spear", "Hunting Spear", "Iron Spear", "Steel Spear", "Pike", "Lance", "Dragon Spear", "Royal Lance", "Crystal Spear", "Frost Spear", "Infernal Spear", "Divine Spear",
  // Bows
  "Short Bow", "Long Bow", "Hunter Bow", "Composite Bow", "Recurve Bow", "Elven Bow", "Oak Bow", "Maple Bow", "Crystal Bow", "Frost Bow", "Phoenix Bow", "Dragon Bow", "Shadow Bow", "Divine Bow",
  // Crossbows
  "Light Crossbow", "Heavy Crossbow", "Steel Crossbow", "Repeating Crossbow", "Sniper Crossbow", "Dragon Crossbow", "Divine Crossbow",
  // Magic Staves
  "Wooden Staff", "Apprentice Staff", "Mage Staff", "Crystal Staff", "Fire Staff", "Ice Staff", "Nature Staff", "Storm Staff", "Shadow Staff", "Light Staff", "Arcane Staff", "Elder Staff", "World Tree Staff", "Divine Staff",
  // Wands
  "Oak Wand", "Apprentice Wand", "Crystal Wand", "Fire Wand", "Ice Wand", "Shadow Wand", "Arcane Wand", "Celestial Wand",
  // Scythes
  "Farmer's Scythe", "Bone Scythe", "Death Scythe", "Shadow Scythe", "Reaper's Scythe", "Soul Scythe", "Divine Scythe"
];

export const ARMOR_BASES = [
  // Helmets
  "Cloth Hood", "Leather Hood", "Iron Helmet", "Steel Helmet", "Knight Helmet", "Viking Helmet", "Great Helm", "Royal Crown", "Mage Hood", "Assassin Hood", "Dragon Helm", "Phoenix Helm", "Titan Helm", "Divine Crown",
  // Chest Armor
  "Cloth Robe", "Leather Armor", "Chainmail", "Iron Chestplate", "Steel Chestplate", "Knight Armor", "Paladin Armor", "Dragon Armor", "Crystal Armor", "Shadow Armor", "Phoenix Armor", "Titan Armor", "Divine Plate",
  // Gloves
  "Cloth Gloves", "Leather Gloves", "Iron Gauntlets", "Steel Gauntlets", "Assassin Gloves", "Mage Gloves", "Dragon Gauntlets", "Titan Gauntlets", "Divine Gloves",
  // Boots
  "Leather Boots", "Traveler Boots", "Iron Boots", "Steel Boots", "Knight Boots", "Mage Boots", "Assassin Boots", "Dragon Boots", "Titan Boots", "Divine Boots",
  // Shields
  "Wooden Shield", "Round Shield", "Iron Shield", "Steel Shield", "Tower Shield", "Kite Shield", "Dragon Shield", "Crystal Shield", "Holy Shield", "Titan Shield", "Divine Shield",
  // Cloaks
  "Traveler's Cloak", "Hunter Cloak", "Mage Cloak", "Royal Cape", "Shadow Cloak", "Phoenix Cloak", "Dragon Cloak", "Divine Mantle",
  // Belts
  "Rope Belt", "Leather Belt", "Warrior Belt", "Hunter Belt", "Mage Belt", "Dragon Belt", "Titan Belt", "Divine Belt"
];

export const ACCESSORY_BASES = [
  // Rings
  "Copper Ring", "Silver Ring", "Gold Ring", "Ruby Ring", "Sapphire Ring", "Emerald Ring", "Diamond Ring", "Ring of Strength", "Ring of Wisdom", "Ring of Fortune", "Ring of Vitality", "Ring of Agility", "Ring of the Phoenix", "Ring of Eternity",
  // Necklaces
  "Copper Necklace", "Silver Necklace", "Golden Necklace", "Ruby Pendant", "Sapphire Pendant", "Emerald Pendant", "Dragon Necklace", "Phoenix Pendant", "Shadow Amulet", "Holy Amulet", "Divine Necklace"
];

export const CLASS_SETS_BASES = [
  // Warrior Set
  "Warrior Helm", "Warrior Armor", "Warrior Gauntlets", "Warrior Boots",
  // Knight Set
  "Knight Helm", "Knight Plate", "Knight Gloves", "Knight Boots",
  // Paladin Set
  "Paladin Crown", "Paladin Armor", "Paladin Gloves", "Paladin Boots",
  // Rogue Set
  "Rogue Hood", "Rogue Vest", "Rogue Gloves", "Rogue Boots",
  // Assassin Set
  "Assassin Hood", "Assassin Armor", "Assassin Gloves", "Assassin Boots",
  // Ranger Set
  "Ranger Hood", "Ranger Tunic", "Ranger Gloves", "Ranger Boots",
  // Mage Set
  "Mage Hood", "Mage Robe", "Mage Gloves", "Mage Boots",
  // Archmage Set
  "Archmage Hood", "Archmage Robe", "Archmage Gloves", "Archmage Boots"
];

export const BOSS_EQUIPMENT = [
  { name: "Dragon King's Greatsword", type: "Weapon", stats: { attack: 180, speed: 10 } },
  { name: "Ancient Titan Hammer", type: "Weapon", stats: { attack: 220, defense: 25 } },
  { name: "Leviathan Trident", type: "Weapon", stats: { attack: 170, speed: 12 } },
  { name: "Phoenix Feather Bow", type: "Weapon", stats: { attack: 160, crit: 20 } },
  { name: "Frost Dragon Spear", type: "Weapon", stats: { attack: 175, speed: 8 } },
  { name: "Infernal War Axe", type: "Weapon", stats: { attack: 195, crit: 12 } },
  { name: "Kraken Shield", type: "Armor", stats: { defense: 140, health: 350 } },
  { name: "World Tree Staff", type: "Weapon", stats: { attack: 210, health: 400 } },
  { name: "Shadow Lord Daggers", type: "Weapon", stats: { attack: 140, speed: 25 } },
  { name: "Celestial Crown", type: "Armor", stats: { defense: 80, health: 250 } },
  { name: "Titan Plate Armor", type: "Armor", stats: { defense: 250, health: 700 } },
  { name: "Lich King's Robes", type: "Armor", stats: { defense: 110, health: 450 } },
  { name: "Demon Lord's Blade", type: "Weapon", stats: { attack: 200, crit: 15 } },
  { name: "Guardian's Bulwark", type: "Armor", stats: { defense: 160, health: 400 } },
  { name: "Astral Scythe", type: "Weapon", stats: { attack: 215, crit: 25 } },
  { name: "Eclipse Blade", type: "Weapon", stats: { attack: 190, speed: 15 } },
  { name: "Void Staff", type: "Weapon", stats: { attack: 205, health: 300 } },
  { name: "Worldbreaker Hammer", type: "Weapon", stats: { attack: 240, defense: 20 } },
  { name: "Genesis Shield", type: "Armor", stats: { defense: 150, health: 500 } },
  { name: "Crown of Creation", type: "Armor", stats: { defense: 100, health: 600 } }
];

export const MATERIALS_DATABASE = [
  { name: 'Wood Log', type: 'Material', rarity: 'Common', value: 10 },
  { name: 'Stone', type: 'Material', rarity: 'Common', value: 5 },
  { name: 'Iron Ore', type: 'Material', rarity: 'Common', value: 10 },
  { name: 'Copper Ore', type: 'Material', rarity: 'Common', value: 8 },
  { name: 'Coal', type: 'Material', rarity: 'Common', value: 8 },
  { name: 'Plant Fiber', type: 'Material', rarity: 'Common', value: 4 },
  { name: 'Leather Scraps', type: 'Material', rarity: 'Common', value: 8 },
  { name: 'Animal Hide', type: 'Material', rarity: 'Common', value: 12 },
  { name: 'Bones', type: 'Material', rarity: 'Common', value: 6 },
  { name: 'Feathers', type: 'Material', rarity: 'Common', value: 5 },
  { name: 'Mushrooms', type: 'Material', rarity: 'Common', value: 12 },
  { name: 'Herbs', type: 'Material', rarity: 'Common', value: 10 },
  { name: 'Flowers', type: 'Material', rarity: 'Common', value: 8 },
  { name: 'Clay', type: 'Material', rarity: 'Common', value: 6 },
  { name: 'Silver Ore', type: 'Material', rarity: 'Uncommon', value: 25 },
  { name: 'Glow Herbs', type: 'Material', rarity: 'Uncommon', value: 20 },
  { name: 'Raw Salmon', type: 'Material', rarity: 'Uncommon', value: 15 },
  { name: 'Gold Ore', type: 'Material', rarity: 'Rare', value: 100 },
  { name: 'Mana Shard', type: 'Material', rarity: 'Rare', value: 90 },
  { name: 'Dreadwood Log', type: 'Material', rarity: 'Rare', value: 120 },
  { name: 'Dragon Scale Shard', type: 'Material', rarity: 'Epic', value: 400 },
  { name: 'Obsidian Ore', type: 'Material', rarity: 'Epic', value: 350 },
  { name: 'Cosmic Core', type: 'Material', rarity: 'Legendary', value: 1500 }
];

export const CONSUMABLES_DATABASE = [
  { name: 'Health Potion', type: 'Consumable', rarity: 'Common', value: 15 },
  { name: 'Greater HP Potion', type: 'Consumable', rarity: 'Uncommon', value: 40 },
  { name: 'Elixir of Life', type: 'Consumable', rarity: 'Rare', value: 150 },
  { name: 'Energy Potion', type: 'Consumable', rarity: 'Common', value: 20 },
  { name: 'Stamina Tonic', type: 'Consumable', rarity: 'Common', value: 20 }
];

export const generateRandomItem = (customRarity?: ItemRarity): Item => {
  let selectedRarity: ItemRarity = 'Common';
  
  if (customRarity) {
    selectedRarity = customRarity;
  } else {
    const roll = Math.random();
    if (roll < 0.001) selectedRarity = 'Divine';
    else if (roll < 0.005) selectedRarity = 'Mythic';
    else if (roll < 0.015) selectedRarity = 'Legendary';
    else if (roll < 0.05) selectedRarity = 'Epic';
    else if (roll < 0.15) selectedRarity = 'Rare';
    else if (roll < 0.40) selectedRarity = 'Uncommon';
    else selectedRarity = 'Common';
  }

  // 12% chance for Mythic/Divine to roll a unique Boss Equipment drop!
  if ((selectedRarity === 'Divine' || selectedRarity === 'Mythic') && Math.random() < 0.35) {
    const bossItem = BOSS_EQUIPMENT[Math.floor(Math.random() * BOSS_EQUIPMENT.length)];
    return {
      id: Math.random().toString(36).substring(2, 9),
      name: bossItem.name,
      type: bossItem.type as ItemType,
      rarity: selectedRarity,
      value: selectedRarity === 'Divine' ? 3500 : 1200,
      equipped: false,
      quantity: 1,
      stats: bossItem.stats
    };
  }

  // Suffix tier multiplier
  const multipliers: Record<ItemRarity, number> = {
    Common: 1,
    Uncommon: 2,
    Rare: 4,
    Epic: 7,
    Legendary: 12,
    Mythic: 22,
    Divine: 45
  };

  const prefixes: Record<ItemRarity, string> = {
    Common: "Worn",
    Uncommon: "Fine",
    Rare: "Tempered",
    Epic: "Runed",
    Legendary: "Master's",
    Mythic: "Eternal",
    Divine: "Divine"
  };

  const typeRoll = Math.random();
  const mult = multipliers[selectedRarity];
  const prefix = prefixes[selectedRarity];

  if (typeRoll < 0.45) {
    // Weapon Base
    const baseName = WEAPON_BASES[Math.floor(Math.random() * WEAPON_BASES.length)];
    const name = `${prefix} ${baseName}`;

    // Base damage scaling based on weight keywords
    let baseAtk = 8;
    if (baseName.includes("Greatsword") || baseName.includes("Hammer") || baseName.includes("Scythe")) {
      baseAtk = 15;
    } else if (baseName.includes("Dagger") || baseName.includes("Knife")) {
      baseAtk = 5;
    }

    const attack = Math.round(baseAtk * mult * (0.9 + Math.random() * 0.2));

    return {
      id: Math.random().toString(36).substring(2, 9),
      name,
      type: 'Weapon',
      rarity: selectedRarity,
      value: Math.round(25 * mult * (0.9 + Math.random() * 0.2)),
      equipped: false,
      quantity: 1,
      stats: { attack }
    };

  } else if (typeRoll < 0.80) {
    // Armor Base (either class set piece or standard armor pieces)
    let baseName = '';
    if (Math.random() < 0.35) {
      baseName = CLASS_SETS_BASES[Math.floor(Math.random() * CLASS_SETS_BASES.length)];
    } else {
      baseName = ARMOR_BASES[Math.floor(Math.random() * ARMOR_BASES.length)];
    }
    const name = `${prefix} ${baseName}`;

    let baseDef = 4;
    if (baseName.includes("Chestplate") || baseName.includes("Plate") || baseName.includes("Shield") || baseName.includes("Bulwark")) {
      baseDef = 10;
    } else if (baseName.includes("Gauntlets") || baseName.includes("Boots") || baseName.includes("Cloak")) {
      baseDef = 3;
    }

    const defense = Math.round(baseDef * mult * (0.9 + Math.random() * 0.2));
    const health = defense * 4;

    return {
      id: Math.random().toString(36).substring(2, 9),
      name,
      type: 'Armor',
      rarity: selectedRarity,
      value: Math.round(18 * mult * (0.9 + Math.random() * 0.2)),
      equipped: false,
      quantity: 1,
      stats: { defense, health }
    };

  } else if (typeRoll < 0.92) {
    // Accessory Base (Rings / Necklaces)
    const baseName = ACCESSORY_BASES[Math.floor(Math.random() * ACCESSORY_BASES.length)];
    const name = `${prefix} ${baseName}`;

    const baseStat = baseName.includes("Ring") ? 3 : 5;
    const health = Math.round(baseStat * 5 * mult * (0.9 + Math.random() * 0.2));
    const attack = Math.round(baseStat * 0.6 * mult * (0.9 + Math.random() * 0.2));

    return {
      id: Math.random().toString(36).substring(2, 9),
      name,
      type: 'Accessory',
      rarity: selectedRarity,
      value: Math.round(30 * mult * (0.9 + Math.random() * 0.2)),
      equipped: false,
      quantity: 1,
      stats: { health, attack }
    };

  } else {
    // Consumable or raw gathering material drop
    if (Math.random() < 0.5) {
      const baseItem = CONSUMABLES_DATABASE[Math.floor(Math.random() * CONSUMABLES_DATABASE.length)];
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: baseItem.name,
        type: baseItem.type as ItemType,
        rarity: baseItem.rarity as ItemRarity,
        value: baseItem.value,
        equipped: false,
        quantity: 1
      };
    } else {
      const baseItem = MATERIALS_DATABASE[Math.floor(Math.random() * MATERIALS_DATABASE.length)];
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: baseItem.name,
        type: baseItem.type as ItemType,
        rarity: baseItem.rarity as ItemRarity,
        value: baseItem.value,
        equipped: false,
        quantity: 1
      };
    }
  }
};

export interface CraftingRecipe {
  resultName: string;
  resultRarity: ItemRarity;
  resultType: ItemType;
  levelRequired: number;
  profession: 'blacksmithing';
  materials: { name: string; quantity: number }[];
  rewardXp: number;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    resultName: 'Iron Sword',
    resultRarity: 'Common',
    resultType: 'Weapon',
    levelRequired: 1,
    profession: 'blacksmithing',
    materials: [
      { name: 'Iron Ore', quantity: 3 },
      { name: 'Wood Log', quantity: 1 }
    ],
    rewardXp: 20,
  },
  {
    resultName: 'Steel Claymore',
    resultRarity: 'Rare',
    resultType: 'Weapon',
    levelRequired: 3,
    profession: 'blacksmithing',
    materials: [
      { name: 'Iron Ore', quantity: 8 },
      { name: 'Mana Shard', quantity: 2 }
    ],
    rewardXp: 60,
  },
  {
    resultName: 'Steel Plate Chestplate',
    resultRarity: 'Rare',
    resultType: 'Armor',
    levelRequired: 4,
    profession: 'blacksmithing',
    materials: [
      { name: 'Iron Ore', quantity: 12 },
      { name: 'Silver Ore', quantity: 4 }
    ],
    rewardXp: 80,
  },
  {
    resultName: 'Dragon Scale Armor',
    resultRarity: 'Legendary',
    resultType: 'Armor',
    levelRequired: 7,
    profession: 'blacksmithing',
    materials: [
      { name: 'Dragon Scale Shard', quantity: 3 },
      { name: 'Obsidian Ore', quantity: 5 },
      { name: 'Gold Ore', quantity: 2 }
    ],
    rewardXp: 300,
  },
];
