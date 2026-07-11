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

export const ITEMS_DATABASE: Omit<Item, 'id'>[] = [
  // Weapons
  { name: 'Rusty Dagger', type: 'Weapon', rarity: 'Common', value: 15, stats: { attack: 2 } },
  { name: 'Iron Sword', type: 'Weapon', rarity: 'Common', value: 40, stats: { attack: 5 } },
  { name: 'Wooden Staff', type: 'Weapon', rarity: 'Common', value: 25, stats: { attack: 3 } },
  { name: 'Hunter Bow', type: 'Weapon', rarity: 'Common', value: 30, stats: { attack: 4 } },
  
  { name: 'Goblin Dagger', type: 'Weapon', rarity: 'Uncommon', value: 90, stats: { attack: 8, speed: 2 } },
  { name: 'Apprentice Staff', type: 'Weapon', rarity: 'Uncommon', value: 110, stats: { attack: 10 } },
  { name: 'Oak Longbow', type: 'Weapon', rarity: 'Uncommon', value: 95, stats: { attack: 9, crit: 2 } },
  
  { name: 'Shadow Dagger', type: 'Weapon', rarity: 'Rare', value: 350, stats: { attack: 15, speed: 5, crit: 4 } },
  { name: 'Sorcerer Wand', type: 'Weapon', rarity: 'Rare', value: 380, stats: { attack: 20, health: -10 } },
  { name: 'Steel Claymore', type: 'Weapon', rarity: 'Rare', value: 400, stats: { attack: 22, defense: 4 } },
  
  { name: 'Abyssal Blade', type: 'Weapon', rarity: 'Epic', value: 1200, stats: { attack: 45, crit: 8 } },
  { name: 'Archmage Staff', type: 'Weapon', rarity: 'Epic', value: 1350, stats: { attack: 52, health: 30 } },
  
  { name: 'Dragon Slayer Greatsword', type: 'Weapon', rarity: 'Legendary', value: 4500, stats: { attack: 110, defense: 15 } },
  { name: 'Windrunner Bow', type: 'Weapon', rarity: 'Legendary', value: 4200, stats: { attack: 95, speed: 20, crit: 15 } },
  
  { name: 'Mythril Doomhammer', type: 'Weapon', rarity: 'Mythic', value: 12000, stats: { attack: 250, defense: 30, crit: 20 } },
  { name: 'Staff of the Cosmos', type: 'Weapon', rarity: 'Mythic', value: 15000, stats: { attack: 300, health: 150 } },
  
  { name: 'Excalibur', type: 'Weapon', rarity: 'Divine', value: 50000, stats: { attack: 650, defense: 80, health: 300, crit: 25, speed: 25 } },

  // Armor
  { name: 'Ragged Cloak', type: 'Armor', rarity: 'Common', value: 12, stats: { defense: 1 } },
  { name: 'Leather Boots', type: 'Armor', rarity: 'Common', value: 25, stats: { defense: 2 } },
  { name: 'Rusty Chainmail', type: 'Armor', rarity: 'Common', value: 45, stats: { defense: 4 } },
  
  { name: 'Reinforced Leather Vest', type: 'Armor', rarity: 'Uncommon', value: 85, stats: { defense: 7 } },
  { name: 'Mage Robes', type: 'Armor', rarity: 'Uncommon', value: 100, stats: { defense: 5, health: 15 } },
  
  { name: 'Steel Plate Chestplate', type: 'Armor', rarity: 'Rare', value: 380, stats: { defense: 18, health: 40 } },
  { name: 'Ranger Tunic', type: 'Armor', rarity: 'Rare', value: 340, stats: { defense: 14, speed: 6 } },
  
  { name: 'Demon Shell Chest', type: 'Armor', rarity: 'Epic', value: 1250, stats: { defense: 38, attack: 10 } },
  { name: 'Ethereal Robes', type: 'Armor', rarity: 'Epic', value: 1100, stats: { defense: 28, speed: 12, health: 70 } },
  
  { name: 'Dragon Scale Armor', type: 'Armor', rarity: 'Legendary', value: 4600, stats: { defense: 85, health: 200 } },
  
  { name: 'Titan Armor of Eternity', type: 'Armor', rarity: 'Mythic', value: 14000, stats: { defense: 220, health: 600 } },
  
  { name: 'Aegis of the Heavens', type: 'Armor', rarity: 'Divine', value: 55000, stats: { defense: 550, health: 1500, speed: 40 } },

  // Accessories
  { name: 'Copper Ring', type: 'Accessory', rarity: 'Common', value: 20, stats: { health: 5 } },
  { name: 'Silver Amulet', type: 'Accessory', rarity: 'Uncommon', value: 75, stats: { attack: 2 } },
  { name: 'Jade Necklace', type: 'Accessory', rarity: 'Rare', value: 280, stats: { defense: 5, health: 25 } },
  { name: 'Ring of Power', type: 'Accessory', rarity: 'Epic', value: 1000, stats: { attack: 15, crit: 5 } },
  { name: 'Phoenix Pendant', type: 'Accessory', rarity: 'Legendary', value: 3900, stats: { health: 120, attack: 30 } },
  
  // Consumables
  { name: 'Health Potion', type: 'Consumable', rarity: 'Common', value: 15 },
  { name: 'Greater HP Potion', type: 'Consumable', rarity: 'Uncommon', value: 40 },
  { name: 'Elixir of Life', type: 'Consumable', rarity: 'Rare', value: 150 },
  
  { name: 'Energy Potion', type: 'Consumable', rarity: 'Common', value: 20 },
  { name: 'Stamina Tonic', type: 'Consumable', rarity: 'Common', value: 20 },

  // Materials
  { name: 'Iron Ore', type: 'Material', rarity: 'Common', value: 10 },
  { name: 'Copper Ore', type: 'Material', rarity: 'Common', value: 5 },
  { name: 'Wolf Fur', type: 'Material', rarity: 'Common', value: 8 },
  { name: 'Oak Branch', type: 'Material', rarity: 'Common', value: 4 },
  
  { name: 'Silver Ore', type: 'Material', rarity: 'Uncommon', value: 25 },
  { name: 'Glow Herbs', type: 'Material', rarity: 'Uncommon', value: 20 },
  { name: 'Raw Salmon', type: 'Material', rarity: 'Uncommon', value: 15 },
  
  { name: 'Gold Ore', type: 'Material', rarity: 'Rare', value: 100 },
  { name: 'Mana Shard', type: 'Material', rarity: 'Rare', value: 90 },
  { name: 'Dreadwood Log', type: 'Material', rarity: 'Rare', value: 120 },
  
  { name: 'Dragon Scale Shard', type: 'Material', rarity: 'Epic', value: 400 },
  { name: 'Obsidian Ore', type: 'Material', rarity: 'Epic', value: 350 },
  
  { name: 'Cosmic Core', type: 'Material', rarity: 'Legendary', value: 1500 },
  
  // Quest Items
  { name: 'Goblin Ear', type: 'Quest Item', rarity: 'Common', value: 5 },
  { name: 'Lost Necklace', type: 'Quest Item', rarity: 'Uncommon', value: 20 },
  { name: 'Forest Guardian Heart', type: 'Quest Item', rarity: 'Rare', value: 150 },
  { name: 'Dragon Tooth', type: 'Quest Item', rarity: 'Epic', value: 500 },
];

export const generateRandomItem = (customRarity?: ItemRarity): Item => {
  let selectedRarity: ItemRarity = 'Common';
  
  if (customRarity) {
    selectedRarity = customRarity;
  } else {
    const roll = Math.random();
    let cumulative = 0;
    
    // Sort rarities descending to check probabilities correctly
    // Rarity drop rates: Common (60%), Uncommon (25%), Rare (10%), Epic (3.5%), Legendary (1%), Mythic (0.4%), Divine (0.1%)
    // Let's implement it exactly by sorting RARITIES
    const sortedRarities = [...RARITIES].sort((a, b) => b.chance - a.chance); // Wait, or we roll from cumulative sum
    // Let's roll step by step:
    // Divine (0.1%), Mythic (0.4%), Legendary (1%), Epic (3.5%), Rare (10%), Uncommon (25%), Common (60%)
    if (roll < 0.001) selectedRarity = 'Divine';
    else if (roll < 0.005) selectedRarity = 'Mythic';
    else if (roll < 0.015) selectedRarity = 'Legendary';
    else if (roll < 0.05) selectedRarity = 'Epic';
    else if (roll < 0.15) selectedRarity = 'Rare';
    else if (roll < 0.40) selectedRarity = 'Uncommon';
    else selectedRarity = 'Common';
  }

  // Filter db items by rarity
  let options = ITEMS_DATABASE.filter(i => i.rarity === selectedRarity);
  if (options.length === 0) {
    options = ITEMS_DATABASE.filter(i => i.rarity === 'Common'); // Fallback
  }

  const baseItem = options[Math.floor(Math.random() * options.length)];
  
  // Generate random stats modifications for weapons/armor to make loot interesting
  let dynamicStats = baseItem.stats ? { ...baseItem.stats } : undefined;
  if (dynamicStats && baseItem.rarity !== 'Common') {
    // scale stats slightly based on rarity
    const multiplier = 
      baseItem.rarity === 'Uncommon' ? 1.1 :
      baseItem.rarity === 'Rare' ? 1.3 :
      baseItem.rarity === 'Epic' ? 1.6 :
      baseItem.rarity === 'Legendary' ? 2.0 :
      baseItem.rarity === 'Mythic' ? 3.0 : 5.0; // Divine
      
    Object.keys(dynamicStats).forEach(key => {
      const k = key as keyof ItemStats;
      if (dynamicStats![k] !== undefined) {
        dynamicStats![k] = Math.max(1, Math.round(dynamicStats![k]! * (0.9 + Math.random() * 0.2) * multiplier));
      }
    });
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    name: baseItem.name,
    type: baseItem.type,
    rarity: baseItem.rarity,
    value: Math.round(baseItem.value * (0.9 + Math.random() * 0.2)), // +- 10% value
    equipped: false,
    quantity: 1,
    stats: dynamicStats,
  };
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
      { name: 'Oak Branch', quantity: 1 }
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
