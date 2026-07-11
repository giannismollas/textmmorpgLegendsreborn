import { Job } from '../types';

export const JOBS_DATABASE: Job[] = [
  {
    id: 'job_sentry_test',
    name: 'Town gate watch (Test)',
    description: 'Guard the gates of Greenwood. Quick training watch.',
    durationSeconds: 15,
    goldReward: 15,
    xpReward: 10,
    levelRequired: 1
  },
  {
    id: 'job_woodcutter',
    name: 'Help the Woodcutter',
    description: 'Chop down dreadwood branches in the outskirt forest.',
    durationSeconds: 120, // 2 minutes
    goldReward: 60,
    xpReward: 90,
    levelRequired: 1
  },
  {
    id: 'job_library',
    name: 'Library assistant',
    description: 'Organize ancient scrolls and records in the Town Citadel.',
    durationSeconds: 300, // 5 minutes
    goldReward: 200,
    xpReward: 250,
    levelRequired: 3
  },
  {
    id: 'job_mine_guard',
    name: 'Mine Guard Patrol',
    description: 'Keep the Whispering Caves safe from thief scouts and goblins.',
    durationSeconds: 600, // 10 minutes
    goldReward: 450,
    xpReward: 600,
    levelRequired: 5
  },
  {
    id: 'job_escort',
    name: 'Caravan Escort Duty',
    description: 'Guard a merchant cargo caravan through the cursed graveyard road.',
    durationSeconds: 1200, // 20 minutes
    goldReward: 1000,
    xpReward: 1400,
    levelRequired: 8
  },
  {
    id: 'job_dragon',
    name: 'Dragon peak Sentry',
    description: 'Keep watch on the volcanic peaks. Extremely dangerous, high risk.',
    durationSeconds: 3600, // 1 hour
    goldReward: 3500,
    xpReward: 5000,
    levelRequired: 15
  }
];
