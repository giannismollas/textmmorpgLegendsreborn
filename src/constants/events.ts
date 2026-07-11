import { AdventureEvent, MonsterData, GatheringNodeData, Item } from '../types';
import { generateRandomItem } from './items';

const MONSTERS: MonsterData[] = [
  { name: 'Forest Slime', hp: 30, max_hp: 30, attack: 3, xpReward: 10, goldReward: 5, lootChance: 0.2 },
  { name: 'Wild Goblin', hp: 45, max_hp: 45, attack: 5, xpReward: 15, goldReward: 12, lootChance: 0.3 },
  { name: 'Rabid Wolf', hp: 55, max_hp: 55, attack: 7, xpReward: 18, goldReward: 8, lootChance: 0.25 },
  { name: 'Greenwood Spider', hp: 40, max_hp: 40, attack: 6, xpReward: 14, goldReward: 10, lootChance: 0.35 },
  { name: 'Bandit Scout', hp: 70, max_hp: 70, attack: 9, xpReward: 25, goldReward: 30, lootChance: 0.5 },
  { name: 'Skeleton Warrior', hp: 90, max_hp: 90, attack: 12, xpReward: 35, goldReward: 18, lootChance: 0.4 },
  { name: 'Forest Orc', hp: 120, max_hp: 120, attack: 15, xpReward: 50, goldReward: 40, lootChance: 0.45 },
  { name: 'Dark Cultist', hp: 110, max_hp: 110, attack: 18, xpReward: 60, goldReward: 55, lootChance: 0.5 },
];

const GATHERING_NODES: GatheringNodeData[] = [
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

const BOSSES: MonsterData[] = [
  { name: 'Forest Guardian', hp: 350, max_hp: 350, attack: 28, xpReward: 250, goldReward: 200, lootChance: 0.8 },
  { name: 'Grave Lord', hp: 500, max_hp: 500, attack: 35, xpReward: 450, goldReward: 350, lootChance: 0.9 },
  { name: 'Ancient Dragon', hp: 1200, max_hp: 1200, attack: 75, xpReward: 1500, goldReward: 1200, lootChance: 1.0 },
  { name: 'Lich King', hp: 2000, max_hp: 2000, attack: 110, xpReward: 3000, goldReward: 2500, lootChance: 1.0 },
];

const QUESTS_LIST = [
  { quest_id: 'goblin_threat', name: 'Goblin Threat', description: 'Defeat 5 goblins causing trouble in the outskirts.', target: 5, reward_gold: 150, reward_xp: 200 },
  { quest_id: 'mining_materials', name: 'Iron Gathering', description: 'Mine 5 pieces of Iron Ore for the local blacksmith.', target: 5, reward_gold: 120, reward_xp: 150 },
  { quest_id: 'defeat_guardian', name: 'Bounty: Forest Guardian', description: 'Defeat the Forest Guardian threatening Greenwood Forest.', target: 1, reward_gold: 850, reward_xp: 1000 },
  { quest_id: 'fish_supply', name: 'Fisherman Supply', description: 'Fish 5 Raw Fish for the tavern chef.', target: 5, reward_gold: 80, reward_xp: 100 },
];

const REGIONS = [
  'Greenwood Forest',
  'Whispering Caves',
  'Cursed Graveyard',
  'Dragon peaks',
  'Void Citadel'
];

export const getRegionForLevel = (level: number): string => {
  if (level < 5) return REGIONS[0];
  if (level < 10) return REGIONS[1];
  if (level < 20) return REGIONS[2];
  if (level < 35) return REGIONS[3];
  return REGIONS[4];
};

export const generateRandomEvent = (playerLevel: number): AdventureEvent => {
  const roll = Math.random();
  
  // Weightings:
  // Monster Fight (Monster): 40% (roll < 0.40)
  // Gathering: 15% (0.40 <= roll < 0.55)
  // Treasure: 15% (0.55 <= roll < 0.70)
  // Nothing / Safe Travel: 10% (0.70 <= roll < 0.80)
  // Merchant: 10% (0.80 <= roll < 0.90)
  // NPC Quest: 5% (0.90 <= roll < 0.95)
  // Boss: 3% (0.95 <= roll < 0.98)
  // Dungeon Gate: 2% (0.98 <= roll <= 1.0)
  
  const region = getRegionForLevel(playerLevel);

  if (roll < 0.40) {
    // Monster Event
    // Scale monster based on player level
    const baseMonster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
    const scalingFactor = 1 + (playerLevel - 1) * 0.15;
    
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
      description: `A hostile ${monster.name} leaps from the shadows of ${region}!`,
      monster
    };
  } 
  else if (roll < 0.55) {
    // Gathering Event
    const node = GATHERING_NODES[Math.floor(Math.random() * GATHERING_NODES.length)];
    return {
      type: 'Gathering',
      title: `${node.name} Discovered`,
      description: `You spot a rich ${node.name} ripe for harvesting.`,
      gathering: node
    };
  } 
  else if (roll < 0.70) {
    // Treasure Chest
    const goldFound = Math.round(50 + playerLevel * 15 * (0.8 + Math.random() * 0.4));
    const itemsRoll = Math.random();
    let lootItem: Item | undefined;
    
    // 40% chance of item in treasure chest
    if (itemsRoll < 0.4) {
      lootItem = generateRandomItem();
    }

    return {
      type: 'Treasure',
      title: 'Hidden Chest Found',
      description: `You discover a dust-covered chest tucked away in the brush of ${region}.`,
      chestLoot: {
        gold: goldFound,
        item: lootItem
      }
    };
  } 
  else if (roll < 0.80) {
    // Nothing
    const safeXP = Math.round(playerLevel * 3);
    const safeGold = Math.round(playerLevel * 2);
    
    const messages = [
      'You travel along a peaceful pathway, enjoying the rustle of leaves.',
      'The road ahead is clear. You find a moment to catch your breath.',
      'You bypass a sleeping beast quietly and continue on your way.',
      'A traveler greets you warmly and shares a sip of spring water.',
    ];
    
    return {
      type: 'Nothing',
      title: 'Travel Safely',
      description: messages[Math.floor(Math.random() * messages.length)] + ` You gain minor experience (+${safeXP} XP) and a few coins (+${safeGold} Gold).`,
      chestLoot: {
        gold: safeGold,
        item: undefined // We'll handle adding this minor XP and gold inside the event completion logic
      }
    };
  } 
  else if (roll < 0.90) {
    // Merchant Event
    // Generate 3 random items the player could buy
    const merchantItems: Item[] = [
      generateRandomItem('Common'),
      generateRandomItem('Uncommon'),
      generateRandomItem('Rare')
    ];
    
    // Mark value up slightly for the merchant
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
  else if (roll < 0.95) {
    // NPC Quest Giver
    const questData = QUESTS_LIST[Math.floor(Math.random() * QUESTS_LIST.length)];
    return {
      type: 'NPC',
      title: 'Mysterious Stranger',
      description: `An NPC flags you down. "Traveler, I need your assistance. ${questData.description}"`,
      quest: questData
    };
  } 
  else if (roll < 0.98) {
    // Boss Battle
    // Choose boss appropriate to player level range
    let baseBoss = BOSSES[0];
    if (playerLevel >= 30) baseBoss = BOSSES[3];
    else if (playerLevel >= 20) baseBoss = BOSSES[2];
    else if (playerLevel >= 10) baseBoss = BOSSES[1];

    const scalingFactor = 1 + (playerLevel - (playerLevel >= 30 ? 30 : playerLevel >= 20 ? 20 : playerLevel >= 10 ? 10 : 1)) * 0.1;
    const boss: MonsterData = {
      name: baseBoss.name,
      hp: Math.round(baseBoss.hp * scalingFactor),
      max_hp: Math.round(baseBoss.max_hp * scalingFactor),
      attack: Math.round(baseBoss.attack * scalingFactor),
      xpReward: Math.round(baseBoss.xpReward * scalingFactor),
      goldReward: Math.round(baseBoss.goldReward * scalingFactor),
      lootChance: 1.0 // Bosses always drop loot!
    };

    return {
      type: 'Boss',
      title: `BOSS BATTLE: ${boss.name}!`,
      description: `The air grows cold. The ground shakes. The mighty ${boss.name} appears!`,
      monster: boss
    };
  } 
  else {
    // Dungeon Gate
    const dungeonMonstersCount = 3;
    const scalingFactor = 1 + (playerLevel - 1) * 0.12;
    
    // We'll create a mini-monster for the dungeon gates
    const monster: MonsterData = {
      name: 'Dungeon Sentinel',
      hp: Math.round(70 * scalingFactor),
      max_hp: Math.round(70 * scalingFactor),
      attack: Math.round(10 * scalingFactor),
      xpReward: Math.round(40 * scalingFactor),
      goldReward: Math.round(35 * scalingFactor),
      lootChance: 0.6
    };

    return {
      type: 'Dungeon',
      title: 'Dungeon Entrance Found',
      description: 'You stand before a heavy stone door engraved with ruins. A glowing portal beckons. Inside lie 3 sequential battles with Sentinels!',
      monster
    };
  }
};
export { MONSTERS, BOSSES };
