export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Divine';
export type ItemType = 'Weapon' | 'Armor' | 'Accessory' | 'Consumable' | 'Material' | 'Quest Item';

export interface ItemStats {
  attack?: number;
  defense?: number;
  health?: number;
  speed?: number;
  crit?: number;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  value: number;
  equipped?: boolean;
  quantity?: number;
  stats?: ItemStats;
}

export interface PlayerProfessions {
  mining: { level: number; xp: number; max_xp: number };
  blacksmithing: { level: number; xp: number; max_xp: number };
  herbalism: { level: number; xp: number; max_xp: number };
  fishing: { level: number; xp: number; max_xp: number };
  woodcutting: { level: number; xp: number; max_xp: number };
  skinning: { level: number; xp: number; max_xp: number };
  foraging: { level: number; xp: number; max_xp: number };
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  class: 'Warrior' | 'Mage' | 'Rogue' | 'Ranger';
  level: number;
  hp: number;
  max_hp: number;
  energy: number;
  max_energy: number;
  stamina: number;
  max_stamina: number;
  gold: number;
  diamonds: number;
  xp: number;
  max_xp: number;
  stat_points: number;
  strength: number;
  defense: number;
  speed: number;
  vitality: number;
  daily_streak: number;
  last_daily_claim: string; // ISO date string YYYY-MM-DD
  achievements: string[];   // Array of unlocked achievement IDs
  total_kills: number;
  total_crafts: number;
  pvp_wins: number;
  professions: PlayerProfessions;
  party_id?: string;
  party_ready?: boolean;
  active_region?: string;
  group_dungeon_finish_time?: number;
  group_dungeon_region?: string;
}

export interface Quest {
  id: string;
  quest_id: string;
  name: string;
  progress: number;
  target: number;
  reward_xp: number;
  reward_gold: number;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  player_name: string;
  message: string;
  created_at: string;
  isSystem?: boolean;
}

export interface MarketListing {
  id: string;
  seller_id: string;
  seller_name: string;
  item_name: string;
  item_type: ItemType;
  item_rarity: ItemRarity;
  item_value: number;
  price: number;
  quantity: number;
  stats?: ItemStats;
  created_at: string;
}

export type AdventureEventType =
  | 'Monster'
  | 'Treasure'
  | 'Merchant'
  | 'NPC'
  | 'Gathering'
  | 'Boss'
  | 'Dungeon'
  | 'Nothing';

export interface MonsterData {
  name: string;
  hp: number;
  max_hp: number;
  attack: number;
  xpReward: number;
  goldReward: number;
  lootChance: number; // 0 to 1
}

export interface GatheringNodeData {
  name: string;
  profession: 'mining' | 'herbalism' | 'fishing' | 'skinning' | 'foraging' | 'woodcutting';
  requiredLevel: number;
  xpReward: number;
  materialName: string;
}

export interface AdventureEvent {
  type: AdventureEventType;
  title: string;
  description: string;
  monster?: MonsterData;
  monster_hp?: number;
  combat_logs?: string[];
  gathering?: GatheringNodeData;
  merchantItems?: Item[];
  quest?: {
    quest_id: string;
    name: string;
    description: string;
    target: number;
    reward_gold: number;
    reward_xp: number;
  };
  chestLoot?: {
    gold: number;
    item?: Item;
    xp?: number;
  };
}

export interface Job {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  goldReward: number;
  xpReward: number;
  levelRequired: number;
}
export interface PartyMember {
  id: string;
  name: string;
  class: 'Warrior' | 'Mage' | 'Rogue' | 'Ranger';
  level: number;
  hp: number;
  max_hp: number;
  ready: boolean;
}

export interface Party {
  id: string;
  leader_id: string;
  leader_name: string;
  status: 'lobby' | 'adventuring';
  members: PartyMember[];
  current_event?: AdventureEvent & {
    monster_hp?: number;
    combat_logs?: string[];
  };
}

export interface PartyInvite {
  id: string;
  sender_name: string;
  party_id: string;
}
