import { PartyMember } from '../types';

export const generateCoopDescription = (
  eventType: 'Monster' | 'Boss' | 'Treasure' | 'Merchant' | 'NPC' | 'Gathering' | 'Dungeon' | 'Nothing',
  members: PartyMember[],
  targetName?: string
): string => {
  if (members.length === 0) return 'You venture out into the unknown...';
  
  const names = members.map(m => `${m.name} (${m.class})`);
  
  if (members.length === 1) {
    switch (eventType) {
      case 'Monster':
      case 'Boss':
        return `A hostile ${targetName || 'creature'} leaps from the shadows, facing ${names[0]}!`;
      case 'Treasure':
        return `${names[0]} discovers a locked treasure chest half-buried in the ground.`;
      case 'Merchant':
        return `${names[0]} encounters a wandering peddler showcasing their wares.`;
      case 'NPC':
        return `A town elder approaches ${names[0]} with an urgent request.`;
      case 'Gathering':
        return `${names[0]} spots a rich resource deposit ripe for harvesting.`;
      case 'Dungeon':
        return `${names[0]} stands before the heavy, engraving-filled gate of an ancient dungeon.`;
      default:
        return `${names[0]} travels along the path without incident.`;
    }
  }

  // Multi-member storytelling
  const leader = names[0];
  const helper = names[1];
  const others = names.slice(2).join(', ');
  const othersText = others ? `, supported by ${others}` : '';

  switch (eventType) {
    case 'Monster':
    case 'Boss': {
      const templates = [
        `As ${leader} keeps a tight guard at the vanguard, ${helper} spots a hostile ${targetName || 'creature'} charging from the shadows${othersText}!`,
        `A fierce ${targetName || 'creature'} ambushes the party! ${leader} stands firm to absorb the shock, while ${helper} prepares a counter-attack${othersText}!`,
        `${leader} coordinates the tactical line as a dangerous ${targetName || 'creature'} emerges. ${helper} signals the flank coordinates${othersText}.`
      ];
      return templates[Math.floor(Math.random() * templates.length)];
    }
    case 'Treasure':
      return `${leader} spots a gold-embossed chest keyhole. ${helper} begins checking the lock for traps${othersText} as they prepare to open it.`;
    case 'Merchant':
      return `The party meets a Wandering Merchant. ${leader} negotiates price points while ${helper} inspects the equipment quality${othersText}.`;
    case 'NPC':
      return `An urgent courier intercepts the group. ${leader} accepts the seal from the NPC, while ${helper} maps the objective coordinates${othersText}.`;
    case 'Gathering':
      return `A massive material node is discovered! ${leader} sets up tool hooks, while ${helper} starts extracting the materials${othersText}.`;
    case 'Dungeon':
      return `The group reaches the stone gate of a critical dungeon. ${leader} braces the heavy iron chains, while ${helper} channels power to open the portal${othersText}.`;
    default:
      return `${leader} and ${helper} discuss battle strategies as the group travels safely through the region${othersText}.`;
  }
};
