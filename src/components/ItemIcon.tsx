import React from 'react';
import { ItemRarity } from '../types';

interface ItemIconProps {
  name: string;
  type: string;
  rarity?: ItemRarity;
  size?: number;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ name, type, rarity = 'Common', size = 32 }) => {
  // Spritesheet coordinates mapping (image dimensions: 1024x530 pixels)
  // Weapons X: 90px to 446px (step ~50.8px)
  // Weapons Y: 45px to 375px (step ~33px)
  // Armor X: 588px to 944px (step ~50.8px)
  // Armor Y: 45px to 276px (step ~33px), Shields Y: 305px
  // Accessories X: 18px (Rings), 330px (Necklaces) Y: 422px
  // Materials: Y = 420px (Ores), 450px (Wood), 480px (Leather), 510px (Gems)

  let x = 90;
  let y = 45;

  const n = name.toLowerCase();
  const r = rarity.toLowerCase();

  // Column index by rarity
  let col = 0;
  if (r.includes('uncommon')) col = 1;
  else if (r.includes('rare')) col = 2;
  else if (r.includes('epic')) col = 3;
  else if (r.includes('legendary')) col = 4;
  else if (r.includes('mythic')) col = 5;
  else if (r.includes('divine')) col = 6;

  if (type === 'Weapon') {
    let row = 0;
    if (n.includes('greatsword') || n.includes('claymore') || n.includes('worldbreaker') || n.includes('doombringer') || n.includes('executioner')) row = 1;
    else if (n.includes('dagger') || n.includes('knife') || n.includes('fang') || n.includes('silent') || n.includes('venom')) row = 2;
    else if (n.includes('axe') || n.includes('cleaver') || n.includes('hatchet')) row = 3;
    else if (n.includes('hammer') || n.includes('mace') || n.includes('maul') || n.includes('thunder') || n.includes('doom')) row = 4;
    else if (n.includes('spear') || n.includes('pike') || n.includes('lance') || n.includes('trident')) row = 5;
    else if (n.includes('bow') && !n.includes('crossbow')) row = 6;
    else if (n.includes('crossbow')) row = 7;
    else if (n.includes('staff')) row = 8;
    else if (n.includes('wand')) row = 9;
    else if (n.includes('scythe') || n.includes('reaper') || n.includes('death')) row = 10;
    else row = 0; // Default Swords

    x = 90 + col * 50.8;
    y = 45 + row * 33;
  } else if (type === 'Armor') {
    let row = 0;
    let isShield = false;

    if (n.includes('helm') || n.includes('hood') || n.includes('crown') || n.includes('cap')) row = 0;
    else if (n.includes('chest') || n.includes('armor') || n.includes('plate') || n.includes('robe') || n.includes('tunic') || n.includes('vest') || n.includes('chainmail')) row = 1;
    else if (n.includes('glove') || n.includes('gauntlet') || n.includes('mitts')) row = 2;
    else if (n.includes('boot') || n.includes('shoes') || n.includes('greaves')) row = 3;
    else if (n.includes('cloak') || n.includes('cape') || n.includes('mantle')) row = 4;
    else if (n.includes('belt') || n.includes('sash') || n.includes('rope')) row = 5;
    else if (n.includes('shield') || n.includes('aegis') || n.includes('bulwark') || n.includes('buckler') || n.includes('guardian')) isShield = true;
    else row = 1; // Default Chest

    if (isShield) {
      x = 588 + col * 50.8;
      y = 305;
    } else {
      x = 588 + col * 50.8;
      y = 45 + row * 33;
    }
  } else if (type === 'Accessory') {
    if (n.includes('ring')) {
      x = 18 + Math.min(5, col) * 50;
      y = 422;
    } else {
      // Necklaces / Amulets / Pendants
      x = 330 + Math.min(5, col) * 50;
      y = 422;
    }
  } else if (type === 'Material') {
    // Bottom right Materials block
    const hash = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    
    if (n.includes('ore') || n.includes('coal') || n.includes('crystal') || n.includes('stone') || n.includes('ingot') || n.includes('shard') || n.includes('quartz')) {
      x = 650 + (hash % 5) * 50;
      y = 420;
    } else if (n.includes('log') || n.includes('wood') || n.includes('bark') || n.includes('branch') || n.includes('fiber') || n.includes('plant') || n.includes('flower') || n.includes('herb') || n.includes('lotus') || n.includes('mushroom') || n.includes('glowcap')) {
      x = 650 + (hash % 5) * 50;
      y = 450;
    } else if (n.includes('hide') || n.includes('fur') || n.includes('leather') || n.includes('bone') || n.includes('scraps') || n.includes('fang') || n.includes('tooth')) {
      x = 650 + (hash % 5) * 50;
      y = 480;
    } else {
      // Gems/crystals or essences
      x = 650 + (hash % 5) * 50;
      y = 510;
    }
  } else {
    // Consumables / Potions
    const hash = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    x = 650 + (hash % 6) * 50;
    y = 450;
  }

  // Custom visual crop offsets to center the pixel art inside standard grid tiles
  return (
    <div 
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: 'url(/images/spritesheet.png)',
        backgroundPosition: `-${x}px -${y}px`,
        backgroundSize: '1024px 530px',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
        imageRendering: 'pixelated',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundClip: 'padding-box',
        verticalAlign: 'middle',
        flexShrink: 0
      }}
      title={`${name} (${rarity})`}
    />
  );
};
