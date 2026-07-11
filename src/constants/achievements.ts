export interface Achievement {
  id: string;
  name: string;
  description: string;
  diamondReward: number;
  goldReward: number;
  conditionDescription: string;
}

export const ACHIEVEMENTS_DATABASE: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Level up your character for the first time.',
    diamondReward: 10,
    goldReward: 50,
    conditionDescription: 'Reach Level 2'
  },
  {
    id: 'champion_training',
    name: 'Champion in Training',
    description: 'Reach Level 10 to unlock dangerous regions.',
    diamondReward: 50,
    goldReward: 500,
    conditionDescription: 'Reach Level 10'
  },
  {
    id: 'first_blood',
    name: 'Gladiator Born',
    description: 'Win your first battle in the PvP Arena.',
    diamondReward: 25,
    goldReward: 250,
    conditionDescription: 'Win 1 PvP Fight'
  },
  {
    id: 'pvp_warlord',
    name: 'PvP Warlord',
    description: 'Establish dominance by winning 10 PvP battles.',
    diamondReward: 100,
    goldReward: 1500,
    conditionDescription: 'Win 10 PvP Fights'
  },
  {
    id: 'novice_gatherer',
    name: 'Resource Harvester',
    description: 'Gather 10 items from exploration nodes.',
    diamondReward: 15,
    goldReward: 100,
    conditionDescription: 'Gather 10 raw materials'
  },
  {
    id: 'master_crafter',
    name: 'Forge Master',
    description: 'Craft 5 items at the Blacksmith forge.',
    diamondReward: 30,
    goldReward: 300,
    conditionDescription: 'Craft 5 weapons or armors'
  },
  {
    id: 'gold_hoarder',
    name: 'Gold Hoarder',
    description: 'Store up a small fortune of gold coins.',
    diamondReward: 20,
    goldReward: 0,
    conditionDescription: 'Possess 1,000 Gold'
  },
  {
    id: 'dragon_striker',
    name: 'Giant Slayer',
    description: 'Contribute a significant amount of damage to the World Boss.',
    diamondReward: 50,
    goldReward: 1000,
    conditionDescription: 'Deal 10,000 total boss damage'
  }
];
