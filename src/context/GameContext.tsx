import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Player, Item, Quest, ChatMessage, MarketListing, 
  AdventureEvent, MonsterData, GatheringNodeData,
  ItemType, ItemRarity, Party, PartyMember, PartyInvite, PlayerProfessions
} from '../types';
import { generateRandomItem, CRAFTING_RECIPES } from '../constants/items';
import { generateRandomEvent, getRegionForLevel, REGIONS_CONFIG } from '../constants/events';
import { getSupabase, isSupabaseConfigured, saveCredentials } from '../supabase';
import { JOBS_DATABASE } from '../constants/jobs';
import { generateCoopDescription } from '../utils/narrative';

interface GameContextType {
  user: { email: string } | null;
  player: Player | null;
  inventory: Item[];
  quests: Quest[];
  chatMessages: ChatMessage[];
  marketListings: MarketListing[];
  activeEvent: AdventureEvent | null;
  adventureLog: string[];
  currentView: 'home' | 'character' | 'inventory' | 'town' | 'market' | 'guild' | 'settings' | 'jobs' | 'arena' | 'boss' | 'achievements' | 'leaderboard' | 'crafting';
  loading: boolean;
  isOnline: boolean;
  supabaseError: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createCharacter: (name: string, avatar: string, characterClass: 'Warrior' | 'Mage' | 'Rogue' | 'Ranger') => Promise<void>;
  setCurrentView: (view: 'home' | 'character' | 'inventory' | 'town' | 'market' | 'guild' | 'settings' | 'jobs' | 'arena' | 'boss' | 'achievements' | 'leaderboard' | 'crafting') => void;
  startAdventure: () => void;
  fightMonster: () => void;
  gatherMaterials: () => void;
  claimChest: () => void;
  completeQuestEvent: () => void;
  interactMerchant: (action: 'buy' | 'sell', itemToBuy?: Item) => void;
  dismissEvent: () => void;
  claimDailyReward: () => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  buyShopItem: (itemName: string, cost: number, itemType: ItemType, rarity: ItemRarity) => void;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  craftItem: (recipeName: string) => void;
  addChatMessage: (msg: string) => Promise<void>;
  listMarketItem: (itemId: string, price: number) => Promise<void>;
  buyMarketItem: (listingId: string) => Promise<void>;
  configureSupabase: (url: string, key: string) => Promise<boolean>;
  resetLocalData: () => void;
  activeJobId: string | null;
  activeJobEndTime: number | null;
  startJob: (jobId: string) => void;
  claimJobReward: () => void;
  cancelJob: () => void;
  allocateStat: (statType: 'strength' | 'defense' | 'speed' | 'vitality') => void;
  isDead: boolean;
  respawnNow: () => void;
  checkAchievements: (playerObj: Player) => Player;
  dungeonRoom: number;
  advanceDungeon: () => void;
  claimDungeonTreasure: () => void;

  // Cooperative actions
  party: Party | null;
  incomingInvites: PartyInvite[];
  createParty: () => Promise<void>;
  sendPartyInvite: (targetName: string) => Promise<boolean>;
  acceptPartyInvite: (inviteId: string) => Promise<void>;
  declinePartyInvite: (inviteId: string) => Promise<void>;
  leaveParty: () => Promise<void>;
  togglePartyReady: () => void;
  startCoopAdventure: () => void;
  coopFightMonster: () => void;
  startGroupDungeon: () => Promise<void>;
  claimGroupDungeonRewards: () => void;
  startSoloDungeon: () => void;
  startRegionalBossFight: () => void;
  grindProfession: (profKey: any, rolledMat?: { name: string; emoji: string }) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  
  // Job States
  const [activeJobId, setActiveJobId] = useState<string | null>(() => localStorage.getItem('job_id'));
  const [activeJobEndTime, setActiveJobEndTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('job_end_time');
    return saved ? parseInt(saved) : null;
  });
  const [isDead, setIsDead] = useState(false);
  const [respawnTimer, setRespawnTimer] = useState<number | null>(null);
  const [dungeonRoom, setDungeonRoom] = useState<number>(0);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [party, setParty] = useState<Party | null>(null);
  const [incomingInvites, setIncomingInvites] = useState<PartyInvite[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [activeEvent, setActiveEvent] = useState<AdventureEvent | null>(null);
  const [adventureLog, setAdventureLog] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'character' | 'inventory' | 'town' | 'market' | 'guild' | 'settings' | 'jobs' | 'arena' | 'boss' | 'achievements' | 'leaderboard' | 'crafting'>('home');
  const [loading, setLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  
  // Simulated chat messages pool for offline mode
  const offlineChatMessages = [
    { sender: 'ShadowBlade', msg: 'Anyone up for a dungeon run?' },
    { sender: 'LunaSkye', msg: 'Just hit level 10! The Whispering Caves are tough.' },
    { sender: 'WarriorX', msg: 'Finally crafted a Legendary Sword!' },
    { sender: 'Aetheris', msg: 'Selling Iron Ore for 15g each at the market.' },
    { sender: 'Monarch', msg: 'Let\'s goooo! ⚔️' },
    { sender: 'KnightRider', msg: 'Where does the Forest Guardian spawn?' },
    { sender: 'SorcererSlayer', msg: 'Mage class high damage is insane, but I die so fast!' },
  ];

  // 1. Initial configuration check & load from LocalStorage
  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      
      // Load chat messages simulation initially
      const initialChat: ChatMessage[] = [];
      for (let i = 0; i < 5; i++) {
        const item = offlineChatMessages[Math.floor(Math.random() * offlineChatMessages.length)];
        initialChat.push({
          id: Math.random().toString(),
          player_name: item.sender,
          message: item.msg,
          created_at: new Date(Date.now() - (5 - i) * 60000).toLocaleTimeString(),
        });
      }
      setChatMessages(initialChat);

      const hasSupabase = isSupabaseConfigured();
      setIsOnline(hasSupabase);

      // Check if we have local character saved
      const savedPlayer = localStorage.getItem('game_player');
      const savedInventory = localStorage.getItem('game_inventory');
      const savedQuests = localStorage.getItem('game_quests');
      const savedLog = localStorage.getItem('game_adventure_log');
      const savedUser = localStorage.getItem('game_user');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedPlayer) {
        setPlayer(JSON.parse(savedPlayer));
      }
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      } else {
        // Starter items
        const starterItems: Item[] = [
          { id: 'start_pot_1', name: 'Health Potion', type: 'Consumable', rarity: 'Common', value: 15, quantity: 3 },
          { id: 'start_pot_2', name: 'Energy Potion', type: 'Consumable', rarity: 'Common', value: 20, quantity: 1 },
          { id: 'start_mat_1', name: 'Iron Ore', type: 'Material', rarity: 'Common', value: 10, quantity: 2 },
        ];
        setInventory(starterItems);
        localStorage.setItem('game_inventory', JSON.stringify(starterItems));
      }

      if (savedQuests) {
        setQuests(JSON.parse(savedQuests));
      } else {
        const initialQuests: Quest[] = [
          { id: 'q1', quest_id: 'goblin_threat', name: 'Goblin Threat', progress: 0, target: 5, reward_xp: 200, reward_gold: 150, completed: false },
          { id: 'q2', quest_id: 'mining_materials', name: 'Iron Gathering', progress: 0, target: 5, reward_xp: 150, reward_gold: 120, completed: false }
        ];
        setQuests(initialQuests);
        localStorage.setItem('game_quests', JSON.stringify(initialQuests));
      }

      if (savedLog) {
        setAdventureLog(JSON.parse(savedLog));
      } else {
        setAdventureLog(['Welcome to Legends Reborn!', 'Create a character to start your adventure.']);
      }

      // Load simulated marketplace
      generateMockMarket();

      // Check live database sync if online
      if (hasSupabase) {
        await syncFromSupabaseDb();
      }

      setLoading(false);
    };

    loadGame();
  }, []);

  // 2. Periodic triggers (energy regen, stamina regen, simulated chat messages, world boss event)
  useEffect(() => {
    const timer = setInterval(() => {
      // Energy regeneration: +1 every 20 seconds, max 100
      setPlayer(prev => {
        if (!prev) return null;
        if (prev.energy >= prev.max_energy && prev.stamina >= prev.max_stamina && prev.hp >= prev.max_hp) return prev;
        
        const newEnergy = Math.min(prev.max_energy, prev.energy + (prev.energy < prev.max_energy ? 1 : 0));
        const newStamina = Math.min(prev.max_stamina, prev.stamina + (prev.stamina < prev.max_stamina ? 1 : 0));
        // Health heals slowly outside combat
        const newHp = Math.min(prev.max_hp, prev.hp + (prev.hp < prev.max_hp ? Math.round(prev.max_hp * 0.05) : 0));

        const updated = {
          ...prev,
          energy: newEnergy,
          stamina: newStamina,
          hp: newHp
        };
        
        localStorage.setItem('game_player', JSON.stringify(updated));
        // Sync to Supabase in background
        syncPlayerToSupabase(updated);
        return updated;
      });

      // Simulated active chat
      if (!isOnline && Math.random() < 0.25) {
        const item = offlineChatMessages[Math.floor(Math.random() * offlineChatMessages.length)];
        setChatMessages(prev => {
          const updated = [...prev, {
            id: Math.random().toString(),
            player_name: item.sender,
            message: item.msg,
            created_at: new Date().toLocaleTimeString()
          }].slice(-30); // Keep last 30 messages
          return updated;
        });
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [isOnline]);

  const syncParty = async (partyId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      const { data: dbParties } = await supabase.from('parties').select('*').eq('id', partyId);
      if (dbParties && dbParties.length > 0) {
        const dbParty = dbParties[0];
        const { data: dbMembers } = await supabase.from('players').select('id, name, class, level, hp, max_hp, party_ready').eq('party_id', partyId);
        
        const membersList: PartyMember[] = (dbMembers || []).map(m => ({
          id: m.id,
          name: m.name,
          class: m.class as any,
          level: m.level,
          hp: m.hp,
          max_hp: m.max_hp,
          ready: m.id === dbParty.leader_id ? true : !!m.party_ready
        }));

        const nextParty: Party = {
          id: dbParty.id,
          leader_id: dbParty.leader_id,
          leader_name: dbParty.leader_name,
          status: dbParty.status,
          members: membersList,
          current_event: dbParty.current_event
        };

        setParty(nextParty);

        if (dbParty.current_event && dbParty.status === 'adventuring') {
          setActiveEvent(dbParty.current_event);
        } else if (dbParty.status === 'lobby') {
          setActiveEvent(null);
        }
      } else {
        setParty(null);
      }
    } catch (e) {
      console.warn('Error syncing party details: ', e);
    }
  };

  // Co-op Party real-time channel sync
  useEffect(() => {
    if (!player || !isOnline) {
      setParty(null);
      setIncomingInvites([]);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from('party_invites').select('*').eq('receiver_id', player.id).then(({ data }) => {
      if (data) setIncomingInvites(data);
    });

    const invitesChannel = supabase.channel(`party_invites_${player.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'party_invites', filter: `receiver_id=eq.${player.id}` }, () => {
        supabase.from('party_invites').select('*').eq('receiver_id', player.id).then(({ data }) => {
          if (data) setIncomingInvites(data);
        });
      })
      .subscribe();

    let partyChannel: any = null;
    let membersChannel: any = null;
    if (player.party_id) {
      syncParty(player.party_id);
      
      partyChannel = supabase.channel(`party_sync_${player.party_id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'parties', filter: `id=eq.${player.party_id}` }, () => {
          syncParty(player.party_id!);
        })
        .subscribe();

      membersChannel = supabase.channel(`party_members_${player.party_id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `party_id=eq.${player.party_id}` }, () => {
          syncParty(player.party_id!);
        })
        .subscribe();
    } else {
      setParty(null);
    }

    return () => {
      supabase.removeChannel(invitesChannel);
      if (partyChannel) supabase.removeChannel(partyChannel);
      if (membersChannel) supabase.removeChannel(membersChannel);
    };
  }, [player?.party_id, isOnline]);

  // Generate simulated market listings
  const generateMockMarket = () => {
    const sellers = ['LunaSkye', 'ShadowBlade', 'Aetheris', 'KnightRider', 'WarriorX'];
    const mockListings: MarketListing[] = [
      {
        id: 'ml1',
        seller_id: 's1',
        seller_name: sellers[0],
        item_name: 'Iron Sword',
        item_type: 'Weapon',
        item_rarity: 'Common',
        item_value: 40,
        price: 35,
        quantity: 1,
        stats: { attack: 5 },
        created_at: new Date().toISOString()
      },
      {
        id: 'ml2',
        seller_id: 's2',
        seller_name: sellers[1],
        item_name: 'Goblin Dagger',
        item_type: 'Weapon',
        item_rarity: 'Uncommon',
        item_value: 90,
        price: 120,
        quantity: 1,
        stats: { attack: 8, speed: 2 },
        created_at: new Date().toISOString()
      },
      {
        id: 'ml3',
        seller_id: 's3',
        seller_name: sellers[2],
        item_name: 'Wolf Fur',
        item_type: 'Material',
        item_rarity: 'Common',
        item_value: 8,
        price: 15,
        quantity: 5,
        created_at: new Date().toISOString()
      }
    ];
    setMarketListings(mockListings);
  };

  // Sync state helpers
  const syncPlayerToSupabase = async (playerData: Player) => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      await supabase.from('players').upsert({
        id: playerData.id,
        name: playerData.name,
        avatar: playerData.avatar,
        class: playerData.class,
        level: playerData.level,
        hp: playerData.hp,
        max_hp: playerData.max_hp,
        energy: playerData.energy,
        max_energy: playerData.max_energy,
        gold: playerData.gold,
        diamonds: playerData.diamonds,
        xp: playerData.xp,
        max_xp: playerData.max_xp,
        stat_points: playerData.stat_points,
        strength: playerData.strength,
        defense: playerData.defense,
        speed: playerData.speed,
        vitality: playerData.vitality,
        daily_streak: playerData.daily_streak,
        last_daily_claim: playerData.last_daily_claim,
        achievements: playerData.achievements,
        total_kills: playerData.total_kills,
        total_crafts: playerData.total_crafts,
        pvp_wins: playerData.pvp_wins,
        mining_lv: playerData.professions.mining.level,
        mining_xp: playerData.professions.mining.xp,
        blacksmithing_lv: playerData.professions.blacksmithing.level,
        blacksmithing_xp: playerData.professions.blacksmithing.xp,
        herbalism_lv: playerData.professions.herbalism.level,
        herbalism_xp: playerData.professions.herbalism.xp,
        fishing_lv: playerData.professions.fishing.level,
        fishing_xp: playerData.professions.fishing.xp,
        woodcutting_lv: playerData.professions.woodcutting?.level || 1,
        woodcutting_xp: playerData.professions.woodcutting?.xp || 0,
        skinning_lv: playerData.professions.skinning?.level || 1,
        skinning_xp: playerData.professions.skinning?.xp || 0,
        foraging_lv: playerData.professions.foraging?.level || 1,
        foraging_xp: playerData.professions.foraging?.xp || 0,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed background sync to Supabase players table: ', e);
    }
  };

  const syncInventoryToSupabase = async (invData: Item[], playerId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      // Simplistic delete and rebuild for the demo player
      await supabase.from('inventory').delete().eq('player_id', playerId);
      
      const inserts = invData.map(item => ({
        player_id: playerId,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        value: item.value,
        equipped: item.equipped || false,
        quantity: item.quantity || 1,
        stats: item.stats || {}
      }));
      if (inserts.length > 0) {
        await supabase.from('inventory').insert(inserts);
      }
    } catch (e) {
      console.warn('Failed background sync to Supabase inventory table: ', e);
    }
  };

  const syncQuestsToSupabase = async (questsData: Quest[], playerId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    try {
      await supabase.from('quests').delete().eq('player_id', playerId);
      
      const inserts = questsData.map(q => ({
        player_id: playerId,
        quest_id: q.quest_id,
        name: q.name,
        progress: q.progress,
        target: q.target,
        reward_xp: q.reward_xp,
        reward_gold: q.reward_gold,
        completed: q.completed
      }));
      if (inserts.length > 0) {
        await supabase.from('quests').insert(inserts);
      }
    } catch (e) {
      console.warn('Failed background sync to Supabase quests table: ', e);
    }
  };

  const syncFromSupabaseDb = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser({ email: authUser.email || '' });
      localStorage.setItem('game_user', JSON.stringify({ email: authUser.email || '' }));

      // Fetch player profile
      const { data: dbPlayers, error: pErr } = await supabase.from('players').select('*').eq('id', authUser.id);
      if (pErr) throw pErr;
      
      if (dbPlayers && dbPlayers.length > 0) {
        const dbPlayer = dbPlayers[0];
        const formattedPlayer: Player = {
          id: dbPlayer.id,
          name: dbPlayer.name,
          avatar: dbPlayer.avatar,
          class: dbPlayer.class,
          level: dbPlayer.level,
          hp: dbPlayer.hp,
          max_hp: dbPlayer.max_hp,
          energy: dbPlayer.energy,
          max_energy: dbPlayer.max_energy,
          stamina: dbPlayer.energy, // map energy to stamina
          max_stamina: dbPlayer.max_energy,
          gold: dbPlayer.gold,
          diamonds: dbPlayer.diamonds,
          xp: dbPlayer.xp,
          max_xp: dbPlayer.max_xp,
          stat_points: dbPlayer.stat_points || 0,
          strength: dbPlayer.strength || 10,
          defense: dbPlayer.defense || 10,
          speed: dbPlayer.speed || 10,
          vitality: dbPlayer.vitality || 10,
          daily_streak: dbPlayer.daily_streak || 0,
          last_daily_claim: dbPlayer.last_daily_claim || '',
          achievements: dbPlayer.achievements || [],
          total_kills: dbPlayer.total_kills || 0,
          total_crafts: dbPlayer.total_crafts || 0,
          pvp_wins: dbPlayer.pvp_wins || 0,
          professions: {
            mining: { level: dbPlayer.mining_lv, xp: dbPlayer.mining_xp, max_xp: dbPlayer.mining_lv * 100 },
            blacksmithing: { level: dbPlayer.blacksmithing_lv, xp: dbPlayer.blacksmithing_xp, max_xp: dbPlayer.blacksmithing_lv * 100 },
            herbalism: { level: dbPlayer.herbalism_lv, xp: dbPlayer.herbalism_xp, max_xp: dbPlayer.herbalism_lv * 100 },
            fishing: { level: dbPlayer.fishing_lv, xp: dbPlayer.fishing_xp, max_xp: dbPlayer.fishing_lv * 100 },
            woodcutting: { level: dbPlayer.woodcutting_lv || 1, xp: dbPlayer.woodcutting_xp || 0, max_xp: (dbPlayer.woodcutting_lv || 1) * 100 },
            skinning: { level: dbPlayer.skinning_lv || 1, xp: dbPlayer.skinning_xp || 0, max_xp: (dbPlayer.skinning_lv || 1) * 100 },
            foraging: { level: dbPlayer.foraging_lv || 1, xp: dbPlayer.foraging_xp || 0, max_xp: (dbPlayer.foraging_lv || 1) * 100 },
          }
        };
        setPlayer(formattedPlayer);
        localStorage.setItem('game_player', JSON.stringify(formattedPlayer));

        // Fetch Inventory
        const { data: dbInv } = await supabase.from('inventory').select('*').eq('player_id', authUser.id);
        if (dbInv) {
          const formattedInv: Item[] = dbInv.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            rarity: item.rarity,
            value: item.value,
            equipped: item.equipped,
            quantity: item.quantity,
            stats: item.stats
          }));
          setInventory(formattedInv);
          localStorage.setItem('game_inventory', JSON.stringify(formattedInv));
        }

        // Fetch Quests
        const { data: dbQuests } = await supabase.from('quests').select('*').eq('player_id', authUser.id);
        if (dbQuests && dbQuests.length > 0) {
          const formattedQuests: Quest[] = dbQuests.map((q: any) => ({
            id: q.id,
            quest_id: q.quest_id,
            name: q.name,
            progress: q.progress,
            target: q.target,
            reward_xp: q.reward_xp,
            reward_gold: q.reward_gold,
            completed: q.completed
          }));
          setQuests(formattedQuests);
          localStorage.setItem('game_quests', JSON.stringify(formattedQuests));
        }

        // Fetch live chat
        const { data: dbChat } = await supabase.from('global_chat').select('*').order('created_at', { ascending: false }).limit(20);
        if (dbChat) {
          setChatMessages(dbChat.reverse().map((c: any) => ({
            id: c.id,
            player_name: c.player_name,
            message: c.message,
            created_at: new Date(c.created_at).toLocaleTimeString()
          })));
        }

        // Setup real-time channel subscription
        supabase.channel('global_chat_channel')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'global_chat' }, payload => {
            const newMsg = payload.new;
            setChatMessages(prev => {
              // Avoid duplicates
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, {
                id: newMsg.id,
                player_name: newMsg.player_name,
                message: newMsg.message,
                created_at: new Date(newMsg.created_at).toLocaleTimeString()
              }].slice(-30);
            });
          })
          .subscribe();
      }
    } catch (e: any) {
      setSupabaseError(e.message || 'Error loading from Supabase');
    }
  };

  // Helper log function
  const addLog = (msg: string) => {
    setAdventureLog(prev => {
      const updated = [msg, ...prev].slice(0, 50); // Keep last 50 entries
      localStorage.setItem('game_adventure_log', JSON.stringify(updated));
      return updated;
    });
  };

  // Achievements check and unlock helper
  const checkAchievements = (playerObj: Player): Player => {
    const database = [
      { id: 'first_steps', check: (p: Player) => p.level >= 2, diamonds: 10, gold: 50, name: 'First Steps' },
      { id: 'champion_training', check: (p: Player) => p.level >= 10, diamonds: 50, gold: 500, name: 'Champion in Training' },
      { id: 'first_blood', check: (p: Player) => (p.pvp_wins || 0) >= 1, diamonds: 25, gold: 250, name: 'Gladiator Born' },
      { id: 'pvp_warlord', check: (p: Player) => (p.pvp_wins || 0) >= 10, diamonds: 100, gold: 1500, name: 'PvP Warlord' },
      { id: 'novice_gatherer', check: (p: Player) => (p.total_kills || 0) >= 10, diamonds: 15, gold: 100, name: 'Resource Harvester' },
      { id: 'master_crafter', check: (p: Player) => (p.total_crafts || 0) >= 5, diamonds: 30, gold: 300, name: 'Forge Master' },
      { id: 'gold_hoarder', check: (p: Player) => p.gold >= 1000, diamonds: 20, gold: 0, name: 'Gold Hoarder' },
      { id: 'dragon_striker', check: (p: Player) => {
          const bossDmg = parseInt(localStorage.getItem('boss_contrib') || '0');
          return bossDmg >= 10000;
        }, diamonds: 50, gold: 1000, name: 'Giant Slayer' }
    ];

    let updated = { ...playerObj };
    const unlocked = new Set(updated.achievements || []);
    let modified = false;

    database.forEach(ach => {
      if (!unlocked.has(ach.id) && ach.check(updated)) {
        unlocked.add(ach.id);
        updated.diamonds += ach.diamonds;
        updated.gold += ach.gold;
        addLog(`🏆 Achievement Unlocked: "${ach.name}"! (+${ach.diamonds} 💎, +${ach.gold} Gold)`);
        modified = true;
      }
    });

    if (modified) {
      updated.achievements = Array.from(unlocked);
    }
    return updated;
  };

  // Level Up check helper
  const addXP = (playerObj: Player, amount: number): Player => {
    let currentXp = playerObj.xp + amount;
    let level = playerObj.level;
    let max_xp = playerObj.max_xp;
    let hp = playerObj.hp;
    let max_hp = playerObj.max_hp;
    let stat_points = playerObj.stat_points;
    let leveledUp = false;

    while (currentXp >= max_xp) {
      currentXp -= max_xp;
      level += 1;
      max_xp = level * 100;
      max_hp = Math.round(max_hp * 1.15); // +15% max hp
      hp = max_hp; // fully healed
      stat_points += 5; // +5 stat points per level
      leveledUp = true;
    }

    const updated = {
      ...playerObj,
      level,
      xp: currentXp,
      max_xp,
      hp,
      max_hp,
      stat_points,
      energy: playerObj.max_energy, // Restore energy on level up
      stamina: playerObj.max_stamina
    };

    if (leveledUp) {
      addLog(`✨ LEVEL UP! You reached Level ${level}! Stats increased and Energy restored.`);
    }

    return checkAchievements(updated);
  };

  // Update Quest Progress helper
  const updateQuestProgress = (questId: string, amount: number) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.quest_id === questId && !q.completed) {
          const newProgress = Math.min(q.target, q.progress + amount);
          const completed = newProgress >= q.target;
          
          if (completed) {
            addLog(`✅ Quest "${q.name}" Completed! Speak to the town NPC for rewards.`);
          }
          return { ...q, progress: newProgress, completed };
        }
        return q;
      });
      localStorage.setItem('game_quests', JSON.stringify(updated));
      if (player) {
        syncQuestsToSupabase(updated, player.id);
      }
      return updated;
    });
  };

  // Auth Operations
  const login = async (email: string, password: string): Promise<boolean> => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setSupabaseError(error.message);
        return false;
      }
      setUser({ email: data.user?.email || email });
      localStorage.setItem('game_user', JSON.stringify({ email: data.user?.email || email }));
      await syncFromSupabaseDb();
      return true;
    } else {
      // Local mock login
      setUser({ email });
      localStorage.setItem('game_user', JSON.stringify({ email }));
      addLog(`Logged in as ${email}`);
      return true;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setSupabaseError(error.message);
        return false;
      }
      setUser({ email: data.user?.email || email });
      localStorage.setItem('game_user', JSON.stringify({ email: data.user?.email || email }));
      return true;
    } else {
      setUser({ email });
      localStorage.setItem('game_user', JSON.stringify({ email }));
      addLog(`Registered account ${email}`);
      return true;
    }
  };

  const logout = () => {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    setPlayer(null);
    setInventory([]);
    setQuests([]);
    setActiveEvent(null);
    localStorage.removeItem('game_user');
    localStorage.removeItem('game_player');
    localStorage.removeItem('game_inventory');
    localStorage.removeItem('game_quests');
    localStorage.removeItem('game_adventure_log');
    addLog('Logged out.');
  };

  const createCharacter = async (name: string, avatar: string, characterClass: 'Warrior' | 'Mage' | 'Rogue' | 'Ranger') => {
    // Initial stats based on class
    let max_hp = 100;
    let baseStrength = 10;
    let baseDefense = 10;
    let baseSpeed = 10;
    let baseVitality = 10;
    
    if (characterClass === 'Warrior') {
      max_hp = 150;
      baseStrength = 12;
      baseDefense = 14;
      baseSpeed = 8;
      baseVitality = 15;
    } else if (characterClass === 'Mage') {
      max_hp = 80;
      baseStrength = 8;
      baseDefense = 6;
      baseSpeed = 12;
      baseVitality = 8;
    } else if (characterClass === 'Rogue') {
      max_hp = 95;
      baseStrength = 10;
      baseDefense = 8;
      baseSpeed = 15;
      baseVitality = 9;
    } else if (characterClass === 'Ranger') {
      max_hp = 105;
      baseStrength = 10;
      baseDefense = 10;
      baseSpeed = 12;
      baseVitality = 10;
    }

    const newPlayer: Player = {
      id: user?.email ? Math.random().toString(36).substring(2, 12) : 'local_id', // auth.uid fallback
      name,
      avatar,
      class: characterClass,
      level: 1,
      hp: max_hp,
      max_hp,
      energy: 100,
      max_energy: 100,
      stamina: 8,
      max_stamina: 8,
      gold: 250, // generous starting gold
      diamonds: 20,
      xp: 0,
      max_xp: 100,
      stat_points: 0,
      strength: baseStrength,
      defense: baseDefense,
      speed: baseSpeed,
      vitality: baseVitality,
      daily_streak: 0,
      last_daily_claim: '',
      achievements: [],
      total_kills: 0,
      total_crafts: 0,
      pvp_wins: 0,
      professions: {
        mining: { level: 1, xp: 0, max_xp: 100 },
        blacksmithing: { level: 1, xp: 0, max_xp: 100 },
        herbalism: { level: 1, xp: 0, max_xp: 100 },
        fishing: { level: 1, xp: 0, max_xp: 100 },
        woodcutting: { level: 1, xp: 0, max_xp: 100 },
        skinning: { level: 1, xp: 0, max_xp: 100 },
        foraging: { level: 1, xp: 0, max_xp: 100 },
      }
    };

    // If Supabase configured, update UUID
    const supabase = getSupabase();
    if (supabase) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        newPlayer.id = authUser.id;
      }
    }

    setPlayer(newPlayer);
    localStorage.setItem('game_player', JSON.stringify(newPlayer));

    // Basic starting equipment for the class
    let starterWeapon: Item = { id: 'start_wep', name: 'Rusty Dagger', type: 'Weapon', rarity: 'Common', value: 15, stats: { attack: 2 }, equipped: true };
    if (characterClass === 'Warrior') {
      starterWeapon = { id: 'start_wep', name: 'Iron Sword', type: 'Weapon', rarity: 'Common', value: 40, stats: { attack: 5 }, equipped: true };
    } else if (characterClass === 'Mage') {
      starterWeapon = { id: 'start_wep', name: 'Wooden Staff', type: 'Weapon', rarity: 'Common', value: 25, stats: { attack: 3 }, equipped: true };
    } else if (characterClass === 'Ranger') {
      starterWeapon = { id: 'start_wep', name: 'Hunter Bow', type: 'Weapon', rarity: 'Common', value: 30, stats: { attack: 4 }, equipped: true };
    }

    const defaultInv: Item[] = [
      starterWeapon,
      { id: 'start_pot_1', name: 'Health Potion', type: 'Consumable', rarity: 'Common', value: 15, quantity: 3 },
      { id: 'start_pot_2', name: 'Energy Potion', type: 'Consumable', rarity: 'Common', value: 20, quantity: 1 }
    ];
    setInventory(defaultInv);
    localStorage.setItem('game_inventory', JSON.stringify(defaultInv));

    addLog(`⚔️ Created Character ${name} the ${characterClass}!`);

    // Sync to Supabase
    await syncPlayerToSupabase(newPlayer);
    await syncInventoryToSupabase(defaultInv, newPlayer.id);
  };

  // Idle Jobs Actions
  const startJob = (jobId: string) => {
    if (!player) return;
    if (activeJobId) {
      addLog('❌ You are already working a job.');
      return;
    }
    const job = JOBS_DATABASE.find(j => j.id === jobId);
    if (!job) return;
    if (player.level < job.levelRequired) {
      addLog(`❌ Level ${job.levelRequired} required for this job.`);
      return;
    }

    const endTime = Date.now() + job.durationSeconds * 1000;
    setActiveJobId(jobId);
    setActiveJobEndTime(endTime);
    
    localStorage.setItem('job_id', jobId);
    localStorage.setItem('job_end_time', endTime.toString());
    
    addLog(`💼 Started Job: "${job.name}" (${job.durationSeconds} seconds)...`);
  };

  const claimJobReward = () => {
    if (!player || !activeJobId || !activeJobEndTime) return;
    if (Date.now() < activeJobEndTime) {
      const remainingSecs = Math.ceil((activeJobEndTime - Date.now()) / 1000);
      addLog(`⌛ Job in progress. ${remainingSecs} seconds remaining.`);
      return;
    }

    const job = JOBS_DATABASE.find(j => j.id === activeJobId);
    if (!job) return;

    let finalPlayer = { ...player };
    finalPlayer.gold += job.goldReward;
    finalPlayer = addXP(finalPlayer, job.xpReward);

    setPlayer(finalPlayer);
    localStorage.setItem('game_player', JSON.stringify(finalPlayer));
    
    // Clear Job state
    setActiveJobId(null);
    setActiveJobEndTime(null);
    localStorage.removeItem('job_id');
    localStorage.removeItem('job_end_time');

    addLog(`💰 Completed Job "${job.name}"! Gained +${job.goldReward} Gold, +${job.xpReward} XP.`);
    syncPlayerToSupabase(finalPlayer);
  };

  const cancelJob = () => {
    if (!activeJobId) return;
    setActiveJobId(null);
    setActiveJobEndTime(null);
    localStorage.removeItem('job_id');
    localStorage.removeItem('job_end_time');
    addLog('💼 Job canceled. No rewards earned.');
  };

  // Stat Allocation Action
  const allocateStat = (statType: 'strength' | 'defense' | 'speed' | 'vitality') => {
    if (!player || player.stat_points <= 0) return;

    let updatedPlayer = {
      ...player,
      stat_points: player.stat_points - 1,
      [statType]: player[statType] + 1
    };

    if (statType === 'vitality') {
      updatedPlayer.max_hp += 10;
      updatedPlayer.hp += 10;
    }

    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    addLog(`📈 Increased ${statType.toUpperCase()} by 1!`);
    syncPlayerToSupabase(updatedPlayer);
  };

  // Game Loops
  const startAdventure = () => {
    if (!player) return;
    if (activeJobId) {
      addLog('❌ You are currently working a job! Finish or cancel it first.');
      return;
    }

    if (player.group_dungeon_finish_time && Date.now() < player.group_dungeon_finish_time) {
      const remainingMs = player.group_dungeon_finish_time - Date.now();
      const hours = Math.floor(remainingMs / 3600000);
      const minutes = Math.floor((remainingMs % 3600000) / 60000);
      addLog(`❌ You are locked inside the Group Dungeon! Complete in ${hours}h ${minutes}m.`);
      return;
    }
    
    if (player.energy < 1) {
      addLog('❌ Out of Energy! Drink an Energy Potion or wait for it to regenerate.');
      return;
    }

    // Spend energy
    const updatedPlayer = {
      ...player,
      energy: player.energy - 1
    };

    // Roll Event
    const event = generateRandomEvent(player.level, player.active_region);
    if (event.type === 'Dungeon') {
      setDungeonRoom(1);
    } else {
      setDungeonRoom(0);
    }
    
    setActiveEvent(event);
    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    
    const activeRegion = player.active_region || 'Greenwood Forest';
    addLog(`👣 Explored ${activeRegion} (-1 Energy)...`);
    syncPlayerToSupabase(updatedPlayer);
  };

  const startGroupDungeon = async () => {
    if (!player) return;
    
    if (player.group_dungeon_finish_time && Date.now() < player.group_dungeon_finish_time) {
      addLog('❌ You are already participating in a Group Dungeon raid!');
      return;
    }
    
    if (player.energy < 2) {
      addLog('❌ Insufficient Energy to join a Group Raid Dungeon! (Requires 2 Energy)');
      return;
    }

    const currentRegion = player.active_region || getRegionForLevel(player.level);
    const finishTime = Date.now() + 3 * 3600 * 1000; // 3 hours

    const updatedPlayer = {
      ...player,
      energy: player.energy - 2,
      group_dungeon_finish_time: finishTime,
      group_dungeon_region: currentRegion
    };

    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    addLog(`🏰 You entered the Group Dungeon raid: ${currentRegion}! Exploring will be locked for 3 hours.`);
    syncPlayerToSupabase(updatedPlayer);
  };

  const claimGroupDungeonRewards = () => {
    if (!player || !player.group_dungeon_finish_time) return;
    if (Date.now() < player.group_dungeon_finish_time) {
      addLog('❌ Dungeon raid is not finished yet.');
      return;
    }

    const region = player.group_dungeon_region || 'Greenwood Forest';
    const conf = REGIONS_CONFIG.find(r => r.name === region) || REGIONS_CONFIG[0];
    
    const goldEarned = Math.round(conf.boss.goldReward * 1.5);
    const xpEarned = Math.round(conf.boss.xpReward * 1.5);

    let updatedPlayer: Player = {
      ...player,
      gold: player.gold + goldEarned
    };
    delete updatedPlayer.group_dungeon_finish_time;
    delete updatedPlayer.group_dungeon_region;
    updatedPlayer = addXP(updatedPlayer, xpEarned);

    const loot = generateRandomItem(player.level >= 50 ? 'Legendary' : 'Epic');
    setInventory(prev => {
      const updated = [...prev, loot];
      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, updatedPlayer.id);
      return updated;
    });

    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    addLog(`🎉 Completed Group Dungeon! Received +${goldEarned} Gold, +${xpEarned} XP, and 1x ${loot.name} (${loot.rarity})!`);
    syncPlayerToSupabase(updatedPlayer);
  };

  const startSoloDungeon = () => {
    if (!player) return;
    
    if (player.group_dungeon_finish_time && Date.now() < player.group_dungeon_finish_time) {
      addLog('❌ You are currently locked in a Group Dungeon raid!');
      return;
    }
    
    if (player.energy < 1) {
      addLog('❌ Out of Energy! Drink an Energy Potion or wait for it to regenerate.');
      return;
    }

    const currentRegion = player.active_region || getRegionForLevel(player.level);
    const regionConfig = REGIONS_CONFIG.find(r => r.name === currentRegion) || REGIONS_CONFIG[0];
    
    const scalingFactor = 1 + (player.level - regionConfig.minLevel) * 0.12;
    const monster: MonsterData = {
      name: 'Dungeon Sentinel',
      hp: Math.round(70 * scalingFactor),
      max_hp: Math.round(70 * scalingFactor),
      attack: Math.round(10 * scalingFactor),
      xpReward: Math.round(40 * scalingFactor),
      goldReward: Math.round(35 * scalingFactor),
      lootChance: 0.6
    };

    const event: AdventureEvent = {
      type: 'Dungeon',
      title: 'Solo Dungeon Gauntlet',
      description: `You entered the Solo Dungeon in ${currentRegion}. Room 1 sentinel stands before you!`,
      monster
    };

    const updatedPlayer = {
      ...player,
      energy: player.energy - 1
    };

    setDungeonRoom(1);
    setActiveEvent(event);
    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    addLog(`🏰 Entered Solo Dungeon Gauntlet in ${currentRegion} (-1 Energy).`);
    syncPlayerToSupabase(updatedPlayer);
  };

  const startRegionalBossFight = () => {
    if (!player) return;
    
    if (player.group_dungeon_finish_time && Date.now() < player.group_dungeon_finish_time) {
      addLog('❌ You are currently locked in a Group Dungeon raid!');
      return;
    }
    
    if (player.energy < 1) {
      addLog('❌ Out of Energy! Drink an Energy Potion or wait for it to regenerate.');
      return;
    }

    const currentRegion = player.active_region || getRegionForLevel(player.level);
    const regionConfig = REGIONS_CONFIG.find(r => r.name === currentRegion) || REGIONS_CONFIG[0];
    
    const event: AdventureEvent = {
      type: 'Boss',
      title: `BOSS BATTLE: ${regionConfig.boss.name}!`,
      description: `The ground trembles as you challenge ${regionConfig.boss.name}, the sentinel of ${currentRegion}!`,
      monster: regionConfig.boss
    };

    const updatedPlayer = {
      ...player,
      energy: player.energy - 1
    };

    setActiveEvent(event);
    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    addLog(`👹 Challenged ${regionConfig.boss.name} in ${currentRegion} (-1 Energy).`);
    syncPlayerToSupabase(updatedPlayer);
  };

  const grindProfession = (profKey: string, rolledMat?: { name: string; emoji: string }) => {
    if (!player) return;

    const key = profKey as keyof PlayerProfessions;
    const playerProf = player.professions[key] || { level: 1, xp: 0, max_xp: 100 };
    let newXp = playerProf.xp + 25; // 25 XP per grind completion
    let newLevel = playerProf.level;
    let newMaxXp = playerProf.max_xp;
    let lvUpText = '';

    while (newXp >= newMaxXp) {
      newXp -= newMaxXp;
      newLevel += 1;
      newMaxXp = newLevel * 100;
      lvUpText = `📈 Your ${profKey.toUpperCase()} level increased to ${newLevel}!`;
    }

    const updatedPlayer = {
      ...player,
      professions: {
        ...player.professions,
        [key]: {
          level: newLevel,
          xp: newXp,
          max_xp: newMaxXp
        }
      }
    };

    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));

    if (rolledMat) {
      const rolledItem: Item = {
        id: Math.random().toString(36).substring(2, 9),
        name: `${rolledMat.emoji} ${rolledMat.name}`,
        type: 'Material',
        rarity: newLevel >= 8 ? 'Rare' : newLevel >= 4 ? 'Uncommon' : 'Common',
        value: newLevel >= 8 ? 80 : newLevel >= 4 ? 30 : 10,
        quantity: 1
      };

      setInventory(prev => {
        const existing = prev.find(i => i.name === rolledItem.name);
        let updated;
        if (existing) {
          updated = prev.map(i => i.id === existing.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
        } else {
          updated = [...prev, rolledItem];
        }
        localStorage.setItem('game_inventory', JSON.stringify(updated));
        syncInventoryToSupabase(updated, updatedPlayer.id);
        return updated;
      });

      addLog(`⚙️ Grind Complete! Gained +25 ${profKey.toUpperCase()} XP and found 1x ${rolledMat.emoji} ${rolledMat.name}.`);
    } else {
      addLog(`⚙️ Grind Complete! Gained +25 ${profKey.toUpperCase()} XP (No resources found this turn).`);
    }

    if (lvUpText) addLog(lvUpText);
    syncPlayerToSupabase(updatedPlayer);
  };

  // Combat execution simulation
  const fightMonster = () => {
    if (!player || !activeEvent || (!activeEvent.monster)) return;
    
    const monster = activeEvent.monster;
    let pHP = player.hp;
    let mHP = monster.hp;
    
    // Get equipped weapon stats
    const equippedWeapon = inventory.find(i => i.type === 'Weapon' && i.equipped);
    const equippedArmor = inventory.find(i => i.type === 'Armor' && i.equipped);
    const equippedAccessory = inventory.find(i => i.type === 'Accessory' && i.equipped);
    
    const weaponAtk = equippedWeapon?.stats?.attack || 0;
    const armorDef = equippedArmor?.stats?.defense || 0;
    const itemHp = (equippedArmor?.stats?.health || 0) + (equippedAccessory?.stats?.health || 0);
    const itemCrit = (equippedWeapon?.stats?.crit || 0) + (equippedAccessory?.stats?.crit || 0);
    const itemSpeed = (equippedWeapon?.stats?.speed || 0) + (equippedArmor?.stats?.speed || 0);

    // Core stats from manual allocation + gear + class bonuses
    let baseDamage = player.strength + weaponAtk + (player.class === 'Mage' ? 10 : 0);
    let defense = player.defense + armorDef + (player.class === 'Warrior' ? 5 : 0);
    let criticalChance = 0.05 + (player.speed * 0.004) + itemCrit / 100 + (player.class === 'Rogue' ? 0.15 : 0);
    let speed = player.speed + itemSpeed + (player.class === 'Rogue' ? 5 : 0);
    
    // Dodge chance based on speed
    const dodgeChance = Math.min(0.3, player.speed * 0.003);

    const logs: string[] = [];
    logs.push(`⚔️ Combat starts with ${monster.name}!`);

    let turn = 1;
    while (pHP > 0 && mHP > 0 && turn <= 20) {
      // Player turn
      let isCrit = Math.random() < criticalChance;
      let dmg = Math.round(baseDamage * (0.85 + Math.random() * 0.3)); // variance
      if (isCrit) {
        dmg = Math.round(dmg * 2.0);
        logs.push(`🗡️ You strike ${monster.name} for ${dmg} damage! (CRITICAL HIT)`);
      } else {
        logs.push(`🗡️ You strike ${monster.name} for ${dmg} damage.`);
      }
      mHP -= dmg;

      if (mHP <= 0) break;

      // Monster turn
      // Player can dodge based on speed
      if (Math.random() < dodgeChance) {
        logs.push(`💨 ${monster.name} attacks but you dodge! (${Math.round(dodgeChance * 100)}% chance)`);
      } else {
        let mDmg = Math.max(1, Math.round(monster.attack * (0.85 + Math.random() * 0.3) - defense));
        logs.push(`👹 ${monster.name} attacks you for ${mDmg} damage (Defended ${defense}).`);
        pHP -= mDmg;
      }

      turn++;
    }

    const success = pHP > 0;
    
    // Resolve outcomes
    let finalPlayer = { ...player };
    finalPlayer.hp = Math.max(0, pHP);

    if (success) {
      logs.push(`🎉 Victory! Defeated ${monster.name}!`);
      
      // Quest progression updates
      if (monster.name.toLowerCase().includes('goblin')) {
        updateQuestProgress('goblin_threat', 1);
      }
      if (monster.name.toLowerCase().includes('guardian')) {
        updateQuestProgress('defeat_guardian', 1);
      }

      // Add Gold and XP
      finalPlayer.gold += monster.goldReward;
      logs.push(`💰 Received +${monster.goldReward} Gold.`);
      
      finalPlayer = addXP(finalPlayer, monster.xpReward);
      logs.push(`⭐ Received +${monster.xpReward} XP.`);

      // Loot Chance
      if (Math.random() < monster.lootChance) {
        const rolledItem = generateRandomItem();
        logs.push(`🎁 Found item: ${rolledItem.name} (${rolledItem.rarity})!`);
        
        setInventory(prev => {
          const existing = prev.find(item => item.name === rolledItem.name && !item.stats);
          let updated;
          if (existing) {
            updated = prev.map(item => item.id === existing.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
          } else {
            updated = [...prev, rolledItem];
          }
          localStorage.setItem('game_inventory', JSON.stringify(updated));
          syncInventoryToSupabase(updated, finalPlayer.id);
          return updated;
        });
      }
      
      // Track kills
      finalPlayer.total_kills = (finalPlayer.total_kills || 0) + 1;
      finalPlayer = checkAchievements(finalPlayer);
    } else {
      logs.push(`💀 Defeat! You were slain by ${monster.name}.`);
      const goldLost = Math.round(finalPlayer.gold * 0.1);
      finalPlayer.gold = finalPlayer.gold - goldLost;
      finalPlayer.hp = 0;
      logs.push(`💸 Lost ${goldLost} gold as a death penalty.`);
    }

    setPlayer(finalPlayer);
    localStorage.setItem('game_player', JSON.stringify(finalPlayer));
    
    // Display combat summary
    setActiveEvent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        title: success ? 'Combat Victory' : 'Combat Defeat',
        description: logs.join('\n')
      };
    });
    
    // Add summary to recent logs
    addLog(`${success ? '⚔️ Defeated' : '💀 Defeated by'} ${monster.name} (+${success ? monster.xpReward : 0} XP, +${success ? monster.goldReward : 0} Gold)`);
    syncPlayerToSupabase(finalPlayer);

    // Trigger death state if player died
    if (!success && finalPlayer.hp <= 0) {
      setIsDead(true);
      // Auto-respawn after 10 seconds
      const timer = window.setTimeout(() => {
        setPlayer(prev => {
          if (!prev) return null;
          const respawned = { ...prev, hp: Math.round(prev.max_hp * 0.5) };
          localStorage.setItem('game_player', JSON.stringify(respawned));
          return respawned;
        });
        setIsDead(false);
        setRespawnTimer(null);
        setActiveEvent(null);
        addLog('🏥 You have been revived at town with 50% HP.');
      }, 10000);
      setRespawnTimer(timer);
    }
  };

  const respawnNow = () => {
    if (!isDead) return;
    if (respawnTimer) clearTimeout(respawnTimer);
    setPlayer(prev => {
      if (!prev) return null;
      const respawned = { ...prev, hp: Math.round(prev.max_hp * 0.5) };
      localStorage.setItem('game_player', JSON.stringify(respawned));
      return respawned;
    });
    setIsDead(false);
    setRespawnTimer(null);
    setActiveEvent(null);
    addLog('🏥 You have been revived at town with 50% HP.');
  };

  const advanceDungeon = () => {
    if (!player || !activeEvent || !activeEvent.monster) return;
    
    const nextRoom = dungeonRoom + 1;
    setDungeonRoom(nextRoom);
    
    // Scale sentinel stats based on player level and current room number
    const scalingFactor = 1 + (player.level - 1) * 0.12 + (nextRoom - 1) * 0.25;
    const nextMonster = {
      name: nextRoom === 3 ? 'Dungeon Sentinel Overlord' : `Dungeon Sentinel (Room ${nextRoom})`,
      hp: Math.round(70 * scalingFactor),
      max_hp: Math.round(70 * scalingFactor),
      attack: Math.round(10 * scalingFactor),
      xpReward: Math.round(40 * scalingFactor),
      goldReward: Math.round(35 * scalingFactor),
      lootChance: nextRoom === 3 ? 1.0 : 0.6
    };
    
    // Catch breath heal
    const healedHp = Math.min(player.max_hp, player.hp + Math.round(player.max_hp * 0.25));
    const healedPlayer = { ...player, hp: healedHp };
    setPlayer(healedPlayer);
    localStorage.setItem('game_player', JSON.stringify(healedPlayer));
    
    setActiveEvent({
      ...activeEvent,
      title: nextRoom === 3 ? '⚔️ Dungeon Boss Room' : `⚔️ Dungeon Room ${nextRoom}`,
      description: `You enter Room ${nextRoom}. A hostile sentinel charges at you!`,
      monster: nextMonster
    });
    
    addLog(`🏰 Entered Room ${nextRoom} of the Dungeon.`);
  };

  const claimDungeonTreasure = () => {
    if (!player) return;
    
    const treasureItem = generateRandomItem(Math.random() < 0.25 ? 'Legendary' : 'Rare');
    setInventory(prev => {
      const updated = [...prev, treasureItem];
      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, player.id);
      return updated;
    });
    
    addLog(`🏆 Dungeon Cleared! Found a Rare chest containing: ${treasureItem.name} (${treasureItem.rarity})!`);
    setDungeonRoom(0);
    setActiveEvent(null);
  };

  const gatherMaterials = () => {
    if (!player || !activeEvent || !activeEvent.gathering) return;
    
    const node = activeEvent.gathering;
    const profKey = node.profession;
    const playerProf = player.professions[profKey];

    if (playerProf.level < node.requiredLevel) {
      addLog(`❌ Your ${profKey} level (${playerProf.level}) is too low. Requires Level ${node.requiredLevel}.`);
      return;
    }

    // Material item representation
    const rolledItem: Item = {
      id: Math.random().toString(36).substring(2, 9),
      name: node.materialName,
      type: 'Material',
      rarity: node.requiredLevel >= 5 ? 'Rare' : node.requiredLevel >= 3 ? 'Uncommon' : 'Common',
      value: node.requiredLevel >= 5 ? 100 : node.requiredLevel >= 3 ? 25 : 10,
      quantity: 1
    };

    // Update profession XP
    let newXp = playerProf.xp + node.xpReward;
    let newLevel = playerProf.level;
    let newMaxXp = playerProf.max_xp;
    let lvUpText = '';

    while (newXp >= newMaxXp) {
      newXp -= newMaxXp;
      newLevel += 1;
      newMaxXp = newLevel * 100;
      lvUpText = `📈 Your ${profKey} level increased to ${newLevel}!`;
    }

    const updatedPlayer = {
      ...player,
      professions: {
        ...player.professions,
        [profKey]: {
          level: newLevel,
          xp: newXp,
          max_xp: newMaxXp
        }
      }
    };

    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));

    // Update quest progress if gathering quest is active
    if (node.materialName === 'Iron Ore') {
      updateQuestProgress('mining_materials', 1);
    }
    if (node.materialName === 'Raw Fish') {
      updateQuestProgress('fish_supply', 1);
    }

    setInventory(prev => {
      const existing = prev.find(i => i.name === rolledItem.name);
      let updated;
      if (existing) {
        updated = prev.map(i => i.id === existing.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      } else {
        updated = [...prev, rolledItem];
      }
      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, updatedPlayer.id);
      return updated;
    });

    addLog(`⛏️ Gathered 1x ${node.materialName} (+${node.xpReward} ${profKey} XP)`);
    if (lvUpText) addLog(lvUpText);

    setActiveEvent(null);
    syncPlayerToSupabase(updatedPlayer);
  };

  const claimChest = () => {
    if (!player || !activeEvent || !activeEvent.chestLoot) return;

    const loot = activeEvent.chestLoot;
    let finalPlayer = { ...player };
    
    // Support gold gain or loss
    const newGold = finalPlayer.gold + loot.gold;
    finalPlayer.gold = Math.max(0, newGold);
    
    let rewardText = loot.gold >= 0 
      ? `💰 Found +${loot.gold} Gold during exploration.` 
      : `💸 Lost ${Math.abs(loot.gold)} Gold.`;

    if (loot.xp) {
      finalPlayer = addXP(finalPlayer, loot.xp);
      rewardText += ` ⭐ Gained +${loot.xp} XP.`;
    }

    if (loot.item) {
      const item = loot.item;
      setInventory(prev => {
        const updated = [...prev, item];
        localStorage.setItem('game_inventory', JSON.stringify(updated));
        syncInventoryToSupabase(updated, finalPlayer.id);
        return updated;
      });
      rewardText += ` 🎁 Dropped: ${item.name} (${item.rarity})`;
    }

    setPlayer(finalPlayer);
    localStorage.setItem('game_player', JSON.stringify(finalPlayer));
    addLog(rewardText);
    setActiveEvent(null);
    syncPlayerToSupabase(finalPlayer);
  };

  const completeQuestEvent = () => {
    if (!player || !activeEvent || !activeEvent.quest) return;

    const q = activeEvent.quest;
    // Check if player already has this quest
    const exists = quests.find(uq => uq.quest_id === q.quest_id);
    
    if (exists) {
      if (exists.completed) {
        // Complete the quest for rewards
        let updatedPlayer = { ...player };
        updatedPlayer.gold += q.reward_gold;
        updatedPlayer = addXP(updatedPlayer, q.reward_xp);
        
        // Remove from list or flag as fully resolved
        setQuests(prev => {
          const updated = prev.filter(uq => uq.quest_id !== q.quest_id);
          localStorage.setItem('game_quests', JSON.stringify(updated));
          syncQuestsToSupabase(updated, updatedPlayer.id);
          return updated;
        });

        setPlayer(updatedPlayer);
        localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
        addLog(`💰 Quest "${q.name}" handed in! +${q.reward_gold} Gold, +${q.reward_xp} XP.`);
        syncPlayerToSupabase(updatedPlayer);
      } else {
        addLog(`Quest "${q.name}" is already in progress: ${exists.progress}/${exists.target}`);
      }
    } else {
      // Accept new quest
      const newQuest: Quest = {
        id: Math.random().toString(),
        quest_id: q.quest_id,
        name: q.name,
        progress: 0,
        target: q.target,
        reward_xp: q.reward_xp,
        reward_gold: q.reward_gold,
        completed: false
      };
      
      setQuests(prev => {
        const updated = [...prev, newQuest];
        localStorage.setItem('game_quests', JSON.stringify(updated));
        syncQuestsToSupabase(updated, player.id);
        return updated;
      });
      addLog(`📜 Quest Accepted: "${q.name}" - ${q.description}`);
    }

    setActiveEvent(null);
  };

  const createParty = async () => {
    if (!player) return;
    
    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('parties').insert({
            leader_id: player.id,
            leader_name: player.name,
            status: 'lobby'
          }).select('*');
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const pId = data[0].id;
            const updatedPlayer = { ...player, party_id: pId };
            setPlayer(updatedPlayer);
            localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
            
            await supabase.from('players').update({ party_id: pId, party_ready: true }).eq('id', player.id);
            await syncParty(pId);
            addLog(`🏰 Created co-op party lobby!`);
          }
        } catch (e) {
          console.warn('Failed creating party lobby online: ', e);
        }
      }
    } else {
      const mockParty: Party = {
        id: 'local_party_1',
        leader_id: player.id,
        leader_name: player.name,
        status: 'lobby',
        members: [
          { id: player.id, name: player.name, class: player.class, level: player.level, hp: player.hp, max_hp: player.max_hp, ready: true },
          { id: 'bot_shadow', name: 'ShadowBlade', class: 'Rogue', level: player.level + 1, hp: 100, max_hp: 100, ready: true },
          { id: 'bot_luna', name: 'LunaSkye', class: 'Mage', level: player.level - 1, hp: 80, max_hp: 80, ready: true }
        ]
      };
      setParty(mockParty);
      const updatedPlayer = { ...player, party_id: 'local_party_1' };
      setPlayer(updatedPlayer);
      localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
      addLog(`🏰 Created local practice party (bots joined!)`);
    }
  };

  const sendPartyInvite = async (targetName: string): Promise<boolean> => {
    if (!player || !party) return false;
    
    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data: dbPlayers } = await supabase.from('players').select('id').eq('name', targetName);
          if (dbPlayers && dbPlayers.length > 0) {
            const destId = dbPlayers[0].id;
            const { error } = await supabase.from('party_invites').insert({
              sender_name: player.name,
              receiver_id: destId,
              party_id: party.id
            });
            if (error) throw error;
            addLog(`✉️ Party invitation sent to ${targetName}.`);
            return true;
          } else {
            addLog(`❌ Player "${targetName}" not found.`);
            return false;
          }
        } catch (e) {
          console.warn('Invite send failed: ', e);
          return false;
        }
      }
    } else {
      addLog(`❌ Cannot invite real players offline.`);
    }
    return false;
  };

  const acceptPartyInvite = async (inviteId: string) => {
    if (!player) return;
    
    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data: dbInvites } = await supabase.from('party_invites').select('*').eq('id', inviteId);
          if (dbInvites && dbInvites.length > 0) {
            const pId = dbInvites[0].party_id;
            await supabase.from('party_invites').delete().eq('id', inviteId);
            
            const updatedPlayer = { ...player, party_id: pId };
            setPlayer(updatedPlayer);
            localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
            
            await supabase.from('players').update({ party_id: pId, party_ready: false }).eq('id', player.id);
            await syncParty(pId);
            addLog(`🤝 Joined the party!`);
          }
        } catch (e) {
          console.warn('Failed joining party invite: ', e);
        }
      }
    }
  };

  const declinePartyInvite = async (inviteId: string) => {
    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('party_invites').delete().eq('id', inviteId);
          setIncomingInvites(prev => prev.filter(i => i.id !== inviteId));
        } catch (e) {
          console.warn('Failed decline party invite: ', e);
        }
      }
    }
  };

  const leaveParty = async () => {
    if (!player || !party) return;
    
    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('players').update({ party_id: null, party_ready: false }).eq('id', player.id);
          if (party.leader_id === player.id) {
            await supabase.from('parties').delete().eq('id', party.id);
          }
          
          const updatedPlayer = { ...player, party_id: undefined };
          setPlayer(updatedPlayer);
          localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
          setParty(null);
          addLog(`🏃 You left the party.`);
        } catch (e) {
          console.warn('Failed leaving party: ', e);
        }
      }
    } else {
      const updatedPlayer = { ...player, party_id: undefined };
      setPlayer(updatedPlayer);
      localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
      setParty(null);
      addLog(`🏃 You left the local party.`);
    }
  };

  const togglePartyReady = async () => {
    if (!player || !party) return;
    
    const nextReady = !player.party_ready;
    const updatedPlayer = { ...player, party_ready: nextReady };
    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    
    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('players').update({ party_ready: nextReady }).eq('id', player.id);
          await syncParty(party.id);
        } catch (e) {
          console.warn('Failed toggling ready status: ', e);
        }
      }
    } else {
      setParty(prev => {
        if (!prev) return null;
        return {
          ...prev,
          members: prev.members.map(m => m.id === player.id ? { ...m, ready: nextReady } : m)
        };
      });
    }
  };

  const startCoopAdventure = async () => {
    if (!player || !party) return;
    if (party.leader_id !== player.id) {
      addLog(`❌ Only the party leader (${party.leader_name}) can start the adventure.`);
      return;
    }
    
    if (player.energy < 1) {
      addLog('❌ Out of Energy! Drink an Energy Potion or wait for it to regenerate.');
      return;
    }

    const updatedPlayer = { ...player, energy: player.energy - 1 };
    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    syncPlayerToSupabase(updatedPlayer);
    
    const event = generateRandomEvent(player.level);
    const wovenDescription = generateCoopDescription(
      event.type,
      party.members,
      event.monster?.name
    );
    
    const coopEvent: AdventureEvent & { monster_hp?: number; combat_logs?: string[] } = {
      ...event,
      description: wovenDescription,
      monster_hp: event.monster ? event.monster.hp : undefined,
      combat_logs: []
    };

    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('parties').update({
            status: 'adventuring',
            current_event: coopEvent
          }).eq('id', party.id);
          await syncParty(party.id);
        } catch (e) {
          console.warn('Failed starting co-op adventure: ', e);
        }
      }
    } else {
      setParty(prev => {
        if (!prev) return null;
        return { ...prev, status: 'adventuring', current_event: coopEvent };
      });
      setActiveEvent(coopEvent);
      addLog(`👣 Explored the forest with your party (-1 Energy)...`);
    }
  };

  const coopFightMonster = async () => {
    if (!player || !party || !party.current_event || !party.current_event.monster) return;
    
    const monster = party.current_event.monster;
    let mHP = party.current_event.monster_hp !== undefined ? party.current_event.monster_hp : monster.hp;
    
    if (mHP <= 0) return;
    
    const weapon = inventory.find(i => i.type === 'Weapon' && i.equipped);
    const wAtk = weapon?.stats?.attack || 0;
    const baseDmg = player.strength + wAtk + (player.class === 'Mage' ? 10 : 0);
    const criticalChance = 0.05 + (player.speed * 0.004) + (player.class === 'Rogue' ? 0.15 : 0);
    
    const isCrit = Math.random() < criticalChance;
    let dmg = Math.round(baseDmg * (0.85 + Math.random() * 0.3));
    if (isCrit) dmg = Math.round(dmg * 2.0);
    
    const nextHP = Math.max(0, mHP - dmg);
    const actionLog = `🗡️ ${player.name} (${player.class}) struck for ${dmg} damage!${isCrit ? ' (CRIT)' : ''}`;
    
    if (isOnline) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const nextEvent = {
            ...party.current_event,
            monster_hp: nextHP,
            combat_logs: [...(party.current_event.combat_logs || []), actionLog]
          };

          if (nextHP <= 0) {
            nextEvent.title = 'Co-op Victory!';
            nextEvent.description = `🎉 VICTORY! The monster was slain!\n\n` + nextEvent.combat_logs.join('\n');
            
            let updatedPlayer = { ...player };
            updatedPlayer.gold += monster.goldReward;
            updatedPlayer = addXP(updatedPlayer, monster.xpReward);
            updatedPlayer.total_kills = (updatedPlayer.total_kills || 0) + 1;
            updatedPlayer = checkAchievements(updatedPlayer);
            
            setPlayer(updatedPlayer);
            localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
            syncPlayerToSupabase(updatedPlayer);
            
            addLog(`⚔️ Co-op Victory! Defeated ${monster.name}. Received +${monster.goldReward} Gold.`);
            
            await supabase.from('parties').update({
              status: 'lobby',
              current_event: nextEvent
            }).eq('id', party.id);
          } else {
            await supabase.from('parties').update({ current_event: nextEvent }).eq('id', party.id);
          }
          await syncParty(party.id);
        } catch (e) {
          console.warn('Error in co-op monster hit: ', e);
        }
      }
    } else {
      const botHits: string[] = [];
      let finalHP = nextHP;
      
      if (finalHP > 0) {
        party.members.forEach(m => {
          if (m.id !== player.id && finalHP > 0) {
            const bDmg = Math.round(15 + Math.random() * 15);
            finalHP = Math.max(0, finalHP - bDmg);
            botHits.push(`🗡️ ${m.name} (${m.class}) struck for ${bDmg} damage!`);
          }
        });
      }

      const nextEvent = {
        ...party.current_event,
        monster_hp: finalHP,
        combat_logs: [...(party.current_event.combat_logs || []), actionLog, ...botHits]
      };

      if (finalHP <= 0) {
        nextEvent.title = 'Co-op Victory!';
        nextEvent.description = `🎉 VICTORY! The monster was slain!\n\n` + nextEvent.combat_logs.join('\n');
        
        let updatedPlayer = { ...player };
        updatedPlayer.gold += monster.goldReward;
        updatedPlayer = addXP(updatedPlayer, monster.xpReward);
        updatedPlayer.total_kills = (updatedPlayer.total_kills || 0) + 1;
        updatedPlayer = checkAchievements(updatedPlayer);
        
        setPlayer(updatedPlayer);
        localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
        addLog(`⚔️ Co-op Victory! Defeated ${monster.name}. Received +${monster.goldReward} Gold.`);
        
        setParty(prev => {
          if (!prev) return null;
          return { ...prev, status: 'lobby', current_event: nextEvent };
        });
        setActiveEvent(nextEvent);
      } else {
        const target = party.members[Math.floor(Math.random() * party.members.length)];
        const mDmg = Math.max(1, Math.round(monster.attack * (0.8 + Math.random() * 0.4)));
        nextEvent.combat_logs.push(`👹 ${monster.name} attacks ${target.name} for ${mDmg} damage!`);
        
        if (target.id === player.id) {
          const hurtHP = Math.max(0, player.hp - mDmg);
          const hurtPlayer = { ...player, hp: hurtHP };
          setPlayer(hurtPlayer);
          localStorage.setItem('game_player', JSON.stringify(hurtPlayer));
          
          if (hurtHP <= 0) {
            nextEvent.title = 'Co-op Defeat!';
            nextEvent.description = `💀 DEFEAT! You have fallen in battle!\n\n` + nextEvent.combat_logs.join('\n');
            setIsDead(true);
            setParty(prev => {
              if (!prev) return null;
              return { ...prev, status: 'lobby', current_event: nextEvent };
            });
            setActiveEvent(nextEvent);
            return;
          }
        }
        
        setParty(prev => {
          if (!prev) return null;
          return { ...prev, current_event: nextEvent };
        });
        setActiveEvent(nextEvent);
      }
    }
  };

  const interactMerchant = (action: 'buy' | 'sell' | 'ignore', itemToBuy?: Item) => {
    if (!player) return;
    
    if (action === 'buy' && itemToBuy) {
      if (player.gold < itemToBuy.value) {
        addLog(`❌ Insufficient gold to buy ${itemToBuy.name}!`);
        return;
      }

      const updatedPlayer = {
        ...player,
        gold: player.gold - itemToBuy.value
      };

      setInventory(prev => {
        const updated = [...prev, { ...itemToBuy, id: Math.random().toString(), value: Math.round(itemToBuy.value / 1.5) }];
        localStorage.setItem('game_inventory', JSON.stringify(updated));
        syncInventoryToSupabase(updated, updatedPlayer.id);
        return updated;
      });
      
      setPlayer(updatedPlayer);
      localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
      addLog(`🛒 Purchased ${itemToBuy.name} for ${itemToBuy.value} gold.`);
      syncPlayerToSupabase(updatedPlayer);
    } 
    else if (action === 'sell') {
      // Sell all materials at a premium
      const materials = inventory.filter(i => i.type === 'Material');
      if (materials.length === 0) {
        addLog(`🛒 You have no materials to sell.`);
        return;
      }

      let totalEarned = 0;
      materials.forEach(m => {
        totalEarned += Math.round(m.value * 1.25) * (m.quantity || 1);
      });

      const updatedPlayer = {
        ...player,
        gold: player.gold + totalEarned
      };

      setInventory(prev => {
        const updated = prev.filter(i => i.type !== 'Material');
        localStorage.setItem('game_inventory', JSON.stringify(updated));
        syncInventoryToSupabase(updated, updatedPlayer.id);
        return updated;
      });

      setPlayer(updatedPlayer);
      localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
      addLog(`🛒 Sold all materials to merchant for a premium of +${totalEarned} Gold!`);
      syncPlayerToSupabase(updatedPlayer);
    }

    setActiveEvent(null);
  };

  const dismissEvent = () => {
    setActiveEvent(null);
  };

  // Claim Streak Calendar
  const claimDailyReward = () => {
    if (!player) return;
    
    // Check if already claimed today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    if (player.last_daily_claim === today) {
      addLog('❌ You already claimed your daily reward today! Come back tomorrow.');
      return;
    }

    const finalPlayer = { ...player };

    // Calculate streak: if last claim was yesterday, increment; otherwise reset to 1
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (finalPlayer.last_daily_claim === yesterday) {
      finalPlayer.daily_streak = (finalPlayer.daily_streak || 0) + 1;
    } else {
      finalPlayer.daily_streak = 1;
    }
    finalPlayer.last_daily_claim = today;

    // Scaling rewards based on streak
    const streakDay = finalPlayer.daily_streak;
    let diamondReward = 10;
    let goldReward = 100;
    if (streakDay >= 14) { diamondReward = 100; goldReward = 500; }
    else if (streakDay >= 7) { diamondReward = 50; goldReward = 300; }
    else if (streakDay >= 3) { diamondReward = 20; goldReward = 150; }

    finalPlayer.diamonds += diamondReward;
    finalPlayer.gold += goldReward;

    // Every 7th day gives a bonus rare item
    let bonusMsg = '';
    if (streakDay % 7 === 0) {
      const bonusItem = generateRandomItem('Rare');
      setInventory(prev => {
        const updated = [...prev, bonusItem];
        localStorage.setItem('game_inventory', JSON.stringify(updated));
        syncInventoryToSupabase(updated, finalPlayer.id);
        return updated;
      });
      bonusMsg = ` + 🎁 Bonus: ${bonusItem.name} (${bonusItem.rarity})!`;
    }

    setPlayer(finalPlayer);
    localStorage.setItem('game_player', JSON.stringify(finalPlayer));
    addLog(`🎁 Day ${streakDay} Streak! Claimed +${diamondReward} 💎, +${goldReward} Gold${bonusMsg}`);
    syncPlayerToSupabase(finalPlayer);
  };

  // Inventory actions
  const equipItem = (itemId: string) => {
    if (!player) return;
    
    setInventory(prev => {
      const target = prev.find(i => i.id === itemId);
      if (!target) return prev;

      // Unequip current item of same type
      const updated = prev.map(item => {
        if (item.type === target.type && item.equipped) {
          return { ...item, equipped: false };
        }
        if (item.id === itemId) {
          return { ...item, equipped: true };
        }
        return item;
      });

      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, player.id);
      addLog(`🛡️ Equipped: ${target.name}`);
      return updated;
    });
  };

  const unequipItem = (itemId: string) => {
    if (!player) return;

    setInventory(prev => {
      const target = prev.find(i => i.id === itemId);
      if (!target) return prev;

      const updated = prev.map(item => {
        if (item.id === itemId) {
          return { ...item, equipped: false };
        }
        return item;
      });

      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, player.id);
      addLog(`🛡️ Unequipped: ${target.name}`);
      return updated;
    });
  };

  const sellItem = (itemId: string) => {
    if (!player) return;

    setInventory(prev => {
      const target = prev.find(i => i.id === itemId);
      if (!target) return prev;

      const price = target.value;
      const quantity = target.quantity || 1;
      const earnings = price * quantity;

      // Deduct or remove
      const updated = prev.filter(i => i.id !== itemId);
      
      setPlayer(curr => {
        if (!curr) return null;
        const updatedPlayer = { ...curr, gold: curr.gold + earnings };
        localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
        syncPlayerToSupabase(updatedPlayer);
        return updatedPlayer;
      });

      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, player.id);
      addLog(`💰 Sold ${target.name} for +${earnings} Gold.`);
      return updated;
    });
  };

  const useItem = (itemId: string) => {
    if (!player) return;

    setInventory(prev => {
      const target = prev.find(i => i.id === itemId);
      if (!target || target.type !== 'Consumable') return prev;

      let healed = false;
      let restoredEnergy = false;
      let finalPlayer = { ...player };

      if (target.name.includes('Health') || target.name.includes('HP')) {
        const healAmt = target.name.includes('Greater') ? 100 : 40;
        finalPlayer.hp = Math.min(finalPlayer.max_hp, finalPlayer.hp + healAmt);
        addLog(`🧪 Drank ${target.name}. Restored +${healAmt} HP.`);
        healed = true;
      } 
      else if (target.name.includes('Energy')) {
        finalPlayer.energy = Math.min(finalPlayer.max_energy, finalPlayer.energy + 40);
        addLog(`🧪 Drank ${target.name}. Restored +40 Energy.`);
        restoredEnergy = true;
      } 
      else if (target.name.includes('Stamina')) {
        finalPlayer.stamina = Math.min(finalPlayer.max_stamina, finalPlayer.stamina + 4);
        addLog(`🧪 Drank ${target.name}. Restored +4 Stamina.`);
        restoredEnergy = true;
      }

      if (healed || restoredEnergy) {
        setPlayer(finalPlayer);
        localStorage.setItem('game_player', JSON.stringify(finalPlayer));
        syncPlayerToSupabase(finalPlayer);

        // Decrement consumable count
        let updated;
        if (target.quantity && target.quantity > 1) {
          updated = prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity! - 1 } : i);
        } else {
          updated = prev.filter(i => i.id !== itemId);
        }

        localStorage.setItem('game_inventory', JSON.stringify(updated));
        syncInventoryToSupabase(updated, finalPlayer.id);
        return updated;
      }

      return prev;
    });
  };

  const buyShopItem = (itemName: string, cost: number, itemType: ItemType, rarity: ItemRarity) => {
    if (!player) return;
    if (player.gold < cost) {
      addLog('❌ Not enough Gold to buy potion!');
      return;
    }

    const updatedPlayer = { ...player, gold: player.gold - cost };
    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));

    const purchasedItem: Item = {
      id: Math.random().toString(36).substring(2, 9),
      name: itemName,
      type: itemType,
      rarity: rarity,
      value: Math.round(cost / 2),
      quantity: 1
    };

    setInventory(prev => {
      const existing = prev.find(i => i.name === itemName);
      let updated;
      if (existing) {
        updated = prev.map(i => i.id === existing.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      } else {
        updated = [...prev, purchasedItem];
      }
      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, updatedPlayer.id);
      return updated;
    });

    addLog(`🛒 Bought ${itemName} from shop for ${cost} Gold.`);
    syncPlayerToSupabase(updatedPlayer);
  };

  const craftItem = (recipeName: string) => {
    if (!player) return;

    const recipe = CRAFTING_RECIPES.find(r => r.resultName === recipeName);
    if (!recipe) return;

    if (player.professions.blacksmithing.level < recipe.levelRequired) {
      addLog(`❌ Blacksmithing level (${player.professions.blacksmithing.level}) too low. Requires level ${recipe.levelRequired}.`);
      return;
    }

    // Verify materials
    let hasMats = true;
    recipe.materials.forEach(req => {
      const held = inventory.find(i => i.name === req.name);
      if (!held || (held.quantity || 1) < req.quantity) {
        hasMats = false;
      }
    });

    if (!hasMats) {
      addLog('❌ Insufficient crafting materials!');
      return;
    }

    // Deduct materials
    setInventory(prev => {
      let updated = [...prev];
      recipe.materials.forEach(req => {
        const held = updated.find(i => i.name === req.name)!;
        if (held.quantity && held.quantity > req.quantity) {
          updated = updated.map(item => item.id === held.id ? { ...item, quantity: item.quantity! - req.quantity } : item);
        } else {
          updated = updated.filter(item => item.id !== held.id);
        }
      });

      // Add crafted item
      const baseOptions = generateRandomItem(recipe.resultRarity);
      const craftedItem: Item = {
        ...baseOptions,
        name: recipe.resultName,
        type: recipe.resultType,
        rarity: recipe.resultRarity,
      };

      updated.push(craftedItem);
      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, player.id);
      return updated;
    });

    // Update blacksmithing XP
    const bs = player.professions.blacksmithing;
    let newXp = bs.xp + recipe.rewardXp;
    let newLevel = bs.level;
    let newMaxXp = bs.max_xp;
    let bsLvUpText = '';

    while (newXp >= newMaxXp) {
      newXp -= newMaxXp;
      newLevel += 1;
      newMaxXp = newLevel * 100;
      bsLvUpText = `📈 Your blacksmithing level increased to ${newLevel}!`;
    }

    let updatedPlayer = {
      ...player,
      total_crafts: (player.total_crafts || 0) + 1,
      professions: {
        ...player.professions,
        blacksmithing: {
          level: newLevel,
          xp: newXp,
          max_xp: newMaxXp
        }
      }
    };

    updatedPlayer = checkAchievements(updatedPlayer);

    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));

    addLog(`🔨 Crafted ${recipe.resultName} (+${recipe.rewardXp} Blacksmithing XP).`);
    if (bsLvUpText) addLog(bsLvUpText);
    syncPlayerToSupabase(updatedPlayer);
  };

  // Chat
  const addChatMessage = async (msg: string) => {
    if (!player) return;
    
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      player_name: player.name,
      message: msg,
      created_at: new Date().toLocaleTimeString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('global_chat').insert({
          player_name: player.name,
          message: msg
        });
      } catch (e) {
        console.warn('Failed inserting chat to Supabase: ', e);
      }
    } else {
      setChatMessages(prev => [...prev, newMsg].slice(-30));
    }
  };

  // Marketplace
  const listMarketItem = async (itemId: string, price: number) => {
    if (!player) return;
    
    const target = inventory.find(i => i.id === itemId);
    if (!target) return;

    // Remove from inventory
    setInventory(prev => {
      const updated = prev.filter(i => i.id !== itemId);
      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, player.id);
      return updated;
    });

    const newListing: MarketListing = {
      id: Math.random().toString(),
      seller_id: player.id,
      seller_name: player.name,
      item_name: target.name,
      item_type: target.type,
      item_rarity: target.rarity,
      item_value: target.value,
      price,
      quantity: 1,
      stats: target.stats,
      created_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('market_listings').insert({
          seller_id: player.id,
          seller_name: player.name,
          item_name: target.name,
          item_type: target.type,
          item_rarity: target.rarity,
          item_value: target.value,
          price,
          quantity: 1,
          stats: target.stats
        });
      } catch (e) {
        console.warn('Failed listing on Supabase marketplace: ', e);
      }
    } else {
      setMarketListings(prev => [newListing, ...prev]);
    }

    addLog(`🏪 Listed ${target.name} on the marketplace for ${price} Gold.`);
  };

  const buyMarketItem = async (listingId: string) => {
    if (!player) return;

    const listing = marketListings.find(l => l.id === listingId);
    if (!listing) return;

    if (player.gold < listing.price) {
      addLog('❌ Not enough Gold to buy this listing!');
      return;
    }

    // Spend gold
    const updatedPlayer = {
      ...player,
      gold: player.gold - listing.price
    };
    setPlayer(updatedPlayer);
    localStorage.setItem('game_player', JSON.stringify(updatedPlayer));
    syncPlayerToSupabase(updatedPlayer);

    // Remove listing
    setMarketListings(prev => prev.filter(l => l.id !== listingId));

    // Add item to inventory
    const boughtItem: Item = {
      id: Math.random().toString(),
      name: listing.item_name,
      type: listing.item_type,
      rarity: listing.item_rarity,
      value: listing.item_value,
      equipped: false,
      quantity: 1,
      stats: listing.stats
    };

    setInventory(prev => {
      const updated = [...prev, boughtItem];
      localStorage.setItem('game_inventory', JSON.stringify(updated));
      syncInventoryToSupabase(updated, updatedPlayer.id);
      return updated;
    });

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('market_listings').delete().eq('id', listingId);
        // Credit the seller online in a real backend, for now we delete listing
      } catch (e) {
        console.warn('Failed completing transaction in Supabase: ', e);
      }
    }

    addLog(`🛒 Purchased ${listing.item_name} from the marketplace for ${listing.price} Gold.`);
  };

  // Configure Supabase Settings
  const configureSupabase = async (url: string, key: string): Promise<boolean> => {
    if (!url || !key) {
      saveCredentials('', '');
      setIsOnline(false);
      return true;
    }

    saveCredentials(url, key);
    const success = isSupabaseConfigured();
    setIsOnline(success);

    if (success) {
      addLog('Connected to Supabase. Syncing character progress...');
      await syncFromSupabaseDb();
      return true;
    } else {
      setSupabaseError('Could not initialize client. Verify URL/Key');
      return false;
    }
  };

  const resetLocalData = () => {
    localStorage.clear();
    setUser(null);
    setPlayer(null);
    setInventory([]);
    setQuests([]);
    setActiveEvent(null);
    setAdventureLog(['Data Reset complete.']);
    window.location.reload();
  };

  return (
    <GameContext.Provider value={{
      user,
      player,
      setPlayer,
      inventory,
      quests,
      chatMessages,
      marketListings,
      activeEvent,
      adventureLog,
      currentView,
      loading,
      isOnline,
      supabaseError,
      
      login,
      register,
      logout,
      createCharacter,
      setCurrentView,
      startAdventure,
      fightMonster,
      gatherMaterials,
      claimChest,
      completeQuestEvent,
      interactMerchant,
      dismissEvent,
      claimDailyReward,
      equipItem,
      unequipItem,
      sellItem,
      useItem,
      buyShopItem,
      craftItem,
      addChatMessage,
      listMarketItem,
      buyMarketItem,
      configureSupabase,
      resetLocalData,
      activeJobId,
      activeJobEndTime,
      startJob,
      claimJobReward,
      cancelJob,
      allocateStat,
      isDead,
      respawnNow,
      checkAchievements,
      dungeonRoom,
      advanceDungeon,
      claimDungeonTreasure,
      party,
      incomingInvites,
      createParty,
      sendPartyInvite,
      acceptPartyInvite,
      declinePartyInvite,
      leaveParty,
      togglePartyReady,
      startCoopAdventure,
      coopFightMonster,
      startGroupDungeon,
      claimGroupDungeonRewards,
      startSoloDungeon,
      startRegionalBossFight,
      grindProfession
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
